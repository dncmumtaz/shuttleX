import axiosInstance from './axiosInstance';

export async function getMyTrips() {
  const { data } = await axiosInstance.get('/trips');
  return data;
}
