import { useState } from 'react';
import { useCreateProtagonist } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import type { Appearance, PersonalityTraits } from '../backend';

export default function CharacterCreatorScreen() {
  const [appearance, setAppearance] = useState<Appearance>({
    gender: 'neutral',
    hairColor: 'brown',
    eyeColor: 'brown',
    style: 'casual',
  });

  const [traits, setTraits] = useState<PersonalityTraits>({
    extroversion: BigInt(50),
    agreeableness: BigInt(50),
    openness: BigInt(50),
  });

  const [background, setBackground] = useState('mysterious');

  const createProtagonist = useCreateProtagonist();

  const handleSubmit = () => {
    createProtagonist.mutate({ appearance, traits, background });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl">Create Your Character</CardTitle>
          <CardDescription>
            Shape your protagonist's appearance and personality. These choices will influence your journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appearance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender Presentation</Label>
                <Select value={appearance.gender} onValueChange={(v) => setAppearance({ ...appearance, gender: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculine">Masculine</SelectItem>
                    <SelectItem value="feminine">Feminine</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hair Color</Label>
                <Select value={appearance.hairColor} onValueChange={(v) => setAppearance({ ...appearance, hairColor: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="blonde">Blonde</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Eye Color</Label>
                <Select value={appearance.eyeColor} onValueChange={(v) => setAppearance({ ...appearance, eyeColor: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="hazel">Hazel</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={appearance.style} onValueChange={(v) => setAppearance({ ...appearance, style: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="elegant">Elegant</SelectItem>
                    <SelectItem value="edgy">Edgy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personality Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personality Traits</h3>
            <p className="text-sm text-muted-foreground">
              These traits will affect how NPCs respond to you and which dialogue options are available.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Extroversion</Label>
                  <span className="text-sm text-muted-foreground">{Number(traits.extroversion)}</span>
                </div>
                <Slider
                  value={[Number(traits.extroversion)]}
                  onValueChange={(v) => setTraits({ ...traits, extroversion: BigInt(v[0]) })}
                  min={0}
                  max={100}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Introverted ← → Extroverted
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Agreeableness</Label>
                  <span className="text-sm text-muted-foreground">{Number(traits.agreeableness)}</span>
                </div>
                <Slider
                  value={[Number(traits.agreeableness)]}
                  onValueChange={(v) => setTraits({ ...traits, agreeableness: BigInt(v[0]) })}
                  min={0}
                  max={100}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Assertive ← → Diplomatic
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Openness</Label>
                  <span className="text-sm text-muted-foreground">{Number(traits.openness)}</span>
                </div>
                <Slider
                  value={[Number(traits.openness)]}
                  onValueChange={(v) => setTraits({ ...traits, openness: BigInt(v[0]) })}
                  min={0}
                  max={100}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Traditional ← → Adventurous
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Background Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Background</h3>
            <Select value={background} onValueChange={setBackground}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mysterious">Mysterious Newcomer</SelectItem>
                <SelectItem value="local">Long-time Resident</SelectItem>
                <SelectItem value="returning">Returning After Years Away</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full mt-6"
            size="lg"
            disabled={createProtagonist.isPending}
          >
            {createProtagonist.isPending ? 'Creating Character...' : 'Begin Your Journey'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
