import { ReportItem, SAMPLE_REPORTS } from './sampleReports';

export interface AdminAuthSetting {
  key: 'adminAuth';
  salt: string;
  hash: string;
}

let dbInstance: IDBDatabase | null = null;
let memoryFallbackReports: ReportItem[] = [];
let memoryFallbackAuth: AdminAuthSetting | null = null;
let useFallback = false;

function bytesToHex(a: Uint8Array): string {
  return Array.from(a).map(x => x.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(s: string): Uint8Array {
  const matches = s.match(/.{2}/g);
  if (!matches) return new Uint8Array();
  return new Uint8Array(matches.map(x => parseInt(x, 16)));
}

export async function derivePasswordHash(pass: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pass),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 160000, hash: 'SHA-256' },
    key,
    256
  );
  return bytesToHex(new Uint8Array(derived));
}

export async function initDB(): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    useFallback = true;
    loadFromLocalStorage();
    return;
  }

  return new Promise((resolve) => {
    try {
      const req = indexedDB.open('chemMarketHTMLArchive_v1', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('reports')) {
          db.createObjectStore('reports', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      req.onsuccess = async () => {
        dbInstance = req.result;
        // Check if DB is empty; if so, populate initial sample reports so the archive is immediately ready to explore!
        try {
          const reports = await getAllReports();
          if (reports.length === 0) {
            for (const r of SAMPLE_REPORTS) {
              await putReport(r);
            }
          }
        } catch {
          // ignore
        }
        resolve();
      };

      req.onerror = () => {
        console.warn('IndexedDB unavailable, falling back to localStorage/memory');
        useFallback = true;
        loadFromLocalStorage();
        resolve();
      };
    } catch {
      useFallback = true;
      loadFromLocalStorage();
      resolve();
    }
  });
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('chemMarketHTMLArchive_reports');
    if (raw) {
      memoryFallbackReports = JSON.parse(raw);
    } else {
      memoryFallbackReports = [...SAMPLE_REPORTS];
      saveToLocalStorage();
    }
    const authRaw = localStorage.getItem('chemMarketHTMLArchive_auth');
    if (authRaw) {
      memoryFallbackAuth = JSON.parse(authRaw);
    }
  } catch {
    if (memoryFallbackReports.length === 0) {
      memoryFallbackReports = [...SAMPLE_REPORTS];
    }
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem('chemMarketHTMLArchive_reports', JSON.stringify(memoryFallbackReports));
    if (memoryFallbackAuth) {
      localStorage.setItem('chemMarketHTMLArchive_auth', JSON.stringify(memoryFallbackAuth));
    } else {
      localStorage.removeItem('chemMarketHTMLArchive_auth');
    }
  } catch {
    // quota exceeded or private mode
  }
}

export async function getAllReports(): Promise<ReportItem[]> {
  if (useFallback || !dbInstance) {
    return [...memoryFallbackReports];
  }
  return new Promise((resolve, reject) => {
    try {
      const tx = dbInstance!.transaction('reports', 'readonly');
      const req = tx.objectStore('reports').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

export async function putReport(report: ReportItem): Promise<void> {
  if (useFallback || !dbInstance) {
    const idx = memoryFallbackReports.findIndex(r => r.id === report.id);
    if (idx >= 0) {
      memoryFallbackReports[idx] = report;
    } else {
      memoryFallbackReports.push(report);
    }
    saveToLocalStorage();
    return;
  }
  return new Promise((resolve, reject) => {
    try {
      const tx = dbInstance!.transaction('reports', 'readwrite');
      const req = tx.objectStore('reports').put(report);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

export async function deleteReport(id: string): Promise<void> {
  if (useFallback || !dbInstance) {
    memoryFallbackReports = memoryFallbackReports.filter(r => r.id !== id);
    saveToLocalStorage();
    return;
  }
  return new Promise((resolve, reject) => {
    try {
      const tx = dbInstance!.transaction('reports', 'readwrite');
      const req = tx.objectStore('reports').delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

export async function hasPassword(): Promise<boolean> {
  if (useFallback || !dbInstance) {
    return !!memoryFallbackAuth;
  }
  return new Promise((resolve) => {
    try {
      const tx = dbInstance!.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get('adminAuth');
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function savePassword(pass: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePasswordHash(pass, salt);
  const data: AdminAuthSetting = {
    key: 'adminAuth',
    salt: bytesToHex(salt),
    hash
  };

  if (useFallback || !dbInstance) {
    memoryFallbackAuth = data;
    saveToLocalStorage();
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      const tx = dbInstance!.transaction('settings', 'readwrite');
      const req = tx.objectStore('settings').put(data);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

export async function verifyPassword(pass: string): Promise<boolean> {
  if (useFallback || !dbInstance) {
    if (!memoryFallbackAuth) return false;
    const computed = await derivePasswordHash(pass, hexToBytes(memoryFallbackAuth.salt));
    return computed === memoryFallbackAuth.hash;
  }

  return new Promise((resolve, reject) => {
    try {
      const tx = dbInstance!.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get('adminAuth');
      req.onsuccess = async () => {
        const item = req.result as AdminAuthSetting | undefined;
        if (!item) return resolve(false);
        try {
          const computed = await derivePasswordHash(pass, hexToBytes(item.salt));
          resolve(computed === item.hash);
        } catch (err) {
          reject(err);
        }
      };
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}
