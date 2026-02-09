import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import PlayerController from './PlayerController';
import WorldEnvironment from './WorldEnvironment';
import NPCEntities from './NPCEntities';

export default function WorldCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 60 }}
      shadows
      className="w-full h-full"
    >
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <Physics gravity={[0, -20, 0]}>
        <PlayerController />
        <WorldEnvironment />
        <NPCEntities />
      </Physics>
    </Canvas>
  );
}
