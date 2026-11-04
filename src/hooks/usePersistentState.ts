import { useCallback, useState } from 'react';
import { loadValue, saveValue } from '@/lib/storage';

export function usePersistentState<T>(key: string, fallback: T) {
  const [value, setState] = useState<T>(() => loadValue(key, fallback));

  const setValue = useCallback(
    (next: T): boolean => {
      const saved = saveValue(key, next);
      if (saved) setState(next);
      return saved;
    },
    [key],
  );

  return [value, setValue] as const;
}
