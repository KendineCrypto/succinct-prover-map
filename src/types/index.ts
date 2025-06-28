export interface Prover {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  uptime: number;
  startDate: string;
  status: 'active' | 'inactive' | 'maintenance';
  ip: string;
}

export interface ProverMarker {
  prover: Prover;
  position: [number, number, number];
  isHovered: boolean;
  isSelected: boolean;
} 