import { createContext, useContext, useState } from 'react';

export type Contact = {
  id: string;
  name: string;
  rel: string;
  phone: string;
  color: string;
  on: boolean;
  kind: 'person' | 'community';
};

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'María Fernández', rel: 'Hermana',      phone: '+51 987 654 321', color: '#f4a25a', on: true, kind: 'person' },
  { id: '2', name: 'Carlos Pérez',    rel: 'Mejor amigo',  phone: '+51 912 345 678', color: '#5a9bf4', on: true, kind: 'person' },
  { id: '3', name: 'Ana Torres',      rel: 'Vecina',       phone: '+51 998 765 432', color: '#ef7a92', on: true, kind: 'person' },
  { id: '4', name: 'Unidad Vecinal 12', rel: 'Comunidad',  phone: '+51 999 111 222', color: '#8669f5', on: true, kind: 'community' },
];

type AppContextValue = {
  isAuthenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  contacts: Contact[];
  setContacts: (cs: Contact[]) => void;
  alertStartedAt: number | null;
  setAlertStartedAt: (t: number | null) => void;
  resolvedDuration: number | null;
  setResolvedDuration: (d: number | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [alertStartedAt, setAlertStartedAt] = useState<number | null>(null);
  const [resolvedDuration, setResolvedDuration] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ isAuthenticated, setAuthenticated, contacts, setContacts, alertStartedAt, setAlertStartedAt, resolvedDuration, setResolvedDuration }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
