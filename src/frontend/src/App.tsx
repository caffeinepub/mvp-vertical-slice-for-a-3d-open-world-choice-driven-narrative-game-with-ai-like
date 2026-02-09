import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import TitleScreen from './title/TitleScreen';
import ProfileSetupModal from './profile/ProfileSetupModal';
import CharacterCreatorScreen from './character/CharacterCreatorScreen';
import GameScreen from './game/GameScreen';
import { useProtagonist } from './game/state/useProtagonist';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: protagonist, isLoading: protagonistLoading } = useProtagonist();

  const isAuthenticated = !!identity;

  // Show loading during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Initializing...</div>
      </div>
    );
  }

  // Show title screen if not authenticated
  if (!isAuthenticated) {
    return <TitleScreen />;
  }

  // Show profile setup if authenticated but no profile (avoid flash)
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;
  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  // Show character creator if profile exists but no protagonist
  if (!protagonistLoading && !protagonist) {
    return <CharacterCreatorScreen />;
  }

  // Show game screen if everything is ready
  if (protagonist) {
    return <GameScreen />;
  }

  // Loading state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-foreground text-lg">Loading...</div>
    </div>
  );
}
