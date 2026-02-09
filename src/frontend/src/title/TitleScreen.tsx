import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TitleScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/title-bg.dim_1920x1080.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/assets/generated/logo-mark.dim_512x512.png" 
            alt="Game Logo" 
            className="w-32 h-32 opacity-90"
          />
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white tracking-tight">
          Entangled Hearts
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-12 font-light tracking-wide">
          A dramatic tale of choices and consequences
        </p>

        {/* Login Card */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm max-w-md mx-auto">
          <CardContent className="pt-6">
            <Button 
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="w-full text-lg h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              {isLoggingIn ? 'Connecting...' : 'Begin Your Story'}
            </Button>
            <p className="text-xs text-white/60 mt-4">
              Secure authentication via Internet Identity
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-12 text-sm text-white/50 max-w-2xl mx-auto">
          <p className="italic">
            This is an original work of interactive fiction inspired by the dramatic storytelling traditions of daytime television. 
            All characters, locations, and storylines are entirely fictional and created specifically for this experience.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-sm z-10">
        © 2026. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">caffeine.ai</a>
      </footer>
    </div>
  );
}
