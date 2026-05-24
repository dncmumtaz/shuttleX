import { env, pipeline } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

const NLLB_LANG = {
  en: 'eng_Latn',
  de: 'deu_Latn',
  nl: 'nld_Latn',
  ru: 'rus_Cyrl',
  pl: 'pol_Latn',
  tr: 'tur_Latn',
};

let translatorPromise = null;

function getTranslator() {
  if (!translatorPromise) {
    translatorPromise = pipeline('translation', 'Xenova/nllb-200-distilled-600M');
  }
  return translatorPromise;
}

self.onmessage = async (event) => {
  const { requestId, text, sourceLang, targetLang } = event.data;

  try {
    const translator = await getTranslator();
    const output = await translator(text, {
      src_lang: NLLB_LANG[sourceLang] || 'eng_Latn',
      tgt_lang: NLLB_LANG[targetLang] || 'eng_Latn',
    });

    self.postMessage({
      requestId,
      ok: true,
      translatedText: output[0]?.translation_text || text,
    });
  } catch (error) {
    self.postMessage({
      requestId,
      ok: false,
      error: error?.message || 'Translation failed',
      translatedText: text,
    });
  }
};
