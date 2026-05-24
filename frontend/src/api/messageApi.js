import axiosInstance from './axiosInstance';

export async function getMessages(bookingId) {
  const { data } = await axiosInstance.get(`/messages/${bookingId}`);
  return data;
}

export async function sendMessage(bookingId, content) {
  const { data } = await axiosInstance.post('/messages', { bookingId, content });
  return data;
}
