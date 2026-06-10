import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SubHeader } from '@/components/aegis/app-header';
import { IconBell, IconChat, IconChevR, IconFire, IconLocation, IconPhone } from '@/components/aegis/icons';
import { TabBar } from '@/components/aegis/tab-bar';
import { Canvas, Ink, Line, Shadow, SOS } from '@/constants/theme';

type Resource = {
  id: string;
  name: string;
  sub: string;
  num: string | null;
  bg: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

const RESOURCES: Resource[] = [
  { id: '100',  name: 'Línea 100',  sub: 'Policía Nacional',              num: '100',  bg: '#ef4a64', Icon: IconPhone },
  { id: '1818', name: 'Línea 1818', sub: 'Centro de Emergencia Mujer',    num: '1818', bg: '#7a5af0', Icon: IconBell },
  { id: '105',  name: 'Línea 105',  sub: 'Bomberos',                      num: '105',  bg: '#f59e3b', Icon: IconFire },
  { id: 'chat', name: 'Chat 1818',  sub: 'Atención psicológica en línea', num: null,   bg: '#22a86a', Icon: IconChat },
  { id: 'near', name: 'Servicios cercanos', sub: 'Ver centros de apoyo cerca de ti', num: null, bg: '#3b82f6', Icon: IconLocation },
];

export default function ResourcesScreen() {
  const handleTabChange = (tab: 'home' | 'contacts' | 'resources' | 'settings') => {
    if (tab === 'resources') return;
    router.replace(tab === 'home' ? '/' : `/${tab}` as '/contacts' | '/settings');
  };

  return (
    <View style={styles.screen}>
      <SubHeader title="Recursos de ayuda" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.warnBanner}>
          <View style={styles.warnIco}>
            <IconPhone size={22} color={SOS[600]} />
          </View>
          <Text style={styles.warnText}>
            En una emergencia grave, comunícate también con las autoridades.
          </Text>
        </View>

        <View style={styles.resourceList}>
          {RESOURCES.map(r => (
            <Pressable key={r.id} style={({ pressed }) => [styles.resourceCard, pressed && styles.resourceCardPressed]}>
              <View style={[styles.resourceIco, { backgroundColor: r.bg }]}>
                <r.Icon size={22} color="#fff" />
              </View>
              <View style={styles.resourceBody}>
                <Text style={styles.resourceName}>{r.name}</Text>
                <Text style={styles.resourceSub}>{r.sub}</Text>
              </View>
              <View style={styles.resourceRight}>
                {r.num && <Text style={styles.resourceNum}>{r.num}</Text>}
                <IconChevR size={18} color="#b5b0c8" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <TabBar active="resources" onChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Canvas },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 78 + 12 },
  warnBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
    backgroundColor: '#fff0f3',
    borderWidth: 1,
    borderColor: '#ffd6dd',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  warnIco: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffe1e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnText: {
    flex: 1,
    fontSize: 13.5,
    color: SOS[700],
    lineHeight: 19,
    fontWeight: '500',
  },
  resourceList: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  resourceCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Line,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    ...Shadow.sm,
  },
  resourceCardPressed: {
    transform: [{ scale: 0.99 }],
  },
  resourceIco: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceBody: { flex: 1 },
  resourceName: { fontWeight: '700', fontSize: 16, color: Ink[900] },
  resourceSub: { fontSize: 13, color: Ink[500], marginTop: 2, lineHeight: 18 },
  resourceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resourceNum: {
    fontWeight: '700',
    fontSize: 16,
    color: Ink[700],
  },
});
