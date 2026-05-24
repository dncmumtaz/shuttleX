export const SERVICE_CATALOG = {
  PAY_IN_VEHICLE: { key: 'payInVehicle', icon: '💳', category: 'FEATURE' },
  FIXED_PRICE: { key: 'fixedPrice', icon: '🏷️', category: 'FEATURE' },
  FLIGHT_TRACKING: { key: 'flightTracking', icon: '✈️', category: 'FEATURE' },
  MEET_AND_GREET: { key: 'meetAndGreet', icon: '🤝', category: 'FEATURE' },
  ENTERTAINMENT: { key: 'entertainment', icon: '📺', category: 'FEATURE' },
  FREE_WIFI: { key: 'freeWifi', icon: '📶', category: 'FEATURE' },
  FREE_WATER: { key: 'freeWater', icon: '💧', category: 'AMENITY' },
  TV_YOUTUBE: { key: 'tvYoutube', icon: '📺', category: 'AMENITY' },
  IN_VEHICLE_REFRESHMENTS: { key: 'inVehicleRefreshments', icon: '🍪', category: 'AMENITY' },
  CLIMATE_COMFORT: { key: 'climateComfort', icon: '❄️', category: 'AMENITY' },
  WATER: { key: 'water', icon: '💧', category: 'EXTRA' },
  BABY_SEAT: { key: 'babySeat', icon: '👶', category: 'EXTRA' },
  BEER: { key: 'beer', icon: '🍺', category: 'EXTRA' },
  SOFT_DRINK: { key: 'softDrink', icon: '🥤', category: 'EXTRA' },
  ENERGY_DRINK: { key: 'energyDrink', icon: '⚡', category: 'EXTRA' },
};

export const SERVICE_CATEGORIES = ['FEATURE', 'AMENITY', 'EXTRA'];

const BOOKING_EXTRA_ORDER = ['water', 'babySeat', 'beer', 'softDrink', 'energyDrink'];

const BOOKING_EXTRA_MAPPINGS = {
  WATER: { id: 'water', icon: '💧' },
  FREE_WATER: { id: 'water', icon: '💧', forcePrice: 0 },
  BABY_SEAT: { id: 'babySeat', icon: '👶' },
  BEER: { id: 'beer', icon: '🍺' },
  SOFT_DRINK: { id: 'softDrink', icon: '🥤' },
  ENERGY_DRINK: { id: 'energyDrink', icon: '⚡' },
};

export function serviceCodeToKey(code) {
  return SERVICE_CATALOG[code]?.key || code;
}

export function getCatalogMeta(code) {
  return SERVICE_CATALOG[code] || { key: code, icon: '✓', category: 'FEATURE' };
}

export function resolveBookingExtras(rawServices = []) {
  const mapped = mapDriverServices(rawServices);
  const byId = new Map();

  mapped.forEach((service) => {
    const mapping = BOOKING_EXTRA_MAPPINGS[service.code];
    if (!mapping) return;

    const price = mapping.forcePrice ?? service.price;
    const existing = byId.get(mapping.id);

    if (!existing || service.category === 'EXTRA') {
      byId.set(mapping.id, {
        code: service.code,
        id: mapping.id,
        icon: mapping.icon,
        category: 'EXTRA',
        price: Number(price) || 0,
      });
    }
  });

  return BOOKING_EXTRA_ORDER.map((id) => byId.get(id)).filter(Boolean);
}

export function filterServicesByCategory(services = [], category) {
  return (services || []).filter((service) => {
    const resolvedCategory = service.category || getCatalogMeta(service.code).category;
    return resolvedCategory === category;
  });
}

export function mapDriverServices(services = []) {
  return (services || []).map((service) => {
    const meta = getCatalogMeta(service.code);
    return {
      code: service.code,
      id: meta.key,
      icon: meta.icon,
      category: meta.category,
      price: Number(service.price) || 0,
    };
  });
}

export function buildCatalogItems(catalog = []) {
  return catalog.map((item) => {
    const meta = getCatalogMeta(item.code);
    return {
      code: item.code,
      id: meta.key,
      icon: meta.icon,
      category: item.category || meta.category,
      defaultPrice: Number(item.defaultPrice) || 0,
    };
  });
}

const CATEGORY_SORT_ORDER = { FEATURE: 0, AMENITY: 1, EXTRA: 2 };

export function resolveVehicleDisplayServices(rawServices = []) {
  const mapped = mapDriverServices(rawServices);
  const bookableExtras = resolveBookingExtras(rawServices);
  const extraIds = new Set(bookableExtras.map((service) => service.id));
  const items = [];
  const seenIds = new Set();

  mapped.forEach((service) => {
    if (service.category === 'EXTRA') return;
    if (service.code === 'FREE_WATER' && extraIds.has('water')) return;

    if (seenIds.has(service.id)) return;
    seenIds.add(service.id);

    items.push({
      code: service.code,
      id: service.id,
      icon: service.icon,
      category: service.category,
      price: 0,
    });
  });

  bookableExtras.forEach((service) => {
    if (seenIds.has(service.id)) return;
    seenIds.add(service.id);

    items.push({
      code: service.code,
      id: service.id,
      icon: service.icon,
      category: 'EXTRA',
      price: service.price,
    });
  });

  return items.sort(
    (a, b) => (CATEGORY_SORT_ORDER[a.category] ?? 9) - (CATEGORY_SORT_ORDER[b.category] ?? 9)
  );
}
