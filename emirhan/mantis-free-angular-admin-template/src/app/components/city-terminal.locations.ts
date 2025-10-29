export interface Location {
  name: string;
  lat: number;
  lon: number;
}
export const criticalLocations = [
  { name: "Istanbul_Enerji", lat: 40.9902121, lon: 29.1018259 },
  { name: "Bandirma_Enerji", lat: 40.2778712, lon: 27.7180509 },
  { name: "Balikesir", lat: 39.7357062, lon: 23.4214783 },
  { name: "İzmir", lat: 38.4192, lon: 27.1287 },
  { name: "Mugla", lat: 37.2101376, lon: 28.3436973 }

];
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Dünya yarıçapı km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

