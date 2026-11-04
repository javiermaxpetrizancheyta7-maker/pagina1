import {
  BookHeart,
  Camera,
  Clock,
  Gift,
  Globe,
  Heart,
  Mail,
  Music,
  PawPrint,
  Puzzle,
  type LucideIcon,
} from 'lucide-react';

export interface NavSection {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'historia', label: 'Nuestra historia', hint: 'La línea del tiempo de los dos', icon: BookHeart },
  { id: 'recuerdos', label: 'Nuestros recuerdos', hint: 'Fotografías que guardan el tiempo', icon: Camera },
  { id: 'cartas', label: 'Cartas de amor', hint: 'Sobres para abrir cuando lo necesites', icon: Mail },
  { id: 'razones', label: '100 razones', hint: 'Por qué te amo', icon: Heart },
  { id: 'juego', label: '¿Cuánto nos conocemos?', hint: 'Un juego para dos', icon: Puzzle },
  { id: 'sueños', label: 'Nuestra lista de sueños', hint: 'Lo que queremos vivir juntos', icon: Globe },
  { id: 'mascota', label: 'Nuestra mascota', hint: 'Mochi necesita cariño', icon: PawPrint },
  { id: 'playlist', label: 'Nuestra playlist', hint: 'Canciones que nos pertenecen', icon: Music },
  { id: 'contador', label: 'Cuenta regresiva', hint: 'El tiempo que llevamos juntos', icon: Clock },
  { id: 'sorpresa', label: 'Una sorpresa final', hint: 'Algo especial te espera', icon: Gift },
];
