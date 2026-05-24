import axiosInstance from './axiosInstance';

export async function getPendingRequests() {
  const { data } = await axiosInstance.get('/driver/requests');
  return data;
}

export async function respondToBooking(bookingId, action) {
  const { data } = await axiosInstance.post(`/driver/bookings/${bookingId}/respond`, {
    action,
  });
  return data;
}

export async function getVehicleServices() {
  const { data } = await axiosInstance.get('/driver/vehicle-services');
  return data;
}

export async function updateVehicleServices(services) {
  const { data } = await axiosInstance.put('/driver/vehicle-services', { services });
  return data;
}

export async function getVehicle() {
  const { data } = await axiosInstance.get('/driver/vehicle');
  return data;
}

export async function updateVehicle({ plateNumber, vehicleModel, capacity, image }) {
  const formData = new FormData();
  formData.append('plateNumber', plateNumber);
  formData.append('vehicleModel', vehicleModel);
  formData.append('capacity', String(capacity));

  if (image) {
    formData.append('image', image);
  }

  const { data } = await axiosInstance.put('/driver/vehicle', formData);
  return data;
}
