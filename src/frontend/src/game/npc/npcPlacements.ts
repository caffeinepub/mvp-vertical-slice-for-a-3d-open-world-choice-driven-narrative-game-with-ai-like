export interface NPCPlacement {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  color: string;
  initialState: string;
}

export const npcPlacements: NPCPlacement[] = [
  {
    id: 'npc_victoria',
    name: 'Victoria',
    position: { x: 5, y: 1, z: 5 },
    color: '#8b0000',
    initialState: 'idle',
  },
  {
    id: 'npc_marcus',
    name: 'Marcus',
    position: { x: -5, y: 1, z: -5 },
    color: '#1e3a5f',
    initialState: 'idle',
  },
  {
    id: 'npc_elena',
    name: 'Elena',
    position: { x: 8, y: 1, z: -8 },
    color: '#4a0e4e',
    initialState: 'idle',
  },
];
