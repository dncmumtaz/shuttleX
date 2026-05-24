import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { preloadTranslationModel } from '../../services/translationService';
import ChatMessageBubble from './ChatMessageBubble';

export default function ChatWindow({
  title,
  subtitle,
  messages,
  currentUserId,
  loading,
  sending,
  error,
  content,
  onContentChange,
  onSend,
  onClose,
}) {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    preloadTranslationModel();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend?.(event);
  };

  return (
    <div className="trip-chat-backdrop" onClick={onClose} role="presentation">
      <div
        className="trip-chat-panel card border-0 shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trip-chat-title"
      >
        <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">
          <div>
            <h5 id="trip-chat-title" className="mb-0 h6">
              {title}
            </h5>
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
          <button type="button" className="btn-close" aria-label={t('chat.close')} onClick={onClose} />
        </div>

        <div className="trip-chat-messages">
          {loading ? (
            <div className="text-center text-muted py-4">
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              {t('chat.loadingMessages')}
            </div>
          ) : messages.length === 0 ? (
            <p className="text-muted text-center mb-0 py-4">{t('chat.emptyState')}</p>
          ) : (
            messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                isMine={message.senderId === currentUserId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="alert alert-danger py-2 mx-3 mb-0" role="alert">
            {error}
          </div>
        )}

        <form className="card-footer bg-white border-top p-3" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={t('chat.inputPlaceholder')}
              value={content}
              onChange={(event) => onContentChange?.(event.target.value)}
              maxLength={1000}
              disabled={sending}
            />
            <button type="submit" className="btn btn-primary" disabled={sending || !content?.trim()}>
              {sending ? '...' : t('chat.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
