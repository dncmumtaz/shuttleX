import axiosInstance from './axiosInstance';
import { toApiDateTime } from '../utils/tripUtils';

export async function createTravelRequest(payload) {
  const { data } = await axiosInstance.post('/travel-requests', {
    ...payload,
    departureDateTime: toApiDateTime(payload.departureDateTime),
  });
  return data;
}

export async function searchAvailableDrivers(params) {
  const { data } = await axiosInstance.get('/travel-requests/search', {
    params: {
      ...params,
      departureDateTime: toApiDateTime(params.departureDateTime),
      passengerCount: Number(params.passengerCount),
    },
  });
  return data;
}

export async function selectDriver(travelRequestId, driverProfileId) {
  const { data } = await axiosInstance.post(
    `/travel-requests/${travelRequestId}/select-driver`,
    { driverProfileId }
  );
  return data;
}
