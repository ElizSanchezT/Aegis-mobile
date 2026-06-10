import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppContextProvider } from '@/contexts/app-context';

export default function RootLayout() {
  return (
    <AppContextProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome"   options={{ animation: 'fade' }} />
        <Stack.Screen name="login"     options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="index"     options={{ animation: 'none' }} />
        <Stack.Screen name="contacts"  options={{ animation: 'none' }} />
        <Stack.Screen name="resources" options={{ animation: 'none' }} />
        <Stack.Screen name="settings"  options={{ animation: 'none' }} />
        <Stack.Screen name="active"    options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="resolved"  options={{ animation: 'fade' }} />
        <Stack.Screen name="explore"   options={{ animation: 'none' }} />
      </Stack>
    </AppContextProvider>
  );
}
