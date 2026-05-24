import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMessages, sendMessage } from '../../api/messageApi';
import ChatWindow from '../chat/ChatWindow';
import { useAuth } from '../../context/AuthContext';

export default function TripChat({ trip, onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const loadMessages = useCallback(async () => {
    setError(null);
    try {
      const data = await getMessages(trip.bookingId);
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.message || t('chat.loadError'));
    } finally {
      setLoading(false);
    }
  }, [trip.bookingId, t]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 8000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    setError(null);
    try {
      const newMessage = await sendMessage(trip.bookingId, content.trim());
      setMessages((prev) => [...prev, newMessage]);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || t('chat.sendError'));
    } finally {
      setSending(false);
    }
  };

  const driverName = trip.counterpartFirstName
    ? `${trip.counterpartFirstName} ${trip.counterpartLastName}`
    : t('chat.defaultCounterpart');

  return (
    <ChatWindow
      title={t('chat.titleWithName', { name: driverName })}
      subtitle={`${trip.origin} → ${trip.destination}`}
      messages={messages}
      currentUserId={user?.userId}
      loading={loading}
      sending={sending}
      error={error}
      content={content}
      onContentChange={setContent}
      onSend={handleSend}
      onClose={onClose}
    />
  );
}
