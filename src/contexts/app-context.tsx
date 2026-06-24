import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const REGISTERED_KEY = 'aegis_registered';
const FIRSTNAME_KEY = 'aegis_firstname';
const USERID_KEY = 'aegis_userid';

type AppContextValue = {
  isAuthenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  hasRegistered: boolean | null;
  markRegistered: () => Promise<void>;
  firstName: string;
  setFirstName: (name: string) => Promise<void>;
  userId: number | null;
  setUserId: (id: number) => Promise<void>;
  logout: () => void;
  alertStartedAt: number | null;
  setAlertStartedAt: (t: number | null) => void;
  alertId: number | null;
  setAlertId: (id: number | null) => void;
  resolvedDuration: number | null;
  setResolvedDuration: (d: number | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [hasRegistered, setHasRegistered] = useState<boolean | null>(null);
  const [firstName, setFirstNameState] = useState('');
  const [userId, setUserIdState] = useState<number | null>(null);
  const [alertStartedAt, setAlertStartedAt] = useState<number | null>(null);
  const [alertId, setAlertId] = useState<number | null>(null);
  const [resolvedDuration, setResolvedDuration] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(REGISTERED_KEY),
      AsyncStorage.getItem(FIRSTNAME_KEY),
      AsyncStorage.getItem(USERID_KEY),
    ]).then(([reg, name, uid]) => {
      setHasRegistered(reg === 'true');
      if (name) setFirstNameState(name);
      if (uid) setUserIdState(Number(uid));
    });
  }, []);

  async function markRegistered() {
    await AsyncStorage.setItem(REGISTERED_KEY, 'true');
    setHasRegistered(true);
  }

  async function setFirstName(name: string) {
    await AsyncStorage.setItem(FIRSTNAME_KEY, name);
    setFirstNameState(name);
  }

  async function setUserId(id: number) {
    await AsyncStorage.setItem(USERID_KEY, String(id));
    setUserIdState(id);
  }

  function logout() {
    setAuthenticated(false);
  }

  return (
    <AppContext.Provider value={{
      isAuthenticated, setAuthenticated,
      hasRegistered, markRegistered,
      firstName, setFirstName,
      userId, setUserId,
      logout,
      alertStartedAt, setAlertStartedAt,
      alertId, setAlertId,
      resolvedDuration, setResolvedDuration,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
