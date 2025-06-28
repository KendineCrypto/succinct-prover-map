import { Prover } from '../types';

// Earth sphere radius
const EARTH_RADIUS = 5;

/**
 * Converts latitude and longitude coordinates to 3D sphere coordinates
 */
export function latLngToVector3(lat: number, lng: number, radius: number = EARTH_RADIUS): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

/**
 * Converts prover data to marker positions
 */
export function convertProversToMarkers(provers: Prover[]): Array<{ prover: Prover; position: [number, number, number] }> {
  return provers.map(prover => ({
    prover,
    position: latLngToVector3(prover.latitude, prover.longitude)
  }));
} 