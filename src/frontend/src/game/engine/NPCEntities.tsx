import { useRef } from 'react';
import { npcPlacements } from '../npc/npcPlacements';
import { Text } from '@react-three/drei';

export default function NPCEntities() {
  return (
    <>
      {npcPlacements.map((npc) => (
        <NPCEntity key={npc.id} npc={npc} />
      ))}
    </>
  );
}

function NPCEntity({ npc }: { npc: any }) {
  const meshRef = useRef<any>(null);

  return (
    <group position={[npc.position.x, npc.position.y, npc.position.z]}>
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.5, 1, 8, 16]} />
        <meshStandardMaterial color={npc.color || '#8b4513'} />
      </mesh>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {npc.name}
      </Text>
    </group>
  );
}
