/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, ChangeEvent } from 'react';
import {
  initDB,
  getAllReports,
  putReport,
  deleteReport,
  hasPassword,
  savePassword,
  verifyPassword,
  downloadFile
} from './db';
import { ReportItem, SAMPLE_REPORTS } from './sampleReports';

interface PendingReport {
  filename: string;
  date: string;
  category: '데일리' | '위클리' | '기획 시황';
  title: string;
  html: string;
}

export default function App() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // View state: 'archive' or 'admin'
  const [view, setView] = useState<'archive' | 'admin'>('archive');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [isPasswordRegistered, setIsPasswordRegistered] = useState<boolean>(false);

  // Auth inputs
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState<string>('');

  // Password change inputs
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');

  // Pending file upload
  const [pendingList, setPendingList] = useState<PendingReport[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  // Active Report in Viewer
  const [activeReport, setActiveReport] = useState<ReportItem | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3600);
  };

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        await initDB();
        await reloadReports();
        const hasPw = await hasPassword();
        setIsPasswordRegistered(hasPw);
      } catch (err: any) {
        showToast('저장소 초기화 오류: ' + (err?.message || err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const reloadReports = async () => {
    const list = await getAllReports();
    list.sort((a, b) => b.date.localeCompare(a.date) || b.created.localeCompare(a.created));
    setReports(list);
  };

  // Years list
  const availableYears = useMemo(() => {
    const set = new Set<string>();
    reports.forEach(r => {
      if (r.date && r.date.length >= 4) {
        set.add(r.date.slice(0, 4));
      }
    });
    return Array.from(set).sort().reverse();
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return reports.filter(r => {
      const matchTab = activeTab === '전체' || r.category === activeTab;
      const matchYear = !selectedYear || r.date.startsWith(selectedYear);
      const matchSearch =
        !q ||
        (r.title + ' ' + r.date + ' ' + r.category).toLowerCase().includes(q);
      return matchTab && matchYear && matchSearch;
    });
  }, [reports, activeTab, selectedYear, searchQuery]);

  // Group by Month (YYYY-MM)
  const groupedByMonth = useMemo(() => {
    const map: Record<string, ReportItem[]> = {};
    filteredReports.forEach(r => {
      const m = r.date.slice(0, 7) || '기타';
      if (!map[m]) map[m] = [];
      map[m].push(r);
    });
    return Object.entries(map);
  }, [filteredReports]);

  // Open viewer
  const handleOpenReport = (report: ReportItem) => {
    setActiveReport(report);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseViewer = () => {
    setActiveReport(null);
    document.body.style.overflow = '';
  };

  const handlePrint = () => {
    try {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      }
    } catch {
      showToast('인쇄가 차단되었습니다. 브라우저에서 인쇄 권한을 확인해 주세요.');
    }
  };

  const handleDownloadReport = (r: ReportItem) => {
    downloadFile(r.filename || `${r.date}.html`, r.html, 'text/html;charset=utf-8');
  };

  // Admin page navigation
  const handleEnterAdmin = async () => {
    const hasPw = await hasPassword();
    setIsPasswordRegistered(hasPw);
    setView('admin');
  };

  const handleBackToArchive = () => {
    setView('archive');
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    setAuthPassword('');
    setAuthConfirmPassword('');
    showToast('관리자 화면이 잠겼습니다.');
  };

  // Admin Authenticate / Register
  const handleAuthSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isPasswordRegistered) {
      if (authPassword.length < 8) {
        showToast('암호는 8자 이상 입력해 주세요.');
        return;
      }
      if (authPassword !== authConfirmPassword) {
        showToast('암호 확인이 일치하지 않습니다.');
        return;
      }
      try {
        await savePassword(authPassword);
        setIsPasswordRegistered(true);
        setIsAdminUnlocked(true);
        setAuthPassword('');
        setAuthConfirmPassword('');
        showToast('관리자 암호가 등록되었으며 인증되었습니다.');
      } catch (err: any) {
        showToast('암호 저장 실패: ' + (err?.message || err));
      }
    } else {
      try {
        const ok = await verifyPassword(authPassword);
        if (!ok) {
          showToast('관리자 암호가 올바르지 않습니다.');
          return;
        }
        setIsAdminUnlocked(true);
        setAuthPassword('');
        showToast('관리자 인증이 완료되었습니다.');
      } catch (err: any) {
        showToast('인증 오류: ' + (err?.message || err));
      }
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!isAdminUnlocked) return;
    if (newPassword.length < 8 || newPassword !== newPasswordConfirm) {
      showToast('8자 이상의 동일한 새 암호를 입력해 주세요.');
      return;
    }
    try {
      await savePassword(newPassword);
      setNewPassword('');
      setNewPasswordConfirm('');
      showToast('관리자 암호를 변경했습니다.');
    } catch (err: any) {
      showToast('암호 변경 실패: ' + (err?.message || err));
    }
  };

  // File parsing helpers
  const parseDateFromFilename = (filename: string): string => {
    const m = filename.match(/(20\d{2})[-_.]?(0[1-9]|1[0-2])[-_.]?([0-3]\d)/);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : new Date().toISOString().slice(0, 10);
  };

  const inferCategory = (filename: string): '데일리' | '위클리' | '기획 시황' => {
    if (/weekly|위클리/i.test(filename)) return '위클리';
    if (/special|기획/i.test(filename)) return '기획 시황';
    return '데일리';
  };

  const handleFilesSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const list: PendingReport[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!/\.html?$/i.test(file.name)) {
        showToast('HTML 파일만 등록할 수 있습니다: ' + file.name);
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        showToast('15MB를 초과하는 HTML 파일은 제외됩니다: ' + file.name);
        continue;
      }

      const text = await file.text();
      list.push({
        filename: file.name,
        date: parseDateFromFilename(file.name),
        category: inferCategory(file.name),
        title: file.name.replace(/\.html?$/i, '').replace(/[_-]/g, ' '),
        html: text
      });
    }

    setPendingList(prev => [...prev, ...list]);
  };

  const updatePending = (idx: number, key: keyof PendingReport, value: string) => {
    setPendingList(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };

  const removePending = (idx: number) => {
    setPendingList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveReports = async () => {
    for (const item of pendingList) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !Number.isFinite(Date.parse(item.date))) {
        showToast('올바른 날짜를 입력해 주세요.');
        return;
      }
      if (!item.title.trim()) {
        showToast('보고서 제목을 입력해 주세요.');
        return;
      }
    }

    try {
      for (const item of pendingList) {
        const newReport: ReportItem = {
          id: crypto.randomUUID ? crypto.randomUUID() : 'rep-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
          date: item.date,
          category: item.category,
          title: item.title.trim(),
          filename: item.filename,
          html: item.html,
          created: new Date().toISOString()
        };
        await putReport(newReport);
      }
      const count = pendingList.length;
      setPendingList([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await reloadReports();
      showToast(`${count}개 HTML 보고서가 저장되었습니다.`);
    } catch (err: any) {
      showToast('보고서 저장 실패: ' + (err?.message || err));
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!isAdminUnlocked) {
      showToast('관리자 인증이 필요합니다.');
      return;
    }
    if (!window.confirm('이 보고서를 삭제할까요? 삭제 후 복구할 수 없습니다.')) {
      return;
    }
    try {
      await deleteReport(id);
      await reloadReports();
      showToast('보고서를 삭제했습니다.');
    } catch (err: any) {
      showToast('보고서 삭제 실패: ' + (err?.message || err));
    }
  };

  // Backup & Restore
  const handleBackup = () => {
    if (!isAdminUnlocked) return;
    const jsonStr = JSON.stringify(
      { format: 'chemMarketHTMLArchive_v1', reports },
      null,
      2
    );
    const today = new Date().toISOString().slice(0, 10);
    downloadFile(`ChemMarket_Backup_${today}.json`, jsonStr, 'application/json');
    showToast('전체 백업 파일 다운로드가 시작되었습니다.');
  };

  const handleRestore = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!isAdminUnlocked) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.format !== 'chemMarketHTMLArchive_v1' || !Array.isArray(data.reports)) {
        throw new Error('올바른 백업 파일(chemMarketHTMLArchive_v1)이 아닙니다.');
      }
      if (!window.confirm(`${data.reports.length}개 보고서를 복원할까요? 기존 데이터와 병합됩니다.`)) {
        return;
      }

      for (const r of data.reports) {
        if (
          typeof r.id !== 'string' ||
          typeof r.html !== 'string' ||
          typeof r.date !== 'string' ||
          typeof r.title !== 'string' ||
          !['데일리', '위클리', '기획 시황'].includes(r.category)
        ) {
          throw new Error('백업 데이터 항목의 형식이 올바르지 않습니다.');
        }
        await putReport(r);
      }

      await reloadReports();
      showToast('복원이 완료되었습니다.');
    } catch (err: any) {
      showToast('복원 실패: ' + (err?.message || err));
    } finally {
      if (restoreInputRef.current) restoreInputRef.current.value = '';
    }
  };

  // Restore sample reports helper
  const handleRestoreSampleReports = async () => {
    if (!window.confirm('기본 샘플 보고서(4종)를 추가하시겠습니까?')) return;
    for (const r of SAMPLE_REPORTS) {
      await putReport(r);
    }
    await reloadReports();
    showToast('샘플 보고서가 등록되었습니다.');
  };

  return (
    <div>
      {/* Header */}
      <header className="chem-header">
        <small>GLOBAL PETROCHEMICAL INSIGHTS</small>
        <h1>ChemMarket Intelligence</h1>
        <p>석유화학 시황 · 가격 · 인사이트 | HTML 보고서 보관소</p>
      </header>

      <main className="wrap">
        {/* Archive View */}
        {view === 'archive' && (
          <div id="archiveView">
            <div className="toolbar">
              <div className="tabs" id="tabs">
                {(['전체', '데일리', '위클리', '기획 시황'] as const).map(tab => (
                  <button
                    key={tab}
                    data-filter={tab}
                    className={activeTab === tab ? 'active' : ''}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <input
                className="search"
                id="search"
                placeholder="날짜, 제목 검색"
                aria-label="보고서 검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />

              <select
                id="year"
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
              >
                <option value="">전체 연도</option>
                {availableYears.map(y => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>

              <button
                className="btn alt adminlink"
                id="adminBtn"
                onClick={handleEnterAdmin}
              >
                🔒 관리자
              </button>
            </div>

            <p className="muted" id="count" style={{ margin: '14px 2px' }}>
              총 {filteredReports.length}건 · 전체 보관 {reports.length}건
            </p>

            <div id="reportList">
              {groupedByMonth.length === 0 ? (
                <div className="month empty">
                  등록된 보고서가 없습니다. 관리자가 HTML 보고서를 등록하면 이곳에 표시됩니다.
                  <div style={{ marginTop: '14px' }}>
                    <button
                      className="btn alt"
                      style={{ fontSize: '13px' }}
                      onClick={handleRestoreSampleReports}
                    >
                      샘플 보고서 불러오기 (데모 데이터)
                    </button>
                  </div>
                </div>
              ) : (
                groupedByMonth.map(([monthKey, items]) => (
                  <section key={monthKey} className="month">
                    <h3>{monthKey}</h3>
                    {items.map(item => (
                      <div key={item.id} className="row">
                        <span className="date">{item.date}</span>
                        <span
                          className={`tag ${
                            item.category === '위클리'
                              ? 'weekly'
                              : item.category === '기획 시황'
                              ? 'special'
                              : ''
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="title">{item.title}</span>
                        <div className="actions">
                          <button
                            className="btn"
                            onClick={() => handleOpenReport(item)}
                          >
                            리포트 보기
                          </button>
                        </div>
                      </div>
                    ))}
                  </section>
                ))
              )}
            </div>
          </div>
        )}

        {/* Admin View */}
        {view === 'admin' && (
          <section id="adminView">
            <div className="toolbar">
              <button className="btn alt" id="backBtn" onClick={handleBackToArchive}>
                ← 보관소로 돌아가기
              </button>
              <strong>🔐 보고서 관리자</strong>
              {isAdminUnlocked && (
                <button
                  id="lockBtn"
                  className="btn alt adminlink"
                  onClick={handleLockAdmin}
                >
                  로그아웃 / 잠금
                </button>
              )}
            </div>

            {/* Locked: Auth Panel */}
            {!isAdminUnlocked ? (
              <div className="panel" id="authPanel">
                <h2 id="authTitle">
                  {!isPasswordRegistered ? '1. 최초 관리자 암호 설정' : '1. 관리자 인증'}
                </h2>

                {!isPasswordRegistered && (
                  <div id="setupHelp" className="notice">
                    최초 실행입니다. 관리자 암호를 설정하세요. 이 암호는 현재 브라우저에만 등록됩니다.
                  </div>
                )}

                <form onSubmit={handleAuthSubmit}>
                  <div className="field">
                    <label htmlFor="password">관리자 암호 (8자 이상)</label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="관리자 암호"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                    />
                  </div>

                  {!isPasswordRegistered && (
                    <div id="confirmWrap" className="field">
                      <label htmlFor="confirmPassword">암호 재입력</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="관리자 암호 확인"
                        value={authConfirmPassword}
                        onChange={e => setAuthConfirmPassword(e.target.value)}
                      />
                    </div>
                  )}

                  <button id="authSubmit" type="submit" className="btn" style={{ marginTop: '8px' }}>
                    {!isPasswordRegistered ? '관리자 암호 설정' : '인증'}
                  </button>
                </form>

                <p className="mini">
                  이 파일의 암호 기능은 로컬 브라우저 편집 화면을 잠그는 기능입니다. 서버에서 검증하는 실제 사용자 권한 관리가 아닙니다.
                </p>
              </div>
            ) : (
              /* Unlocked: Editor & Management */
              <div id="editor">
                {/* 2. HTML 보고서 등록 */}
                <div className="panel">
                  <h2>2. HTML 보고서 등록</h2>
                  <div className="notice">
                    보고서는 <b>HTML 파일(.html, .htm)</b>로 업로드합니다. 여러 개를 한 번에 선택할 수 있으며, 날짜·분류·제목은 등록 전에 수정할 수 있습니다. 동일 날짜/분류의 보고서도 별도로 보관됩니다.
                  </div>

                  <div
                    className="filebox"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📄 <b>HTML 파일 선택</b>
                    <br />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      (클릭하거나 드래그하여 .html 파일을 추가하세요)
                    </span>
                    <br />
                    <br />
                    <input
                      ref={fileInputRef}
                      id="files"
                      type="file"
                      accept=".html,.htm,text/html"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFilesSelected}
                    />
                  </div>

                  {pendingList.length > 0 && (
                    <div id="pending" style={{ margin: '18px 0' }}>
                      {pendingList.map((p, idx) => (
                        <div
                          key={idx}
                          className="panel"
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #dae3ed',
                            marginTop: '12px'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '8px'
                            }}
                          >
                            <b style={{ color: '#0f2744' }}>{p.filename}</b>
                            <button
                              type="button"
                              className="btn alt"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                              onClick={() => removePending(idx)}
                            >
                              제거
                            </button>
                          </div>
                          <div className="field">
                            <label>보고서 날짜</label>
                            <input
                              type="date"
                              value={p.date}
                              onChange={e => updatePending(idx, 'date', e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label>분류</label>
                            <select
                              value={p.category}
                              onChange={e =>
                                updatePending(
                                  idx,
                                  'category',
                                  e.target.value as '데일리' | '위클리' | '기획 시황'
                                )
                              }
                            >
                              <option value="데일리">데일리</option>
                              <option value="위클리">위클리</option>
                              <option value="기획 시황">기획 시황</option>
                            </select>
                          </div>
                          <div className="field">
                            <label>보고서 제목</label>
                            <input
                              type="text"
                              value={p.title}
                              onChange={e => updatePending(idx, 'title', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn green"
                    id="saveReports"
                    disabled={pendingList.length === 0}
                    onClick={handleSaveReports}
                  >
                    선택한 HTML 보고서 저장
                  </button>
                </div>

                {/* 3. 등록 보고서 관리 */}
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 style={{ margin: 0 }}>3. 등록 보고서 관리</h2>
                    <button
                      className="btn alt"
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                      onClick={handleRestoreSampleReports}
                    >
                      + 샘플 보고서 추가
                    </button>
                  </div>
                  <div id="manageList">
                    {reports.length === 0 ? (
                      <p className="muted">등록된 보고서가 없습니다.</p>
                    ) : (
                      reports.map(r => (
                        <div key={r.id} className="row">
                          <span className="date">{r.date}</span>
                          <span
                            className={`tag ${
                              r.category === '위클리'
                                ? 'weekly'
                                : r.category === '기획 시황'
                                ? 'special'
                                : ''
                            }`}
                          >
                            {r.category}
                          </span>
                          <span className="title">{r.title}</span>
                          <div className="actions">
                            <button
                              className="btn alt"
                              onClick={() => handleOpenReport(r)}
                            >
                              보기
                            </button>
                            <button
                              className="btn alt"
                              onClick={() => handleDownloadReport(r)}
                            >
                              HTML 받기
                            </button>
                            <button
                              className="btn danger"
                              onClick={() => handleDeleteReport(r.id)}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. 보관 데이터 백업 / 복원 */}
                <div className="panel">
                  <h2>4. 보관 데이터 백업 / 복원</h2>
                  <p className="mini">
                    HTML 파일과 등록 정보를 JSON 파일로 백업합니다. 다른 PC로 옮길 때 백업 파일을 가져와 복원할 수 있습니다. 복원 시 기존 보고서는 유지하고 ID가 같은 보고서는 덮어씁니다.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="btn alt" id="backup" onClick={handleBackup}>
                      전체 백업 다운로드
                    </button>
                    <input
                      ref={restoreInputRef}
                      id="restore"
                      type="file"
                      accept=".json,application/json"
                      style={{ maxWidth: '260px' }}
                      onChange={handleRestore}
                    />
                  </div>
                </div>

                {/* 5. 관리자 암호 변경 */}
                <div className="panel">
                  <h2>5. 관리자 암호 변경</h2>
                  <div className="field">
                    <label>새 관리자 암호</label>
                    <input
                      id="newPass"
                      type="password"
                      minLength={8}
                      placeholder="8자 이상"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>새 관리자 암호 확인</label>
                    <input
                      id="newPass2"
                      type="password"
                      minLength={8}
                      placeholder="새 암호 다시 입력"
                      value={newPasswordConfirm}
                      onChange={e => setNewPasswordConfirm(e.target.value)}
                    />
                  </div>
                  <button
                    id="changePass"
                    className="btn alt"
                    onClick={handleChangePassword}
                  >
                    암호 변경
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Viewer Modal */}
      {activeReport && (
        <div className="viewer" id="viewer">
          <div className="viewerbar">
            <button
              id="closeViewer"
              className="btn alt"
              onClick={handleCloseViewer}
            >
              ← 목록
            </button>
            <strong id="viewerTitle">
              {activeReport.date} | {activeReport.title}
            </strong>
            <button
              id="printReport"
              className="btn"
              onClick={handlePrint}
            >
              🖨 인쇄 / PDF 저장
            </button>
            <button
              id="downloadReport"
              className="btn alt"
              onClick={() => handleDownloadReport(activeReport)}
            >
              HTML 다운로드
            </button>
          </div>
          <iframe
            ref={iframeRef}
            id="reportFrame"
            title="HTML 보고서"
            sandbox="allow-same-origin allow-modals"
            srcDoc={activeReport.html}
          />
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div id="toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
