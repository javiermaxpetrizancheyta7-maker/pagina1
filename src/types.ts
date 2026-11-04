export interface CoupleSettings {
  nameA: string;
  nameB: string;
  togetherSince: string;
  coverTitle: string;
  coverPhrase: string;
}

export interface StoryMoment {
  id: string;
  title: string;
  date: string;
  text: string;
}

export interface Memory {
  id: string;
  photo: string;
  date: string;
  description: string;
}

export interface Letter {
  id: string;
  label: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
}

export const DREAM_CATEGORIES = [
  'Viajes',
  'Películas',
  'Cocina',
  'Aniversarios',
  'Atardecer',
  'Sueños',
] as const;

export type DreamCategory = (typeof DREAM_CATEGORIES)[number];

export interface Dream {
  id: string;
  title: string;
  category: DreamCategory;
  done: boolean;
}

export interface PetState {
  fullness: number;
  affection: number;
  updatedAt: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  description: string;
  cover: string;
  audioUrl: string;
}

export interface SurpriseContent {
  title: string;
  message: string;
}
