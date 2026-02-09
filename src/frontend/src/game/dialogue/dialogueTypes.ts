export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices: DialogueChoice[];
  conditions?: {
    minExtroversion?: number;
    minAgreeableness?: number;
    minOpenness?: number;
    requiredFlags?: string[];
    minRelationship?: { npc: string; value: number };
  };
}

export interface DialogueChoice {
  text: string;
  nextNodeId: string;
  conditions?: {
    minExtroversion?: number;
    minAgreeableness?: number;
    minOpenness?: number;
    requiredFlags?: string[];
    minRelationship?: { npc: string; value: number };
  };
  effects?: {
    setFlags?: string[];
    relationshipChanges?: { npc: string; change: number }[];
    questTriggers?: string[];
  };
}

export interface DialogueScene {
  id: string;
  npcId: string;
  startNodeId: string;
  nodes: { [nodeId: string]: DialogueNode };
}
