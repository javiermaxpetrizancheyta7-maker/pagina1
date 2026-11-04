export type PetMood = 'radiante' | 'tranquila' | 'triste';

interface PetCharacterProps {
  mood: PetMood;
}

const INK = '#4a3238';
const FUR = '#e9c3c9';
const MUZZLE = '#fbeef1';

export default function PetCharacter({ mood }: PetCharacterProps) {
  const happy = mood === 'radiante';
  const sad = mood === 'triste';

  return (
    <svg viewBox="0 0 200 210" className="h-full w-full" role="img" aria-label={`Mochi se siente ${mood}`}>
      <ellipse cx="100" cy="196" rx="52" ry="8" fill="#3a2a2f" opacity="0.12" />

      <ellipse cx="100" cy="132" rx="62" ry="54" fill={FUR} />
      <ellipse cx="100" cy="142" rx="34" ry="30" fill={MUZZLE} opacity="0.6" />

      <ellipse cx="54" cy="150" rx="13" ry="20" fill={FUR} transform="rotate(20 54 150)" />
      <ellipse cx="146" cy="150" rx="13" ry="20" fill={FUR} transform="rotate(-20 146 150)" />
      <ellipse cx="80" cy="182" rx="18" ry="11" fill={FUR} />
      <ellipse cx="120" cy="182" rx="18" ry="11" fill={FUR} />

      <circle cx="100" cy="84" r="52" fill={FUR} />
      <circle cx="58" cy="44" r="20" fill={FUR} />
      <circle cx="142" cy="44" r="20" fill={FUR} />
      <circle cx="58" cy="44" r="10" fill="#f3d3d8" />
      <circle cx="142" cy="44" r="10" fill="#f3d3d8" />

      <ellipse cx="100" cy="100" rx="30" ry="22" fill={MUZZLE} />

      <ellipse cx="68" cy="104" rx="10" ry="6" fill="#ea7d9b" opacity={happy ? 0.75 : 0.45} />
      <ellipse cx="132" cy="104" rx="10" ry="6" fill="#ea7d9b" opacity={happy ? 0.75 : 0.45} />

      {happy ? (
        <>
          <path d="M 68 82 Q 78 70 88 82" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <path d="M 112 82 Q 122 70 132 82" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="78" cy={sad ? 86 : 82} r="5.5" fill={INK} />
          <circle cx="122" cy={sad ? 86 : 82} r="5.5" fill={INK} />
          <circle cx="80" cy={sad ? 84 : 80} r="1.8" fill="#fff" />
          <circle cx="124" cy={sad ? 84 : 80} r="1.8" fill="#fff" />
        </>
      )}
      {sad && (
        <>
          <path d="M 66 72 L 86 76" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 134 72 L 114 76" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      <ellipse cx="100" cy="98" rx="6.5" ry="5" fill={INK} />
      {happy && <path d="M 88 110 Q 100 124 112 110" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />}
      {mood === 'tranquila' && <path d="M 92 112 Q 100 116 108 112" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />}
      {sad && <path d="M 88 118 Q 100 108 112 118" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />}

      {happy && (
        <path
          d="M 100 150 C 92 144 86 140 86 134 C 86 129 90 127 93 127 C 96 127 99 129 100 132 C 101 129 104 127 107 127 C 110 127 114 129 114 134 C 114 140 108 144 100 150 Z"
          fill="#d13a5f"
        />
      )}
      {sad && <path d="M 150 70 Q 154 80 150 86 Q 146 80 150 70 Z" fill="#8fbfd9" />}
    </svg>
  );
}
