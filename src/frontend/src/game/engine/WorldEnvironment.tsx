import { usePlane, useBox } from '@react-three/cannon';

export default function WorldEnvironment() {
  // Ground plane
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  // Boundary walls
  const [northWall] = useBox(() => ({ position: [0, 2, -20], args: [40, 4, 1] }));
  const [southWall] = useBox(() => ({ position: [0, 2, 20], args: [40, 4, 1] }));
  const [eastWall] = useBox(() => ({ position: [20, 2, 0], args: [1, 4, 40] }));
  const [westWall] = useBox(() => ({ position: [-20, 2, 0], args: [1, 4, 40] }));

  return (
    <>
      {/* Ground */}
      <mesh ref={groundRef as any} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Decorative elements */}
      <mesh position={[5, 0.5, 5]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      <mesh position={[-5, 0.5, -5]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      <mesh position={[8, 0.5, -8]} castShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* Invisible boundary walls */}
      <mesh ref={northWall as any}>
        <boxGeometry args={[40, 4, 1]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <mesh ref={southWall as any}>
        <boxGeometry args={[40, 4, 1]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <mesh ref={eastWall as any}>
        <boxGeometry args={[1, 4, 40]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <mesh ref={westWall as any}>
        <boxGeometry args={[1, 4, 40]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
