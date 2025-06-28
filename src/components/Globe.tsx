import { Sphere } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import type { JSX } from 'react';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Mesh, TextureLoader } from 'three';

interface GlobeProps {
  materialProps?: JSX.IntrinsicElements['meshStandardMaterial'];
}

export const Globe: React.FC<GlobeProps> = ({ materialProps }) => {
  const sphereRef = useRef<Mesh>(null);
  const earthTexture = useLoader(TextureLoader, '/pink_earth_texture.jpg');

  // Optimize texture for better performance
  useMemo(() => {
    earthTexture.minFilter = THREE.LinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
    earthTexture.anisotropy = 8; // Reduced from 16
    earthTexture.generateMipmaps = false; // Disable mipmaps for better performance
  }, [earthTexture]);

  return (
    <Sphere ref={sphereRef} args={[5, 64, 64]} visible>
      <meshStandardMaterial 
        map={earthTexture} 
        metalness={0.1} 
        roughness={0.5} 
        {...materialProps} 
      />
    </Sphere>
  );
}; 