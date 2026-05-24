import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserLanguage, translateMessage } from '../../services/translationService';
import { formatDateTime } from '../../utils/tripUtils';

export default function ChatMessageBubble({ message, isMine }) {
  const { t, i18n } = useTranslation();
  const activeLanguage = i18n.language?.split('-')[0] || getUserLanguage();

  const [showOriginal, setShowOriginal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState({
    translatedText: null,
    skipped: true,
    sourceLang: null,
  });

  useEffect(() => {
    if (isMine) {
      setTranslation({ translatedText: null, skipped: true, sourceLang: null });
      setShowOriginal(false);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function runTranslation() {
      setLoading(true);
      setShowOriginal(false);

      try {
        const result = await translateMessage(message.content, activeLanguage);
        if (!cancelled) {
          setTranslation({
            translatedText: result.translatedText,
            skipped: result.skipped,
            sourceLang: result.sourceLang,
          });
        }
      } catch {
        if (!cancelled) {
          setTranslation({ translatedText: null, skipped: true, sourceLang: null });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    runTranslation();

    return () => {
      cancelled = true;
    };
  }, [message.content, message.id, isMine, activeLanguage]);

  const canToggle = !isMine && !translation.skipped && Boolean(translation.translatedText);
  const displayText =
    translation.skipped || showOriginal || !translation.translatedText
      ? message.content
      : translation.translatedText;

  return (
    <div className={`chat-bubble-wrapper ${isMine ? 'mine' : 'theirs'}`}>
      <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
        {loading ? (
          <div className="chat-bubble-skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <div className="chat-bubble-text">{displayText}</div>
        )}

        {canToggle && !loading && (
          <button
            type="button"
            className="chat-translate-toggle"
            onClick={() => setShowOriginal((prev) => !prev)}
          >
            {showOriginal ? t('chat.showTranslation') : t('chat.showOriginal')}
          </button>
        )}

        <div className="chat-bubble-time">{formatDateTime(message.createdAt, i18n.language)}</div>
      </div>
    </div>
  );
}
