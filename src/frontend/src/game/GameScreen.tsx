import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen } from 'lucide-react';
import WorldCanvas from './engine/WorldCanvas';
import DialoguePanel from './ui/DialoguePanel';
import QuestJournalPanel from './ui/QuestJournalPanel';
import RelationshipWidget from './ui/RelationshipWidget';
import InteractionPrompt from './ui/InteractionPrompt';
import { useWorldRuntime } from './state/useWorldRuntime';

export default function GameScreen() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [showJournal, setShowJournal] = useState(false);
  
  const {
    nearbyNPC,
    activeDialogue,
    startDialogue,
    closeDialogue,
  } = useWorldRuntime();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  // Handle keyboard input for interaction and journal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        if (nearbyNPC && !activeDialogue) {
          startDialogue(nearbyNPC.id);
        }
      }
      if (e.key === 'j' || e.key === 'J') {
        if (!activeDialogue) {
          setShowJournal(!showJournal);
        }
      }
      if (e.key === 'Escape') {
        if (showJournal) {
          setShowJournal(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nearbyNPC, activeDialogue, showJournal, startDialogue]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D World Canvas */}
      <WorldCanvas />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJournal(!showJournal)}
              className="bg-black/60 backdrop-blur-sm border-white/20 hover:bg-black/80"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Journal (J)
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-black/60 backdrop-blur-sm border-white/20 hover:bg-black/80"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Relationship Widget */}
        <div className="absolute top-20 right-4 pointer-events-auto">
          <RelationshipWidget />
        </div>

        {/* Interaction Prompt */}
        {nearbyNPC && !activeDialogue && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto">
            <InteractionPrompt npcName={nearbyNPC.name} />
          </div>
        )}

        {/* Controls Help */}
        <div className="absolute bottom-4 left-4 text-white/60 text-sm bg-black/40 backdrop-blur-sm px-3 py-2 rounded">
          <p>WASD: Move | Mouse: Look | E: Interact | J: Journal</p>
        </div>
      </div>

      {/* Dialogue Panel */}
      {activeDialogue && (
        <div className="absolute inset-0 pointer-events-auto">
          <DialoguePanel
            dialogueId={activeDialogue}
            onClose={closeDialogue}
          />
        </div>
      )}

      {/* Quest Journal */}
      {showJournal && (
        <div className="absolute inset-0 pointer-events-auto">
          <QuestJournalPanel onClose={() => setShowJournal(false)} />
        </div>
      )}
    </div>
  );
}
