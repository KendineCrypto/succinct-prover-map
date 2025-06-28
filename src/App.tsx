import { Line, OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import './App.css';
import { Globe } from './components/Globe';
import Loading from './components/Loading';
import { ProverDetails } from './components/ProverDetails';
import { ProverMarker } from './components/ProverMarker';
import proverData from './data/provers.json';
import { Prover } from './types';
import { convertProversToMarkers } from './utils/coordinates';

function FlyToAnimation({ controlsRef, camera, targetPosition, trigger, onDone }: {
  controlsRef: React.RefObject<any>,
  camera: THREE.Camera,
  targetPosition: [number, number, number] | null,
  trigger: number,
  onDone: () => void
}) {
  const animating = useRef(false);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!targetPosition || !controlsRef.current) return;
    animating.current = true;
    const start = {
      position: camera.position.clone(),
      target: controlsRef.current.target.clone(),
    };
    const endTarget = new THREE.Vector3(...targetPosition);
    const endPosition = endTarget.clone().normalize().multiplyScalar(8);
    let t = 0;
    
    // Improved easing function for smoother animation
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    function animate() {
      if (!animating.current) return;
      t += 0.02; // Slower animation for smoother feel
      if (t > 1) t = 1;
      
      const easedT = easeInOutCubic(t);
      camera.position.lerpVectors(start.position, endPosition, easedT);
      controlsRef.current.target.lerpVectors(start.target, endTarget, easedT);
      controlsRef.current.update();
      
      if (t < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        animating.current = false;
        onDone();
      }
    }
    animate();
    return () => {
      animating.current = false;
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [targetPosition, controlsRef, camera, trigger, onDone]);
  return null;
}

function getGreatCirclePoints(a: [number, number, number], b: [number, number, number], segments = 50) {
  const points = [];
  const va = new THREE.Vector3(...a).normalize().multiplyScalar(5);
  const vb = new THREE.Vector3(...b).normalize().multiplyScalar(5);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().copy(va).lerp(vb, t).normalize().multiplyScalar(5);
    points.push(p.clone());
  }
  return points;
}

function DataTransferLines({ markers }: { markers: Array<{ prover: Prover; position: [number, number, number] }> }) {
  const LIGHT_SPEED = 0.15;
  const SEGMENTS = 50;
  const SEGMENT_LENGTH = 0.15;
  const MAX_LINES = 50;

  const [tick, setTick] = React.useState(0);
  
  useFrame((state) => {
    setTick(state.clock.elapsedTime);
  });

  const lineData = useMemo(() => {
    const lines: Array<{
      points: THREE.Vector3[];
      key: string;
      startIdx: number;
      endIdx: number;
    }> = [];
    
    let lineCount = 0;
    
    for (let i = 0; i < markers.length && lineCount < MAX_LINES; i++) {
      const distances: Array<{ index: number; distance: number }> = [];
      
      for (let j = 0; j < markers.length; j++) {
        if (i === j) continue;
        
        const pos1 = new THREE.Vector3(...markers[i].position);
        const pos2 = new THREE.Vector3(...markers[j].position);
        const distance = pos1.distanceTo(pos2);
        distances.push({ index: j, distance });
      }
      
      distances.sort((a, b) => a.distance - b.distance);
      const nearestNeighbors = distances.slice(0, 2);
      
      for (const neighbor of nearestNeighbors) {
        if (lineCount >= MAX_LINES) break;
        
        const points = getGreatCirclePoints(markers[i].position, markers[neighbor.index].position, SEGMENTS);
        const t = ((tick) * LIGHT_SPEED) % 1;
        const startT = t;
        const endT = Math.min(t + SEGMENT_LENGTH, 1);
        const startIdx = Math.floor(startT * SEGMENTS);
        const endIdx = Math.floor(endT * SEGMENTS);
        
        lines.push({
          points,
          key: `arc-${i}-${neighbor.index}`,
          startIdx,
          endIdx
        });
        lineCount++;
      }
    }
    
    return lines;
  }, [markers, tick]);

  return (
    <>
      {lineData.map(({ points, key, startIdx, endIdx }) => {
        const segmentPoints = points.slice(startIdx, endIdx + 1);
        
        return (
          <group key={key}>
            <Line
              points={points}
              color="#e0e0e0"
              transparent
              opacity={0.25}
              lineWidth={1}
            />
            {segmentPoints.length > 1 && (
              <Line
                points={segmentPoints}
                color="#fff"
                transparent
                opacity={0.8}
                lineWidth={2}
              />
            )}
          </group>
        );
      })}
    </>
  );
}

