import { resolveBookingExtras } from './vehicleServiceCatalog';

export const BASE_FARE = 30;
export const RETURN_TRANSFER_SURCHARGE = 15;

export function calculateTotal({ extraServices = [], returnTransfer = false, driverServices = [] }) {
  const bookableExtras = resolveBookingExtras(driverServices);
  const extrasTotal = extraServices.reduce((sum, id) => {
    const service = bookableExtras.find((s) => s.id === id);
    return sum + (service?.price || 0);
  }, 0);

  const returnFee = returnTransfer ? RETURN_TRANSFER_SURCHARGE : 0;
  return BASE_FARE + extrasTotal + returnFee;
}

export function buildReservationNotes({
  passengers,
  flight,
  returnTransfer,
  extraServices,
  specialNote,
  searchNotes,
  contact,
}) {
  const lines = [];

  if (contact?.fullName) {
    lines.push(`İletişim: ${contact.fullName} | ${contact.phone} | ${contact.email}`);
  }

  if (passengers?.length) {
    lines.push(`Yolcular: ${passengers.map((p) => p.name).filter(Boolean).join(', ')}`);
  }

  if (flight?.code || flight?.landingTime) {
    lines.push(`Uçuş: ${flight.code || '-'} | İniş: ${flight.landingTime || '-'}`);
  }

  if (returnTransfer) {
    lines.push('Dönüş transferi: Evet');
  }

  if (extraServices?.length) {
    lines.push(`Ekstra hizmetler: ${extraServices.join(', ')}`);
  }

  if (specialNote?.trim()) {
    lines.push(`Not: ${specialNote.trim()}`);
  }

  if (searchNotes?.trim()) {
    lines.unshift(`Arama notu: ${searchNotes.trim()}`);
  }

  return lines.join('\n').slice(0, 500);
}

export function formatBookingDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function validateContactForm(contact) {
  const errors = {};
  if (!contact.fullName?.trim()) errors.fullName = 'required';
  if (!contact.phone?.trim()) errors.phone = 'required';
  if (!contact.email?.trim()) errors.email = 'required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errors.email = 'invalid';
  return errors;
}

export const initialBookingState = {
  step: 1,
  search: {
    origin: '',
    destination: '',
    departureDateTime: '',
    passengerCount: 1,
    notes: '',
  },
  drivers: [],
  selectedDriver: null,
  travelRequestId: null,
  contact: { fullName: '', phone: '', email: '' },
  passengers: [{ name: '' }],
  flight: { code: '', landingTime: '' },
  returnTransfer: false,
  extraServices: [],
  specialNote: '',
  confirmation: null,
  loading: false,
  error: null,
  searched: false,
};
