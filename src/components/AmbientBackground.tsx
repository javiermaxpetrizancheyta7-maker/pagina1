import { useMemo } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

export default function AmbientBackground() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        left: randomBetween(0, 100),
        size: randomBetween(12, 26),
        duration: randomBetween(16, 28),
        delay: -randomBetween(0, 28),
        opacity: randomBetween(0.35, 0.8),
      })),
    [],
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        top: randomBetween(0, 100),
        left: randomBetween(0, 100),
        size: randomBetween(2, 5),
        duration: randomBetween(2.5, 5),
        delay: -randomBetween(0, 5),
      })),
    [],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-32 top-[-10%] h-[28rem] w-[28rem] rounded-full bg-blush-200/50 blur-3xl" />
      <div className="absolute -right-24 top-[30%] h-[24rem] w-[24rem] rounded-full bg-dusty-200/40 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[20%] h-[26rem] w-[26rem] rounded-full bg-cream-200/70 blur-3xl" />

      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute animate-twinkle rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.85)]"
          style={{
            top: `${sparkle.top}%`,
            left: `${sparkle.left}%`,
            width: sparkle.size,
            height: sparkle.size,
            animationDuration: `${sparkle.duration}s`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}

      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute bottom-0 animate-float-up text-cherry-400"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
          }}
        >
          <Heart style={{ width: heart.size, height: heart.size }} className="fill-blush-300 text-blush-400" />
        </span>
      ))}

      <Sparkles className="absolute right-[12%] top-[18%] h-6 w-6 text-dusty-300/70" />
    </div>
  );
}
