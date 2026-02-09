import type { DialogueScene } from '../dialogue/dialogueTypes';

export const dialogues: { [sceneId: string]: DialogueScene } = {
  npc_victoria: {
    id: 'victoria_intro',
    npcId: 'npc_victoria',
    startNodeId: 'victoria_1',
    nodes: {
      victoria_1: {
        id: 'victoria_1',
        speaker: 'Victoria',
        text: "Well, well... I don't believe we've met. You must be new to Riverside Heights. I'm Victoria Ashford.",
        choices: [
          {
            text: "Pleased to meet you. I'm just getting settled in.",
            nextNodeId: 'victoria_2a',
            effects: {
              relationshipChanges: [{ npc: 'Victoria', change: 5 }],
            },
          },
          {
            text: "I've heard your name around town. You seem... influential.",
            nextNodeId: 'victoria_2b',
            conditions: { minExtroversion: 60 },
            effects: {
              relationshipChanges: [{ npc: 'Victoria', change: 10 }],
            },
          },
          {
            text: "Just passing through.",
            nextNodeId: 'victoria_2c',
            effects: {
              relationshipChanges: [{ npc: 'Victoria', change: -5 }],
            },
          },
        ],
      },
      victoria_2a: {
        id: 'victoria_2a',
        speaker: 'Victoria',
        text: "How diplomatic. I appreciate that. This town can be... complicated. Perhaps we'll speak again soon.",
        choices: [
          {
            text: "I'd like that.",
            nextNodeId: 'end',
            effects: {
              setFlags: ['victoria_met'],
              questTriggers: ['quest_social_circles'],
            },
          },
        ],
      },
      victoria_2b: {
        id: 'victoria_2b',
        speaker: 'Victoria',
        text: "Observant AND bold. I like that. Yes, I have certain... connections. Perhaps you and I could help each other.",
        choices: [
          {
            text: "I'm listening.",
            nextNodeId: 'end',
            effects: {
              setFlags: ['victoria_met', 'victoria_alliance'],
              questTriggers: ['quest_social_circles'],
            },
          },
        ],
      },
      victoria_2c: {
        id: 'victoria_2c',
        speaker: 'Victoria',
        text: "How... disappointing. Well, don't let me keep you.",
        choices: [
          {
            text: "[Leave]",
            nextNodeId: 'end',
            effects: {
              setFlags: ['victoria_met'],
            },
          },
        ],
      },
      end: {
        id: 'end',
        speaker: 'Victoria',
        text: '',
        choices: [],
      },
    },
  },
  npc_marcus: {
    id: 'marcus_intro',
    npcId: 'npc_marcus',
    startNodeId: 'marcus_1',
    nodes: {
      marcus_1: {
        id: 'marcus_1',
        speaker: 'Marcus',
        text: "Hey there. Marcus Reeves. You look lost—need any help finding your way around?",
        choices: [
          {
            text: "Actually, yes. This place is bigger than I expected.",
            nextNodeId: 'marcus_2a',
            effects: {
              relationshipChanges: [{ npc: 'Marcus', change: 10 }],
            },
          },
          {
            text: "I can manage on my own, thanks.",
            nextNodeId: 'marcus_2b',
            effects: {
              relationshipChanges: [{ npc: 'Marcus', change: 0 }],
            },
          },
        ],
      },
      marcus_2a: {
        id: 'marcus_2a',
        speaker: 'Marcus',
        text: "No problem. Stick with me and you'll learn the ropes. Just... watch out for Victoria. She's got her claws in everything around here.",
        choices: [
          {
            text: "Thanks for the warning.",
            nextNodeId: 'end',
            effects: {
              setFlags: ['marcus_met', 'marcus_warned_victoria'],
              questTriggers: ['quest_hidden_truths'],
            },
          },
        ],
      },
      marcus_2b: {
        id: 'marcus_2b',
        speaker: 'Marcus',
        text: "Suit yourself. But if you change your mind, I'm usually around.",
        choices: [
          {
            text: "[Leave]",
            nextNodeId: 'end',
            effects: {
              setFlags: ['marcus_met'],
            },
          },
        ],
      },
      end: {
        id: 'end',
        speaker: 'Marcus',
        text: '',
        choices: [],
      },
    },
  },
  npc_elena: {
    id: 'elena_intro',
    npcId: 'npc_elena',
    startNodeId: 'elena_1',
    nodes: {
      elena_1: {
        id: 'elena_1',
        speaker: 'Elena',
        text: "Oh! I didn't expect to see anyone here. I'm Elena. Are you... looking for something?",
        choices: [
          {
            text: "Just exploring. What brings you here?",
            nextNodeId: 'elena_2a',
            conditions: { minOpenness: 50 },
            effects: {
              relationshipChanges: [{ npc: 'Elena', change: 8 }],
            },
          },
          {
            text: "Nothing important.",
            nextNodeId: 'elena_2b',
            effects: {
              relationshipChanges: [{ npc: 'Elena', change: 2 }],
            },
          },
        ],
      },
      elena_2a: {
        id: 'elena_2a',
        speaker: 'Elena',
        text: "I come here to think. Away from all the drama. You seem different from the others... maybe we could talk more sometime?",
        choices: [
          {
            text: "I'd like that.",
            nextNodeId: 'end',
            effects: {
              setFlags: ['elena_met', 'elena_friend'],
              questTriggers: ['quest_secrets_shadows'],
            },
          },
        ],
      },
      elena_2b: {
        id: 'elena_2b',
        speaker: 'Elena',
        text: "Oh... okay. Well, see you around, I guess.",
        choices: [
          {
            text: "[Leave]",
            nextNodeId: 'end',
            effects: {
              setFlags: ['elena_met'],
            },
          },
        ],
      },
      end: {
        id: 'end',
        speaker: 'Elena',
        text: '',
        choices: [],
      },
    },
  },
};
