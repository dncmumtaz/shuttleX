import { franc } from 'franc';
import { getActiveLanguage } from '../i18n';

const FRANC_TO_APP = {
  tur: 'tr',
  eng: 'en',
  deu: 'de',
  nld: 'nl',
  rus: 'ru',
  pol: 'pl',
};

const SUPPORTED_LANGS = new Set(['en', 'de', 'nl', 'ru', 'pl', 'tr']);

const translationCache = new Map();
let worker = null;
let workerRequestId = 0;
const pendingWorkerRequests = new Map();

function getCacheKey(text, sourceLang, targetLang) {
  return `${sourceLang}:${targetLang}:${text}`;
}

function initWorker() {
  if (worker || typeof Worker === 'undefined') {
    return worker;
  }

  worker = new Worker(new URL('../workers/translation.worker.js', import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (event) => {
    const { requestId, ok, translatedText, error } = event.data;
    const pending = pendingWorkerRequests.get(requestId);
    if (!pending) return;

    pendingWorkerRequests.delete(requestId);
    if (ok) {
      pending.resolve(translatedText);
    } else {
      pending.reject(new Error(error || 'Translation worker failed'));
    }
  };

  worker.onerror = (event) => {
    pendingWorkerRequests.forEach(({ reject }) => {
      reject(new Error(event.message || 'Translation worker crashed'));
    });
    pendingWorkerRequests.clear();
    worker = null;
  };

  return worker;
}

function translateWithWorker(text, sourceLang, targetLang) {
  const activeWorker = initWorker();
  if (!activeWorker) {
    return Promise.reject(new Error('Web Worker is not available'));
  }

  return new Promise((resolve, reject) => {
    const requestId = ++workerRequestId;
    pendingWorkerRequests.set(requestId, { resolve, reject });
    activeWorker.postMessage({ requestId, text, sourceLang, targetLang });
  });
}

async function translateWithBrowserApi(text, sourceLang, targetLang) {
  if (typeof Translator === 'undefined') {
    return null;
  }

  try {
    const availability = await Translator.availability({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    });

    if (availability === 'unavailable') {
      return null;
    }

    const translator = await Translator.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    });

    return translator.translate(text);
  } catch {
    return null;
  }
}

export function getUserLanguage() {
  return getActiveLanguage();
}

export function detectMessageLanguage(text) {
  if (!text?.trim()) return null;

  const detected = franc(text.trim(), { minLength: 3 });
  if (detected === 'und') return null;

  const mapped = FRANC_TO_APP[detected];
  return SUPPORTED_LANGS.has(mapped) ? mapped : null;
}

export function shouldTranslateMessage(text, targetLang = getUserLanguage()) {
  const sourceLang = detectMessageLanguage(text);
  if (!sourceLang) return false;
  return sourceLang !== targetLang;
}

export async function translateMessage(text, targetLang = getUserLanguage()) {
  const trimmed = text?.trim();
  if (!trimmed) {
    return {
      translatedText: null,
      sourceLang: null,
      targetLang,
      skipped: true,
    };
  }

  const sourceLang = detectMessageLanguage(trimmed);
  if (!sourceLang || sourceLang === targetLang) {
    return {
      translatedText: null,
      sourceLang,
      targetLang,
      skipped: true,
    };
  }

  const cacheKey = getCacheKey(trimmed, sourceLang, targetLang);
  if (translationCache.has(cacheKey)) {
    return {
      translatedText: translationCache.get(cacheKey),
      sourceLang,
      targetLang,
      skipped: false,
      cached: true,
    };
  }

  let translatedText = await translateWithBrowserApi(trimmed, sourceLang, targetLang);

  if (!translatedText) {
    translatedText = await translateWithWorker(trimmed, sourceLang, targetLang);
  }

  translationCache.set(cacheKey, translatedText);

  return {
    translatedText,
    sourceLang,
    targetLang,
    skipped: false,
    cached: false,
  };
}

export function preloadTranslationModel() {
  initWorker();
}

export function clearTranslationCache() {
  translationCache.clear();
}
