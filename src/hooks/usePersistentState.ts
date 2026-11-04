import { useCallback } from 'react';
import { useAppState } from '@/context/AppStateContext';

export function usePersistentState<T>(key: string, fallback: T) {
  const { values, saveValue } = useAppState();
  const value = key in values ? (values[key] as T) : fallback;

  const setValue = useCallback((next: T): boolean => saveValue(key, next), [key, saveValue]);

  return [value, setValue] as const;
}
