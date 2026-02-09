import { useState, useEffect, useCallback } from 'react';
import { npcPlacements } from '../npc/npcPlacements';
import { useGameClock } from './useGameClock';

interface NearbyNPC {
  id: string;
  name: string;
}

export function useWorldRuntime() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 2, z: 0 });
  const [nearbyNPC, setNearbyNPC] = useState<NearbyNPC | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<string | null>(null);
  const { timeOfDay } = useGameClock();

  const updatePlayerPosition = useCallback((x: number, y: number, z: number) => {
    setPlayerPosition({ x, y, z });
  }, []);

  // Check for nearby NPCs
  useEffect(() => {
    const interactionDistance = 3;
    let closestNPC: NearbyNPC | null = null;
    let closestDistance = Infinity;

    for (const npc of npcPlacements) {
      const dx = playerPosition.x - npc.position.x;
      const dz = playerPosition.z - npc.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < interactionDistance && distance < closestDistance) {
        closestDistance = distance;
        closestNPC = { id: npc.id, name: npc.name };
      }
    }

    setNearbyNPC(closestNPC);
  }, [playerPosition]);

  const startDialogue = useCallback((npcId: string) => {
    setActiveDialogue(npcId);
  }, []);

  const closeDialogue = useCallback(() => {
    setActiveDialogue(null);
  }, []);

  return {
    playerPosition,
    updatePlayerPosition,
    nearbyNPC,
    activeDialogue,
    startDialogue,
    closeDialogue,
    timeOfDay,
  };
}
