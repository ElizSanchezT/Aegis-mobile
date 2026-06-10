import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { SubHeader } from '@/components/aegis/app-header';
import { TabBar } from '@/components/aegis/tab-bar';
import { Canvas, Ink } from '@/constants/theme';

export default function SettingsScreen() {
  const handleTabChange = (tab: 'home' | 'contacts' | 'resources' | 'settings') => {
    if (tab === 'settings') return;
    router.replace(tab === 'home' ? '/' : `/${tab}` as '/contacts' | '/resources');
  };

  return (
    <View style={styles.screen}>
      <SubHeader title="Ajustes" />

      <View style={styles.content}>
        <Text style={styles.muted}>Las preferencias de cuenta aparecerán aquí.</Text>
      </View>

      <TabBar active="settings" onChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Canvas },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  muted: {
    fontSize: 14,
    color: Ink[500],
  },
});
