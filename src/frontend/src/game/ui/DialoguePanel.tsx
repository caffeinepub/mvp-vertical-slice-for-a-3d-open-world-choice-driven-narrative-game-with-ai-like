import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { dialogues } from '../content/dialogues';
import { useProtagonist } from '../state/useProtagonist';
import { useGetPersistentGameState, useAddQuestToPlayer } from '../../hooks/useQueries';
import type { DialogueNode, DialogueChoice } from '../dialogue/dialogueTypes';

interface DialoguePanelProps {
  dialogueId: string;
  onClose: () => void;
}

export default function DialoguePanel({ dialogueId, onClose }: DialoguePanelProps) {
  const { data: protagonist } = useProtagonist();
  const { data: gameState } = useGetPersistentGameState();
  const addQuest = useAddQuestToPlayer();

  const scene = dialogues[dialogueId];
  const [currentNodeId, setCurrentNodeId] = useState(scene?.startNodeId || '');

  useEffect(() => {
    if (scene) {
      setCurrentNodeId(scene.startNodeId);
    }
  }, [scene]);

  if (!scene || !protagonist || !gameState) {
    return null;
  }

  const currentNode = scene.nodes[currentNodeId];

  if (!currentNode || currentNode.id === 'end') {
    onClose();
    return null;
  }

  const handleChoice = (choice: DialogueChoice) => {
    // Apply effects
    if (choice.effects?.questTriggers) {
      choice.effects.questTriggers.forEach((questId) => {
        addQuest.mutate(questId);
      });
    }

    // Move to next node
    setCurrentNodeId(choice.nextNodeId);
  };

  const isChoiceAvailable = (choice: DialogueChoice): boolean => {
    if (!choice.conditions) return true;

    const { minExtroversion, minAgreeableness, minOpenness, requiredFlags, minRelationship } = choice.conditions;

    if (minExtroversion && Number(protagonist.traits.extroversion) < minExtroversion) return false;
    if (minAgreeableness && Number(protagonist.traits.agreeableness) < minAgreeableness) return false;
    if (minOpenness && Number(protagonist.traits.openness) < minOpenness) return false;

    if (requiredFlags) {
      const hasAllFlags = requiredFlags.every((flag) => gameState.questFlags.includes(flag));
      if (!hasAllFlags) return false;
    }

    if (minRelationship) {
      const relationship = gameState.npcRelationships.find(([npc]) => npc === minRelationship.npc);
      if (!relationship || Number(relationship[1]) < minRelationship.value) return false;
    }

    return true;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle className="text-2xl">{currentNode.speaker}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">{currentNode.text}</p>

          <div className="space-y-3">
            {currentNode.choices.map((choice, index) => {
              const available = isChoiceAvailable(choice);
              return (
                <Button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  disabled={!available}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                >
                  <span className="flex-1">{choice.text}</span>
                  {!available && (
                    <Badge variant="secondary" className="ml-2">
                      Locked
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
