import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Avatar } from '@/components/aegis/avatar';
import { IconCheck, IconClock, IconLocation } from '@/components/aegis/icons';
import { useAppContext } from '@/contexts/app-context';
import { Brand, Canvas, Ink, Line, Shadow } from '@/constants/theme';

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  if (m === 0) return `${ss} segundos`;
  return `${m} min ${ss}s`;
}

export default function ResolvedScreen() {
  const { contacts, resolvedDuration } = useAppContext();
  const active = contacts.filter(c => c.on);
  const duration = resolvedDuration ?? 0;

  const checkScale = useSharedValue(0.5);
  const checkOpacity = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withTiming(1, { duration: 420 });
    checkOpacity.value = withTiming(1, { duration: 420 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  return (
    <View style={styles.screen}>
      {/* Hero */}
      <View style={styles.hero}>
        <Animated.View style={[styles.checkCircle, checkStyle]}>
          <IconCheck size={42} color="#fff" strokeWidth={3} />
        </Animated.View>
        <Text style={styles.heroTitle}>Estás a salvo</Text>
        <Text style={styles.heroSub}>
          Tus contactos fueron notificados de que la alerta fue cancelada.
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Summary */}
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryHeader}>Resumen de la alerta</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIco}>
              <IconClock size={18} color={Brand[600]} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryKey}>Duración</Text>
              <Text style={styles.summaryVal}>{fmtDuration(duration)}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIco}>
              <IconLocation size={18} color={Brand[600]} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryKey}>Última ubicación</Text>
              <Text style={styles.summaryVal}>Av. Salaverry 1234</Text>
            </View>
            <Text style={styles.summaryMeta}>Lima</Text>
          </View>
        </View>

        {/* Notified contacts */}
        <Text style={styles.notifiedHeader}>Notificados ({active.length})</Text>
        <View style={styles.pills}>
          {active.map(c => (
            <View key={c.id} style={styles.pill}>
              <Avatar name={c.name} color={c.color} kind={c.kind} size={24} />
              <Text style={styles.pillName}>{c.name.split(' ')[0]}</Text>
              <Text style={styles.pillAck}>✓</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => router.navigate('/')}>
            <Text style={styles.btnTextWhite}>Volver al inicio</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => router.replace('/resources')}>
            <Text style={styles.btnTextDark}>Ver recursos de apoyo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Canvas },
  hero: {
    backgroundColor: '#137a3f',
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 14.5,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },

  // Summary
  summaryBlock: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 14,
    gap: 10,
  },
  summaryHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Ink[700],
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    marginBottom: 4,
  },
  summaryRow: {
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
  summaryIco: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: { flex: 1 },
  summaryKey: { fontSize: 12.5, color: Ink[500] },
  summaryVal: { fontWeight: '600', fontSize: 14.5, color: Ink[900] },
  summaryMeta: { fontSize: 12.5, color: Ink[500] },

  // Notified pills
  notifiedHeader: {
    marginHorizontal: 20,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '700',
    color: Ink[700],
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  pill: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Line,
    borderRadius: 999,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillName: { fontSize: 13, fontWeight: '600', color: Ink[900] },
  pillAck: { fontSize: 11, fontWeight: '600', color: '#137a3f' },

  // Action buttons
  actions: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  btn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: Brand[600] },
  btnGhost: { backgroundColor: '#ecebf2' },
  btnTextWhite: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnTextDark: { color: Ink[900], fontWeight: '700', fontSize: 15 },
});
