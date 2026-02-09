import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetPersistentGameState } from '../../hooks/useQueries';

export default function RelationshipWidget() {
  const { data: gameState } = useGetPersistentGameState();

  if (!gameState || gameState.npcRelationships.length === 0) {
    return null;
  }

  return (
    <Card className="w-64 bg-black/60 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-white">Relationships</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {gameState.npcRelationships.map(([npc, value]) => (
          <div key={npc} className="space-y-1">
            <div className="flex justify-between text-xs text-white/80">
              <span>{npc}</span>
              <span>{Number(value)}/100</span>
            </div>
            <Progress value={Number(value)} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
