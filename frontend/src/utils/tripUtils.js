export const LOCATIONS = [
  'İstanbul Havalimanı (IST)',
  'Sabiha Gökçen Havalimanı (SAW)',
  'Taksim',
  'Kadıköy',
  'Beşiktaş',
  'Ankara Esenboğa Havalimanı (ESB)',
  'Ankara Kızılay',
  'İzmir Adnan Menderes Havalimanı (ADB)',
  'Antalya Havalimanı (AYT)',
  'Bursa Otogar',
];

export const STATUS_CONFIG = {
  PENDING: { labelKey: 'trips.status.pending', className: 'text-bg-secondary' },
  PRE_MATCHED: { labelKey: 'trips.status.preMatched', className: 'text-bg-primary' },
  ACCEPTED: { labelKey: 'trips.status.accepted', className: 'text-bg-success' },
  REJECTED: { labelKey: 'trips.status.rejected', className: 'text-bg-danger' },
  COMPLETED: { labelKey: 'trips.status.completed', className: 'text-bg-info' },
  CANCELLED: { labelKey: 'trips.status.cancelled', className: 'text-bg-dark' },
};

const LOCALE_MAP = {
  en: 'en-GB',
  de: 'de-DE',
  nl: 'nl-NL',
  ru: 'ru-RU',
  pl: 'pl-PL',
  tr: 'tr-TR',
};

export function getDateTimeLocale(language) {
  const code = language?.split('-')[0] || 'en';
  return LOCALE_MAP[code] || 'en-GB';
}

export function formatDateTime(value, language) {
  if (!value) return '-';
  return new Date(value).toLocaleString(getDateTimeLocale(language), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMinDateTimeLocal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export function toApiDateTime(datetimeLocal) {
  if (!datetimeLocal) return '';
  return datetimeLocal.length === 16 ? `${datetimeLocal}:00` : datetimeLocal;
}

export function canChat(trip) {
  return trip.travelRequestStatus === 'ACCEPTED' && trip.bookingId && trip.bookingStatus === 'CONFIRMED';
}

export function validateSearchForm(form) {
  const errors = {};

  if (!form.origin?.trim()) {
    errors.origin = 'Kalkış noktası zorunludur';
  }
  if (!form.destination?.trim()) {
    errors.destination = 'Varış noktası zorunludur';
  }
  if (form.origin?.trim() && form.destination?.trim() && form.origin === form.destination) {
    errors.destination = 'Varış noktası kalkış noktasından farklı olmalıdır';
  }
  if (!form.departureDateTime) {
    errors.departureDateTime = 'Tarih ve saat zorunludur';
  } else {
    const selected = new Date(form.departureDateTime);
    if (selected <= new Date()) {
      errors.departureDateTime = 'Kalkış tarihi gelecekte olmalıdır';
    }
  }
  if (!form.passengerCount || Number(form.passengerCount) < 1) {
    errors.passengerCount = 'Yolcu sayısı en az 1 olmalıdır';
  }

  return errors;
}
