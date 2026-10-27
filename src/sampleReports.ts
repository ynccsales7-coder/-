export interface ReportItem {
  id: string;
  date: string;
  category: '데일리' | '위클리' | '기획 시황';
  title: string;
  filename: string;
  html: string;
  created: string;
}

export const SAMPLE_REPORTS: ReportItem[] = [
  {
    id: 'sample-report-2026-10-24-daily',
    date: '2026-10-24',
    category: '데일리',
    title: '아시아 에틸렌·프로필렌 스프레드 및 납사 시황 일일 동향',
    filename: '2026-10-24_daily_olefins_market.html',
    created: '2026-10-24T09:00:00.000Z',
    html: `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>ChemMarket Daily - 아시아 에틸렌·프로필렌 스프레드 및 납사 시황</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Malgun Gothic", sans-serif; margin: 0; padding: 36px 28px; background: #ffffff; color: #1e293b; line-height: 1.6; }
    .header { border-bottom: 2px solid #0f2b48; padding-bottom: 18px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-end; }
    .header h1 { margin: 0 0 6px; font-size: 24px; color: #0a1f36; }
    .header .meta { font-size: 13px; color: #64748b; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 700; color: #1747ad; background: #e1edff; border-radius: 4px; margin-bottom: 8px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 28px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .card .label { font-size: 12px; color: #64748b; font-weight: 600; }
    .card .val { font-size: 22px; font-weight: 800; color: #0f2744; margin: 6px 0 2px; }
    .card .chg { font-size: 12px; font-weight: 700; }
    .chg.up { color: #dc2626; }
    .chg.down { color: #2563eb; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 28px; font-size: 13px; }
    th { background: #0f2b48; color: #ffffff; text-align: left; padding: 10px 12px; font-weight: 600; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    h2 { font-size: 17px; color: #0a1f36; border-left: 4px solid #1652f0; padding-left: 10px; margin: 28px 0 14px; }
    p { margin: 8px 0 14px; font-size: 14px; color: #334155; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">석유화학 데일리 리포트</span>
      <h1>아시아 에틸렌·프로필렌 스프레드 및 납사 시황 일일 동향</h1>
      <div class="meta">발행일: 2026년 10월 24일 | ChemMarket Intelligence Center | 수석연구원</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #475569;">
      <strong>ChemMarket Insights</strong><br>Report ID: CM-20261024-D
    </div>
  </div>

  <h2>주요 가격 지표 요약</h2>
  <div class="grid">
    <div class="card">
      <div class="label">Naphtha (CFR Japan)</div>
      <div class="val">$684.50</div>
      <div class="chg down">▼ $6.50 (-0.94%)</div>
    </div>
    <div class="card">
      <div class="label">Ethylene (CFR NEA)</div>
      <div class="val">$890.00</div>
      <div class="chg up">▲ $10.00 (+1.14%)</div>
    </div>
    <div class="card">
      <div class="label">Propylene (CFR China)</div>
      <div class="val">$845.00</div>
      <div class="chg up">▲ $5.00 (+0.60%)</div>
    </div>
    <div class="card">
      <div class="label">Ethylene - Naphtha Spread</div>
      <div class="val">$205.50</div>
      <div class="chg up">▲ $16.50 (BEP $250 하회)</div>
    </div>
  </div>

  <h2>1. 원료 및 올레핀 시황 상세</h2>
  <table>
    <thead>
      <tr>
        <th>품목</th>
        <th>기준 지역</th>
        <th>가격 (USD/톤)</th>
        <th>전일 대비</th>
        <th>스프레드 (vs Naphtha)</th>
        <th>시장 기조</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Naphtha</strong></td>
        <td>CFR Japan</td>
        <td>$684.50</td>
        <td>-$6.50</td>
        <td>-</td>
        <td>유가 하락세 반영 약보합</td>
      </tr>
      <tr>
        <td><strong>Ethylene</strong></td>
        <td>CFR NEA</td>
        <td>$890.00</td>
        <td>+$10.00</td>
        <td>$205.50</td>
        <td>역내 정기보수 및 공급 타이트</td>
      </tr>
      <tr>
        <td><strong>Propylene</strong></td>
        <td>CFR China</td>
        <td>$845.00</td>
        <td>+$5.00</td>
        <td>$160.50</td>
        <td>다운스트림 PP 수요 지지</td>
      </tr>
      <tr>
        <td><strong>Butadiene</strong></td>
        <td>CFR NEA</td>
        <td>$1,320.00</td>
        <td>+$15.00</td>
        <td>$635.50</td>
        <td>합성고무 가동률 상승세</td>
      </tr>
      <tr>
        <td><strong>Benzene</strong></td>
        <td>FOB Korea</td>
        <td>$915.00</td>
        <td>-$3.00</td>
        <td>$230.50</td>
        <td>미국 아비트리지 둔화</td>
      </tr>
    </tbody>
  </table>

  <h2>2. 일일 시장 코멘트 및 분석</h2>
  <p><strong>[납사(Naphtha)]</strong> 국제 유가(브렌트유 배럴당 $74 초반)의 하방 압력 지속 및 정유사 정기보수 종료에 따른 공급 회복으로 CFR 일본 납사 가격은 전일 대비 $6.50 하락한 $684.50/톤을 기록했습니다.</p>
  <p><strong>[에틸렌(Ethylene)]</strong> 동북아 지역 NCC 설비들의 감산 기조(가동률 78~82% 유지)와 대만/한국 일부 크래커의 계획정비 일정으로 스팟 공급 물량이 제한적입니다. CFR 동북아 에틸렌은 $890/톤까지 소폭 상승하며 납사 대비 스프레드가 $205/톤 수준으로 회복세를 보이고 있으나, 크래커 손익분기점인 $250~300/톤에는 여전히 미치지 못하고 있습니다.</p>
  <p><strong>[전망 및 제언]</strong> 납사 가격의 단기 안정세가 유지되는 가운데 다운스트림 유도품(PE/PP/MEG) 수요 회복 속도가 크래커 마진 개선의 핵심 변수로 작용할 전망입니다.</p>

  <div class="footer">
    본 보고서는 ChemMarket Intelligence에서 신뢰할 수 있는 자료를 기초로 작성되었으며 투자 및 매매의 최종 책임은 이용자 본인에게 있습니다. © 2026 ChemMarket.
  </div>
</body>
</html>`
  },
  {
    id: 'sample-report-2026-10-18-weekly',
    date: '2026-10-18',
    category: '위클리',
    title: '글로벌 폴리머(PE/PP) 수급 전망 및 역내 NCC 정기보수 일정 주간 분석',
    filename: '2026-10-18_weekly_polymer_supply_demand.html',
    created: '2026-10-18T10:30:00.000Z',
    html: `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>ChemMarket Weekly - 글로벌 폴리머(PE/PP) 수급 전망 및 역내 NCC 정기보수</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Malgun Gothic", sans-serif; margin: 0; padding: 36px 28px; background: #ffffff; color: #1e293b; line-height: 1.6; }
    .header { border-bottom: 2px solid #0b6755; padding-bottom: 18px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-end; }
    .header h1 { margin: 0 0 6px; font-size: 24px; color: #064e3b; }
    .header .meta { font-size: 13px; color: #64748b; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 700; color: #0b6755; background: #e0f4f0; border-radius: 4px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 24px; font-size: 13px; }
    th { background: #064e3b; color: #ffffff; text-align: left; padding: 10px 12px; font-weight: 600; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    h2 { font-size: 17px; color: #064e3b; border-left: 4px solid #0b6755; padding-left: 10px; margin: 26px 0 12px; }
    .note-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13.5px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">석유화학 위클리 리포트</span>
      <h1>글로벌 폴리머(PE/PP) 수급 전망 및 역내 NCC 정기보수 일정 주간 분석</h1>
      <div class="meta">발행일: 2026년 10월 18일 (제42호) | ChemMarket Intelligence 폴리머 분석팀</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #475569;">
      <strong>Weekly Petrochemical Review</strong><br>Report ID: CM-20261018-W
    </div>
  </div>

  <div class="note-box">
    <strong>[주간 핵심 요약]</strong><br>
    - 폴리에틸렌(HDPE/LDPE): 동아시아 포장재 성수기 진입으로 저가 매수세 유입, 주간 +$15/톤 상승<br>
    - 폴리프로필렌(PP): 자동차 및 가전용 복합수지 수요는 견조하나 중국 신증설 가동으로 공급 압력 상존<br>
    - 4분기 아시아 NCC 정기보수: 연간 설비 용량의 약 14%가 집중되어 단기 공급 타이트닝 예상
  </div>

  <h2>1. 폴리머 주요 제품 주간 가격 동향</h2>
  <table>
    <thead>
      <tr>
        <th>제품</th>
        <th>규격/용도</th>
        <th>지역</th>
        <th>현물 가격 (USD/t)</th>
        <th>WoW 변동</th>
        <th>전월 대비</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>HDPE Film</strong></td>
        <td>필름용 범용재</td>
        <td>CFR Far East Asia</td>
        <td>$980.00</td>
        <td>+$15.00</td>
        <td>+$25.00</td>
      </tr>
      <tr>
        <td><strong>LLDPE</strong></td>
        <td>농업용/포장필름</td>
        <td>CFR Far East Asia</td>
        <td>$965.00</td>
        <td>+$10.00</td>
        <td>+$15.00</td>
      </tr>
      <tr>
        <td><strong>PP Homo</strong></td>
        <td>사출/방사용</td>
        <td>CFR Far East Asia</td>
        <td>$910.00</td>
        <td>+$5.00</td>
        <td>-$10.00</td>
      </tr>
      <tr>
        <td><strong>PP Block Copolymer</strong></td>
        <td>자동차 내외장재</td>
        <td>CFR Far East Asia</td>
        <td>$1,020.00</td>
        <td>+$10.00</td>
        <td>+$20.00</td>
      </tr>
    </tbody>
  </table>

  <h2>2. 2026년 4분기 주요 NCC 정기보수 일정</h2>
  <table>
    <thead>
      <tr>
        <th>업체명</th>
        <th>위치</th>
        <th>에틸렌 캐파 (만톤/년)</th>
        <th>보수 일정</th>
        <th>상태</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>A사</td>
        <td>한국 여수</td>
        <td>120</td>
        <td>10월 중순 ~ 11월 말</td>
        <td>보수 진행 중</td>
      </tr>
      <tr>
        <td>B사</td>
        <td>한국 대산</td>
        <td>100</td>
        <td>11월 초 ~ 12월 초</td>
        <td>가동 준비 중</td>
      </tr>
      <tr>
        <td>C사</td>
        <td>대만 마이랴오</td>
        <td>105</td>
        <td>10월 초 ~ 11월 중순</td>
        <td>보수 진행 중</td>
      </tr>
      <tr>
        <td>D사</td>
        <td>일본 치바</td>
        <td>65</td>
        <td>10월 하순 ~ 11월 하순</td>
        <td>셧다운 예정</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    본 보고서는 ChemMarket Intelligence에서 신뢰할 수 있는 자료를 기초로 작성되었습니다. © 2026 ChemMarket.
  </div>
</body>
</html>`
  },
  {
    id: 'sample-report-2026-10-05-special',
    date: '2026-10-05',
    category: '기획 시황',
    title: '글로벌 원유 변동성 확대에 따른 석유화학 밸류체인 원가 영향 분석',
    filename: '2026-10-05_special_crude_oil_impact.html',
    created: '2026-10-05T14:00:00.000Z',
    html: `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>ChemMarket Special Report - 원유 변동성과 석유화학 밸류체인 원가 영향</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Malgun Gothic", sans-serif; margin: 0; padding: 36px 28px; background: #ffffff; color: #1e293b; line-height: 1.6; }
    .header { border-bottom: 2px solid #78350f; padding-bottom: 18px; margin-bottom: 28px; }
    .header h1 { margin: 0 0 6px; font-size: 24px; color: #78350f; }
    .header .meta { font-size: 13px; color: #64748b; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 700; color: #78350f; background: #fef3c7; border-radius: 4px; margin-bottom: 8px; }
    .highlight-card { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 18px; margin: 20px 0; }
    h2 { font-size: 17px; color: #78350f; border-left: 4px solid #d97706; padding-left: 10px; margin: 28px 0 14px; }
    p { margin: 8px 0 14px; font-size: 14px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 24px; font-size: 13px; }
    th { background: #78350f; color: #ffffff; text-align: left; padding: 10px 12px; font-weight: 600; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">기획 시황 스페셜 리포트</span>
    <h1>글로벌 원유 변동성 확대에 따른 석유화학 밸류체인 원가 영향 분석</h1>
    <div class="meta">발행일: 2026년 10월 5일 | ChemMarket Intelligence 거시전략연구팀</div>
  </div>

  <div class="highlight-card">
    <strong>Executive Summary</strong><br>
    최근 중동 지정학적 리스크 및 OPEC+ 감산 정책의 불확실성으로 인해 국제 유가 변동성이 확대되고 있습니다.
    원유 가격 $10/bbl 변동 시 납사 원가는 약 $85/t, 에틸렌 제조원가는 약 $110/t 상승하는 것으로 추산되며,
    아시아 NCC(Naphtha Cracking Center)와 북미 ECC(Ethane Cracking Center) 간의 스프레드 격차가 다시 심화되는 국면입니다.
  </div>

  <h2>1. 유가 시나리오별 납사 및 에틸렌 원가 영향</h2>
  <table>
    <thead>
      <tr>
        <th>구분</th>
        <th>기준 시나리오 ($75/bbl)</th>
        <th>상승 시나리오 ($90/bbl)</th>
        <th>하락 시나리오 ($60/bbl)</th>
        <th>원가 민감도</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>CFR Japan Naphtha</strong></td>
        <td>$690/t</td>
        <td>$815/t</td>
        <td>$560/t</td>
        <td>+$8.3/bbl</td>
      </tr>
      <tr>
        <td><strong>에틸렌 현금원가 (NCC)</strong></td>
        <td>$780/t</td>
        <td>$920/t</td>
        <td>$640/t</td>
        <td>+$9.3/bbl</td>
      </tr>
      <tr>
        <td><strong>에틸렌 현금원가 (북미 ECC)</strong></td>
        <td>$380/t</td>
        <td>$410/t</td>
        <td>$350/t</td>
        <td>+$2.0/bbl</td>
      </tr>
      <tr>
        <td><strong>NCC vs ECC 원가 격차</strong></td>
        <td>$400/t</td>
        <td>$510/t</td>
        <td>$290/t</td>
        <td>ECC 경쟁력 확대</td>
      </tr>
    </tbody>
  </table>

  <h2>2. 석유화학 밸류체인별 전략적 대응 방안</h2>
  <p><strong>올레핀 체인:</strong> 저수익 범용 제품 생산을 최소화하고, 납사 원료 다변화(LPG 투입 비중 최대 20% 확대)를 통해 원가 절감을 추진할 필요가 있습니다.</p>
  <p><strong>스페셜티 및 유도품 체인:</strong> 범용 수지와의 가격 디커플링이 가능한 고부가가치 컴파운드 및 배터리/전자재료향 수지 비중을 점진적으로 확대해야 합니다.</p>

  <div class="footer">
    © 2026 ChemMarket Intelligence. 본 자료의 무단 복제 및 전재를 금합니다.
  </div>
</body>
</html>`
  },
  {
    id: 'sample-report-2026-09-28-weekly',
    date: '2026-09-28',
    category: '위클리',
    title: '아로마틱스(BTX) 스프레드 및 파라자일렌(PX) 설비 가동률 점검',
    filename: '2026-09-28_weekly_btx_aromatics.html',
    created: '2026-09-28T09:15:00.000Z',
    html: `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>ChemMarket Weekly - 아로마틱스(BTX) 스프레드 및 파라자일렌(PX) 점검</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Malgun Gothic", sans-serif; margin: 0; padding: 36px 28px; background: #ffffff; color: #1e293b; line-height: 1.6; }
    .header { border-bottom: 2px solid #0b6755; padding-bottom: 18px; margin-bottom: 28px; }
    .header h1 { margin: 0 0 6px; font-size: 24px; color: #064e3b; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 700; color: #0b6755; background: #e0f4f0; border-radius: 4px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 24px; font-size: 13px; }
    th { background: #064e3b; color: #ffffff; text-align: left; padding: 10px 12px; font-weight: 600; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">석유화학 위클리 리포트</span>
    <h1>아로마틱스(BTX) 스프레드 및 파라자일렌(PX) 설비 가동률 점검</h1>
    <div style="font-size: 13px; color: #64748b; margin-top: 6px;">발행일: 2026년 9월 28일 | ChemMarket Intelligence 아로마틱스 데스크</div>
  </div>

  <p><strong>[시장 총평]</strong> 벤젠(Benzene)은 중국 내 SM(스티렌 모노머) 가동률 호조와 미국향 수출 차익거래가 유지되며 강세를 보였습니다. 반면 PX(파라자일렌)는 중국 신규 PTA 증설분의 상업운전 지연으로 스프레드가 소폭 둔화되었습니다.</p>

  <table>
    <thead>
      <tr>
        <th>제품</th>
        <th>규격</th>
        <th>주간 가격 (USD/t)</th>
        <th>WoW 변동</th>
        <th>스프레드 (vs Naphtha)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Benzene</strong></td>
        <td>FOB Korea</td>
        <td>$920.00</td>
        <td>+$12.00</td>
        <td>$235.00</td>
      </tr>
      <tr>
        <td><strong>Toluene</strong></td>
        <td>FOB Korea</td>
        <td>$830.00</td>
        <td>+$5.00</td>
        <td>$145.00</td>
      </tr>
      <tr>
        <td><strong>Mixed-Xylene (Isomer)</strong></td>
        <td>FOB Korea</td>
        <td>$875.00</td>
        <td>+$8.00</td>
        <td>$190.00</td>
      </tr>
      <tr>
        <td><strong>Paraxylene (PX)</strong></td>
        <td>CFR Taiwan/China</td>
        <td>$1,010.00</td>
        <td>-$5.00</td>
        <td>$325.00</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">© 2026 ChemMarket Intelligence.</div>
</body>
</html>`
  }
];