function App() {
  const [provers, setProvers] = useState<Prover[]>([]);
  const [selectedProver, setSelectedProver] = useState<Prover | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showProverList, setShowProverList] = useState(false);
  const controlsRef = useRef<any>(null);
  const [flyToTarget, setFlyToTarget] = useState<[number, number, number] | null>(null);
  const [flyToTrigger, setFlyToTrigger] = useState(0);

  useEffect(() => {
    const typedProvers: Prover[] = proverData.provers.map(prover => ({
      ...prover,
      status: prover.status as 'active' | 'inactive' | 'maintenance'
    }));
    setProvers(typedProvers);
  }, []);

  // Memoize markers to avoid recalculation on every render
  const markers = useMemo(() => convertProversToMarkers(provers), [provers]);
  const selectedMarker = useMemo(() => 
    markers.find(m => m.prover.id === selectedProver?.id), 
    [markers, selectedProver]
  );

  const handleMarkerClick = useCallback((prover: Prover) => {
    setSelectedProver(prover);
    setShowDetails(true);
    const marker = markers.find(m => m.prover.id === prover.id);
    if (marker) {
      setFlyToTarget(null);
      setTimeout(() => {
        setFlyToTarget(marker.position);
        setFlyToTrigger(t => t + 1);
      }, 0);
    }
  }, [markers]);

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false);
    setSelectedProver(null);
  }, []);

  const navigateToProver = useCallback((prover: Prover) => {
    const marker = markers.find(m => m.prover.id === prover.id);
    if (marker) {
      // Set the selected prover and show details
      setSelectedProver(prover);
      setShowDetails(true);
      
      // Navigate to the prover location
      setFlyToTarget(null);
      setTimeout(() => {
        setFlyToTarget(marker.position);
        setFlyToTrigger(t => t + 1);
      }, 0);
    }
  }, [markers]);

  const toggleProverList = useCallback(() => {
    setShowProverList(prev => !prev);
  }, []);

  if (provers.length === 0) {
    return <Loading />;
  }

  function Scene() {
    const { camera } = useThree();
    
    // Memoize the prover markers to avoid recreating on every render
    const proverMarkers = useMemo(() => 
      markers.map(({ prover, position }) => (
        <ProverMarker
          key={prover.id}
          prover={prover}
          position={position}
          onMarkerClick={handleMarkerClick}
          isSelected={selectedProver?.id === prover.id}
          isDimmed={!!selectedProver && selectedProver.id !== prover.id}
        />
      )), 
      [markers, selectedProver, handleMarkerClick]
    );

    return (
      <>
        <Globe materialProps={{ metalness: 0.2, roughness: 0.7 }} />
        <DataTransferLines markers={markers} />
        {proverMarkers}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={25}
          autoRotate={false}
          autoRotateSpeed={0.5}
          onStart={() => {
            setFlyToTarget(null);
          }}
        />
        <FlyToAnimation
          controlsRef={controlsRef}
          camera={camera}
          targetPosition={flyToTarget}
          trigger={flyToTrigger}
          onDone={() => setFlyToTarget(null)}
        />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 2]} intensity={1.2} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={2} color="#FF69B4" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FF1493" />
      </>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1>🌍 Succinct Labs Prover Map</h1>
        <p>Track provers worldwide in real-time</p>
      </div>

      {/* Interactive Footer - Moved to top-right */}
      <div className="footer">
        <div className="footer-content">
          <div className="prover-stats" onClick={toggleProverList}>
            <span className="stats-icon">🔄</span>
            <span className="stats-text">Real-time data • 🌍 {provers.length} active provers</span>
            <span className="stats-arrow">{showProverList ? '▲' : '▼'}</span>
          </div>
          
          {showProverList && (
            <div className="prover-list">
              <div className="prover-list-header">
                <h3>All Provers</h3>
                <span className="prover-count">{provers.length} total</span>
              </div>
              <div className="prover-grid">
                {provers.map((prover, index) => (
                  <div 
                    key={prover.id} 
                    className={`prover-item ${prover.status} ${selectedProver?.id === prover.id ? 'selected' : ''}`}
                    onClick={() => navigateToProver(prover)}
                    style={{ '--index': index } as React.CSSProperties}
                  >
                    <div className="prover-item-header">
                      <span className="prover-name">{prover.name}</span>
                      <span className={`prover-status ${prover.status}`}>
                        {prover.status}
                      </span>
                    </div>
                    <div className="prover-item-location">
                      {prover.city}, {prover.country}
                    </div>
                    <div className="prover-item-uptime">
                      {prover.uptime}% uptime
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimized Stars background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Canvas style={{ width: '100vw', height: '100vh', background: 'transparent' }} camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      <div className="canvas-container" style={{ position: 'relative', zIndex: 1 }}>
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          style={{ background: 'none' }}
          gl={{ 
            antialias: false,
            powerPreference: "high-performance"
          }}
        >
          <Scene />
        </Canvas>
      </div>

      <ProverDetails
        prover={selectedProver}
        isVisible={showDetails}
        onClose={handleCloseDetails}
      />
    </div>
  );
}

export default App;
