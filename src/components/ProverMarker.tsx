import { Cylinder, Ring, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Prover } from '../types';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(a: string, b: string, t: number) {
  const colorA = new THREE.Color(a);
  const colorB = new THREE.Color(b);
  return colorA.lerp(colorB, t).getStyle();
}

interface ProverMarkerProps {
  prover: Prover;
  position: [number, number, number];
  onMarkerClick: (prover: Prover) => void;
  isSelected: boolean;
  isDimmed?: boolean;
}

export const ProverMarker: React.FC<ProverMarkerProps> = ({
  prover,
  position,
  onMarkerClick,
  isSelected,
  isDimmed = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(1);
  const [pulse, setPulse] = useState(1);
  const [emissive, setEmissive] = useState(0.3);
  const [color, setColor] = useState('#FF69B4');
  const [glowOpacity, setGlowOpacity] = useState(0.75);
  const [hoverIntensity, setHoverIntensity] = useState(0);

  // Calculate the normal vector (perpendicular to Earth's surface) at this position
  const normalVector = useMemo(() => {
    const normalizedPosition = new THREE.Vector3(...position).normalize();
    return normalizedPosition;
  }, [position]);

  // Calculate the beam direction (perpendicular to surface)
  const beamDirection = useMemo(() => {
    return normalVector.clone();
  }, [normalVector]);

  // Calculate the beam length based on position (longer for poles, shorter for equator)
  const beamLength = useMemo(() => {
    const latitude = Math.abs(position[1] / 5); // Normalize to 0-1 range
    // Longer beam for poles, shorter for equator
    return 1.4 + (latitude * 0.3);
  }, [position]);

  // Enhanced color calculations for dramatic hover effects
  const getHoverColor = (baseColor: string) => {
    if (isHovered) {
      // Make colors much more vibrant and bright
      return '#FF1493'; // Bright magenta
    }
    return baseColor;
  };

  const getHoverEmissive = () => {
    if (isHovered) {
      return '#FF69B4'; // Bright pink emissive
    }
    return '#FF1493';
  };

  // Memoize material properties to avoid recreating on every render
  const materialProps = useMemo(() => ({
    color: getHoverColor(color),
    emissive: getHoverEmissive(),
    emissiveIntensity: emissive + (hoverIntensity * 2), // Much brighter on hover
    metalness: 0.6 + (hoverIntensity * 0.3), // More metallic on hover
    roughness: 0.12 - (hoverIntensity * 0.08), // Shinier on hover
    transparent: true,
    opacity: isDimmed ? 0.3 : 1
  }), [color, emissive, hoverIntensity, isDimmed]);

  const beamMaterialProps = useMemo(() => ({
    color: isHovered ? '#FF1493' : "#FF69B4",
    emissive: isHovered ? '#FF1493' : "#FF69B4",
    emissiveIntensity: 2.2 + (hoverIntensity * 3), // Much brighter beam
    transparent: true,
    opacity: isDimmed ? 0.15 : 0.75 + (hoverIntensity * 0.4) // More opaque on hover
  }), [isDimmed, hoverIntensity, isHovered]);

  const glowMaterialProps = useMemo(() => ({
    color: isHovered ? '#FF1493' : "#FF69B4",
    transparent: true,
    opacity: glowOpacity + (hoverIntensity * 0.6) // Much more visible glow
  }), [glowOpacity, hoverIntensity, isHovered]);

  const ringMaterialProps = useMemo(() => ({
    color: isHovered ? '#FF1493' : "#FF69B4",
    transparent: true,
    opacity: isDimmed ? 0.1 : (0.75 + hoverIntensity * 0.5) * (1 - (pulse - 1) / 0.7)
  }), [pulse, isDimmed, hoverIntensity, isHovered]);

  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Simple scale effect
      let baseScale = isSelected ? 1.4 : isHovered ? 1.15 : 1;
      if (isDimmed) baseScale = 0.7;
      setScale(lerp(scale, baseScale, 0.15));
      
      // Enhanced pulse for hover
      const pulseIntensity = isSelected || isHovered ? 1.5 : 0.8;
      setPulse(1 + Math.abs(Math.sin(time * 1.2)) * pulseIntensity);
      
      // Dramatic emissive changes
      const targetEmissive = isSelected ? 2.5 : isHovered ? 3.0 : isDimmed ? 0.1 : 0.4;
      setEmissive(lerp(emissive, targetEmissive, 0.2));
      
      // Color transitions
      let targetColor = '#FF69B4';
      if (isSelected) targetColor = '#FF1493';
      else if (isHovered) targetColor = '#FF1493'; // Bright magenta
      setColor(lerpColor(color, targetColor, 0.2));
      
      // Enhanced glow opacity
      const baseGlowOpacity = isSelected || isHovered ? 1.2 : isDimmed ? 0.2 : 0.75;
      setGlowOpacity(baseGlowOpacity);
      
      // Hover intensity
      const targetHoverIntensity = isHovered ? 1 : 0;
      setHoverIntensity(lerp(hoverIntensity, targetHoverIntensity, 0.25));
    }
  });

  const handleClick = () => {
    if (!isDimmed) onMarkerClick(prover);
  };

  // Calculate beam position and rotation
  const beamEndPosition = beamDirection.clone().multiplyScalar(beamLength);
  const beamCenterPosition = beamEndPosition.clone().multiplyScalar(0.5);
  
  // Calculate rotation to align beam with normal vector
  const beamRotation = new THREE.Euler();
  beamRotation.setFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      beamDirection
    )
  );

  return (
    <group ref={groupRef} position={position}>
      {/* Light beam with dramatic color changes */}
      <Cylinder
        args={[0.025, 0.06, beamLength, 16]}
        position={beamCenterPosition.toArray()}
        rotation={[beamRotation.x, beamRotation.y, beamRotation.z]}
      >
        <meshStandardMaterial {...beamMaterialProps} />
      </Cylinder>
      
      {/* Glow effect with dramatic color changes */}
      <Sphere args={[0.091, 24, 24]}>
        <meshBasicMaterial {...glowMaterialProps} />
      </Sphere>
      
      {/* Pulse ring with dramatic color changes */}
      <Ring
        args={[0.11 * pulse, 0.18 * pulse, 32]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <meshBasicMaterial {...ringMaterialProps} />
      </Ring>
      
      {/* Main marker sphere with dramatic color changes */}
      <Sphere
        ref={meshRef}
        args={[0.06, 24, 24]}
        scale={scale}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <meshStandardMaterial {...materialProps} />
      </Sphere>
    </group>
  );
}; 