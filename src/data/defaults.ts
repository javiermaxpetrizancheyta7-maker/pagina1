import type { Dream, Letter, PetState, QuizQuestion, Song, StoryMoment, SurpriseContent } from '@/types';

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    question: '¿Cuál es mi comida favorita?',
    options: ['Pizza', 'Sushi', 'Tacos', 'Pasta'],
    answer: 2,
  },
  {
    id: 'q-2',
    question: '¿Qué prefiero hacer cuando tengo un día libre?',
    options: ['Dormir todo el día', 'Salir a caminar', 'Ver películas en casa', 'Ir de compras'],
    answer: 2,
  },
  {
    id: 'q-3',
    question: '¿Cuál es mi color favorito?',
    options: ['Azul', 'Verde', 'Rosa', 'Negro'],
    answer: 2,
  },
  {
    id: 'q-4',
    question: '¿Cuál es mi canción favorita de nosotros?',
    options: ['La primera que bailamos', 'La del viaje', 'La de la lluvia', 'La que siempre canto'],
    answer: 0,
  },
];

export const DEFAULT_STORY: StoryMoment[] = [
  {
    id: 'story-1',
    title: 'Cómo nos conocimos',
    date: '',
    text: 'Toca Editar para contar cómo fue aquel primer momento en el que nuestros caminos se cruzaron.',
  },
  {
    id: 'story-2',
    title: 'Cuándo comenzamos a hablar',
    date: '',
    text: 'Toca Editar para contar cuándo empezaron las primeras conversaciones que no querían terminar.',
  },
  {
    id: 'story-3',
    title: 'Nuestra primera cita',
    date: '',
    text: 'Toca Editar para recordar dónde fue nuestra primera cita y qué sentiste aquella noche.',
  },
  {
    id: 'story-4',
    title: 'El inicio de nuestra relación',
    date: '',
    text: 'Toca Editar para contar el momento en que decidimos caminar juntos de forma oficial.',
  },
  {
    id: 'story-5',
    title: 'Nuestros momentos favoritos',
    date: '',
    text: 'Toca Editar para escribir los momentos que más atesoras de la vida que compartes.',
  },
];

export const DEFAULT_LETTERS: Letter[] = [
  {
    id: 'letter-sad',
    label: 'Ábreme cuando estés triste',
    text: 'Toca Editar para escribir el mensaje que quieres que lea en sus días más difíciles.',
  },
  {
    id: 'letter-miss',
    label: 'Ábreme cuando me extrañes',
    text: 'Toca Editar para escribir lo que quieres que sienta cuando la extrañe.',
  },
  {
    id: 'letter-bad-day',
    label: 'Ábreme cuando tengas un mal día',
    text: 'Toca Editar para escribir unas palabras que la acompañen en un mal día.',
  },
  {
    id: 'letter-love',
    label: 'Ábreme cuando necesites recordar cuánto te amo',
    text: 'Toca Editar para escribir lo mucho que la amas, con tus propias palabras.',
  },
  {
    id: 'letter-smile',
    label: 'Ábreme cuando quieras sonreír',
    text: 'Toca Editar para escribir algo que le saque una sonrisa.',
  },
];

export const DEFAULT_DREAMS: Dream[] = [
  { id: 'dream-1', title: 'Viajar a lugares nuevos juntos', category: 'Viajes', done: false },
  { id: 'dream-2', title: 'Ver películas en el cine', category: 'Películas', done: false },
  { id: 'dream-3', title: 'Cocinar una receta nueva cada mes', category: 'Cocina', done: false },
  { id: 'dream-4', title: 'Celebrar cada aniversario con una cena especial', category: 'Aniversarios', done: false },
  { id: 'dream-5', title: 'Ver un atardecer frente al mar', category: 'Atardecer', done: false },
  { id: 'dream-6', title: 'Cumplir nuestros sueños uno por uno', category: 'Sueños', done: false },
];

export const DEFAULT_SURPRISE: SurpriseContent = {
  title: 'Una carta solo para ti',
  message: 'Toca Editar para escribir el mensaje especial que quieres regalarle.',
};

export const DEFAULT_SONGS: Song[] = [
  {
    id: 'song-until-we-leave-the-ground',
    title: 'Until We Leave the Ground',
    artist: 'Emmit Fenn',
    description: '',
    cover: '',
    audioUrl: 'https://www.youtube.com/watch?v=jzFhkjsizqc',
  },
];

export const DEFAULT_PET: PetState = { fullness: 70, affection: 60, updatedAt: 0 };
