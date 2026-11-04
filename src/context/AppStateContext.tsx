import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

type AppStateValues = Record<string, unknown>;
type LoadStatus = 'loading' | 'ready' | 'error';

interface AppStateContextValue {
  values: AppStateValues;
  saveValue: (key: string, value: unknown) => boolean;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [values, setValues] = useState<AppStateValues>({});

  const fetchAll = useCallback(async (): Promise<boolean> => {
    const { data, error } = await supabase.from('app_state').select('key, value');
    if (error || !Array.isArray(data)) {
      console.error('No se pudo cargar el contenido:', error);
      return false;
    }
    setValues(Object.fromEntries(data.map((row) => [row.key, row.value])));
    return true;
  }, []);

  const connect = useCallback(() => {
    setStatus('loading');
    void fetchAll().then((ok) => setStatus(ok ? 'ready' : 'error'));
  }, [fetchAll]);

  useEffect(() => {
    connect();
  }, [connect]);

  const saveValue = useCallback(
    (key: string, value: unknown): boolean => {
      setValues((current) => ({ ...current, [key]: value }));
      supabase
        .from('app_state')
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (!error) return;
          console.error('No se pudo guardar el contenido:', error);
          void fetchAll();
        });
      return true;
    },
    [fetchAll],
  );

  const contextValue = useMemo(() => ({ values, saveValue }), [values, saveValue]);

  if (status !== 'ready') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-cream-50 via-blush-50 to-blush-100 px-6 text-center text-ink-800">
        {status === 'loading' ? (
          <p className="font-display text-2xl text-ink-900">Preparando su universo...</p>
        ) : (
          <>
            <p className="font-display text-2xl text-ink-900">No pudimos cargar el contenido.</p>
            <p className="text-sm text-ink-800">Revisa tu conexión a internet e inténtalo de nuevo.</p>
            <button onClick={connect} className="btn-primary mt-2">
              Reintentar
            </button>
          </>
        )}
      </div>
    );
  }

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState debe usarse dentro de AppStateProvider');
  return context;
}
