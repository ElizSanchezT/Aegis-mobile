import { StyleSheet, Text, View } from 'react-native';

import { IconUsersSmall } from '@/components/aegis/icons';

type AvatarProps = {
  name: string;
  color: string;
  kind: 'person' | 'community';
  size?: number;
};

export function Avatar({ name, color, kind, size = 48 }: AvatarProps) {
  const fontSize = size * 0.33;
  const borderRadius = size / 2;

  if (kind === 'community') {
    return (
      <View style={[styles.avatar, { width: size, height: size, borderRadius, backgroundColor: '#ece4ff' }]}>
        <IconUsersSmall size={size * 0.46} color="#4e2db8" />
      </View>
    );
  }

  const initials = name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius, backgroundColor: color }]}>
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.02 * 16,
  },
});
