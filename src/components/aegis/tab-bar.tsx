import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconBook, IconHome, IconSettings, IconUsers } from '@/components/aegis/icons';
import { Brand, Ink, Line } from '@/constants/theme';

type Tab = 'home' | 'contacts' | 'resources' | 'settings';

type TabBarProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number; color?: string; active?: boolean }> }[] = [
  { id: 'home',      label: 'Inicio',    Icon: IconHome },
  { id: 'contacts',  label: 'Contactos', Icon: IconUsers },
  { id: 'resources', label: 'Recursos',  Icon: IconBook },
  { id: 'settings',  label: 'Ajustes',   Icon: IconSettings },
];

export function TabBar({ active, onChange }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {TABS.map(t => {
        const isActive = t.id === active;
        const color = isActive ? Brand[600] : Ink[400];
        return (
          <Pressable
            key={t.id}
            style={styles.tab}
            onPress={() => onChange(t.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            {isActive && <View style={styles.activeIndicator} />}
            <View style={styles.iconWrap}>
              <t.Icon size={24} color={color} active={isActive} />
            </View>
            <Text style={[styles.label, { color }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1,
    borderTopColor: Line,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 8,
    paddingTop: 10,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    borderRadius: 999,
    backgroundColor: Brand[500],
  },
  iconWrap: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
