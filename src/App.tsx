import { useEffect, useState } from 'react';
import AmbientBackground from '@/components/AmbientBackground';
import Cover from '@/components/Cover';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';
import Navbar from '@/components/Navbar';
import { AppStateProvider } from '@/context/AppStateContext';
import { CoupleSettingsProvider } from '@/context/CoupleSettingsContext';
import { MusicProvider, useMusic } from '@/context/MusicContext';
import LettersSection from '@/sections/LettersSection';
import MemoriesSection from '@/sections/MemoriesSection';
import CountdownSection from '@/sections/CountdownSection';
import DreamsSection from '@/sections/DreamsSection';
import GameSection from '@/sections/GameSection';
import PetSection from '@/sections/PetSection';
import PlaylistSection from '@/sections/PlaylistSection';
import ReasonsSection from '@/sections/ReasonsSection';
import StorySection from '@/sections/StorySection';
import SurpriseSection from '@/sections/SurpriseSection';

type Phase = 'cover' | 'leaving' | 'site';

const TRANSITION_MS = 1100;

function Experience() {
  const [phase, setPhase] = useState<Phase>('cover');
  const { start } = useMusic();

  useEffect(() => {
    if (phase !== 'leaving') return;
    const id = window.setTimeout(() => setPhase('site'), TRANSITION_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const enter = () => {
    start();
    setPhase('leaving');
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-cream-50 via-blush-50 to-blush-100 text-ink-900">
      <AmbientBackground />

      {phase !== 'site' && <Cover leaving={phase === 'leaving'} onEnter={enter} />}

      {phase === 'site' && (
        <div className="relative z-10 animate-fade-in">
          <Navbar />
          <main>
            <div id="inicio" className="scroll-mt-0" />
            <StorySection />
            <MemoriesSection />
            <LettersSection />
            <ReasonsSection />
            <GameSection />
            <DreamsSection />
            <PetSection />
            <PlaylistSection />
            <CountdownSection />
            <SurpriseSection />
          </main>
          <Footer />
          <MusicPlayer />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <CoupleSettingsProvider>
        <MusicProvider>
          <Experience />
        </MusicProvider>
      </CoupleSettingsProvider>
    </AppStateProvider>
  );
}
