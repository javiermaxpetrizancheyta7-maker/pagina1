import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { usePersistentState } from '@/hooks/usePersistentState';
import SettingsDialog from '@/components/SettingsDialog';
import type { CoupleSettings } from '@/types';

const DEFAULT_SETTINGS: CoupleSettings = {
  nameA: '',
  nameB: '',
  togetherSince: '',
  coverTitle: 'Nuestro pequeño universo',
  coverPhrase: 'Contigo, cada día se siente como el primero y también como el más bonito.',
};

interface CoupleSettingsContextValue {
  settings: CoupleSettings;
  saveSettings: (next: CoupleSettings) => boolean;
  openSettings: () => void;
}

const CoupleSettingsContext = createContext<CoupleSettingsContextValue | null>(null);

export function CoupleSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = usePersistentState<CoupleSettings>('pu:settings', DEFAULT_SETTINGS);
  const [open, setOpen] = useState(false);

  const openSettings = useCallback(() => setOpen(true), []);
  const closeSettings = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ settings, saveSettings: setSettings, openSettings }),
    [settings, setSettings, openSettings],
  );

  return (
    <CoupleSettingsContext.Provider value={value}>
      {children}
      <SettingsDialog open={open} onClose={closeSettings} settings={settings} onSave={setSettings} />
    </CoupleSettingsContext.Provider>
  );
}

export function useCoupleSettings(): CoupleSettingsContextValue {
  const context = useContext(CoupleSettingsContext);
  if (!context) throw new Error('useCoupleSettings debe usarse dentro de CoupleSettingsProvider');
  return context;
}
