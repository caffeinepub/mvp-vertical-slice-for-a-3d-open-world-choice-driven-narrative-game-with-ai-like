import { Card } from '@/components/ui/card';

interface InteractionPromptProps {
  npcName: string;
}

export default function InteractionPrompt({ npcName }: InteractionPromptProps) {
  return (
    <Card className="bg-black/80 backdrop-blur-sm border-white/30 px-6 py-3">
      <p className="text-white text-center">
        Press <kbd className="px-2 py-1 bg-white/20 rounded text-sm font-mono">E</kbd> to talk to {npcName}
      </p>
    </Card>
  );
}
