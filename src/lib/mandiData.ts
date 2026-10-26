export interface MandiMarket {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export interface MandiPriceEntry {
  marketId: string;
  marketName: string;
  commodity: string;
  variety: string;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  unit: string;
  arrival: string | null;
  reportDate: string;
  available: boolean;
}

export const MANDI_MARKETS: MandiMarket[] = [
  { id: 'shegaon', name: 'Shegaon APMC', district: 'Buldhana', state: 'Maharashtra', lat: 20.6833, lng: 76.6833 },
  { id: 'khamgaon', name: 'Khamgaon APMC', district: 'Buldhana', state: 'Maharashtra', lat: 20.7069, lng: 76.5636 },
  { id: 'akola', name: 'Akola APMC', district: 'Akola', state: 'Maharashtra', lat: 20.7000, lng: 77.0000 },
  { id: 'amravati', name: 'Amravati APMC', district: 'Amravati', state: 'Maharashtra', lat: 21.1463, lng: 77.0610 },
];

export const MANDI_CROPS = [
  'Soybean', 'Cotton', 'Tur', 'Chana', 'Wheat', 'Maize', 'Jowar', 'Vegetables',
];

export const DEFAULT_LOCATION = MANDI_MARKETS[0];

// Approximate distances between markets (km) — used only when user location is unavailable
export const MARKET_DISTANCES: Record<string, Record<string, number>> = {
  shegaon: { khamgaon: 15, akola: 60, amravati: 120 },
  khamgaon: { shegaon: 15, akola: 55, amravati: 115 },
  akola: { shegaon: 60, khamgaon: 55, amravati: 90 },
  amravati: { shegaon: 120, khamgaon: 115, akola: 90 },
};

// Haversine distance calculation
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function findNearestMarket(lat: number, lng: number): MandiMarket {
  let nearest = MANDI_MARKETS[0];
  let minDist = Infinity;
  for (const m of MANDI_MARKETS) {
    const d = haversineDistance(lat, lng, m.lat, m.lng);
    if (d < minDist) {
      minDist = d;
      nearest = m;
    }
  }
  return nearest;
}
