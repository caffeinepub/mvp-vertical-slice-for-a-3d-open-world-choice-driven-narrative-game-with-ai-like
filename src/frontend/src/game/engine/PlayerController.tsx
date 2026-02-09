import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { usePlayerControls } from './playerControls';
import { useWorldRuntime } from '../state/useWorldRuntime';

export default function PlayerController() {
  const { camera } = useThree();
  const { updatePlayerPosition } = useWorldRuntime();
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 2, 0],
    args: [0.5],
  }));

  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 2, 0]);

  useEffect(() => {
    const unsubscribeVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubscribePos = api.position.subscribe((p) => {
      position.current = p;
      updatePlayerPosition(p[0], p[1], p[2]);
    });
    return () => {
      unsubscribeVel();
      unsubscribePos();
    };
  }, [api, updatePlayerPosition]);

  const { forward, backward, left, right, jump } = usePlayerControls();

  useFrame(() => {
    const [x, y, z] = position.current;
    camera.position.set(x, y + 2, z + 5);
    camera.lookAt(x, y, z);

    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    const sideVector = new THREE.Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(5);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], 8, velocity.current[2]);
    }
  });

  return <mesh ref={ref as any} />;
}
