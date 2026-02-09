import type { Quest } from '../../backend';

export const questDefinitions: Quest[] = [
  {
    id: 'quest_social_circles',
    title: 'Social Circles',
    description: 'Navigate the complex social dynamics of Riverside Heights. Meet the key players and decide where your loyalties lie.',
    objectives: [
      { description: 'Meet Victoria Ashford', isComplete: false },
      { description: 'Meet Marcus Reeves', isComplete: false },
      { description: 'Meet Elena Torres', isComplete: false },
      { description: 'Choose an ally', isComplete: false },
    ],
    rewards: ['Increased influence in Riverside Heights'],
  },
  {
    id: 'quest_hidden_truths',
    title: 'Hidden Truths',
    description: "Marcus mentioned that Victoria has secrets. Investigate what she's really up to.",
    objectives: [
      { description: "Learn about Victoria's business dealings", isComplete: false },
      { description: 'Gather evidence', isComplete: false },
      { description: 'Decide what to do with the information', isComplete: false },
    ],
    rewards: ['Unlock new dialogue options', 'Reputation shift'],
  },
  {
    id: 'quest_secrets_shadows',
    title: 'Secrets in the Shadows',
    description: 'Elena seems troubled by something. Help her uncover what she is hiding from.',
    objectives: [
      { description: "Gain Elena's trust", isComplete: false },
      { description: 'Discover her secret', isComplete: false },
      { description: 'Help her resolve the situation', isComplete: false },
    ],
    rewards: ['Deep friendship with Elena', 'Access to hidden areas'],
  },
];
