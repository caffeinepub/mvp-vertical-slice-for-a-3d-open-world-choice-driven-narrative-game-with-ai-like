import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { useGetActiveQuests } from '../../hooks/useQueries';
import { Variant_completed_inProgress_failed } from '../../backend';

interface QuestJournalPanelProps {
  onClose: () => void;
}

export default function QuestJournalPanel({ onClose }: QuestJournalPanelProps) {
  const { data: quests = [], isLoading } = useGetActiveQuests();

  const activeQuests = quests.filter((q) => q.state === Variant_completed_inProgress_failed.inProgress);
  const completedQuests = quests.filter((q) => q.state === Variant_completed_inProgress_failed.completed);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/journal-icons.dim_256x256.png" 
              alt="Journal" 
              className="w-8 h-8 opacity-80"
            />
            <CardTitle className="text-2xl">Quest Journal</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {isLoading ? (
              <p className="text-muted-foreground">Loading quests...</p>
            ) : (
              <div className="space-y-6">
                {/* Active Quests */}
                {activeQuests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="default">Active</Badge>
                      <span>{activeQuests.length} Quest{activeQuests.length !== 1 ? 's' : ''}</span>
                    </h3>
                    <div className="space-y-4">
                      {activeQuests.map((quest) => (
                        <Card key={quest.questId} className="border-primary/20">
                          <CardHeader>
                            <CardTitle className="text-lg">{quest.questId.replace('quest_', '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {quest.objectives.map((objective, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  {objective.isComplete ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                                  )}
                                  <span className={objective.isComplete ? 'line-through text-muted-foreground' : ''}>
                                    {objective.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeQuests.length > 0 && completedQuests.length > 0 && <Separator />}

                {/* Completed Quests */}
                {completedQuests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="secondary">Completed</Badge>
                      <span>{completedQuests.length} Quest{completedQuests.length !== 1 ? 's' : ''}</span>
                    </h3>
                    <div className="space-y-4">
                      {completedQuests.map((quest) => (
                        <Card key={quest.questId} className="border-muted">
                          <CardHeader>
                            <CardTitle className="text-lg text-muted-foreground">
                              {quest.questId.replace('quest_', '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeQuests.length === 0 && completedQuests.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No quests yet. Explore and talk to NPCs to begin your journey.
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
