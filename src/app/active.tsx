import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { SubHeader } from '@/components/aegis/app-header';
import { LiveMap } from '@/components/aegis/live-map';
import { IconCamera, IconCenterLoc, IconClose, IconMic, IconNote, IconShare, IconShield } from '@/components/aegis/icons';
import { alertApi } from '@/api/alert';
import { useAppContext } from '@/contexts/app-context';
import { Brand, Canvas, Ink, Line, Shadow, SOS } from '@/constants/theme';

function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export default function ActiveAlertScreen() {
  const { alertStartedAt, alertId, setResolvedDuration } = useAppContext();
  const startedAt = alertStartedAt ?? 0;

  const [elapsed, setElapsed] = useState(0);
  const [recording, setRecording] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [note, setNote] = useState(false);
  const [askCancel, setAskCancel] = useState(false);

  useEffect(() => {
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const dotScale = useSharedValue(0);
  useEffect(() => {
    dotScale.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 700 }),
        withTiming(0, { duration: 700 }),
      ),
      -1,
      false,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dotStyle = useAnimatedStyle(() => ({
    boxShadow: `0 0 0 ${dotScale.value}px rgba(239,74,100,0)`,
  }));

  const handleCancel = async () => {
    if (alertId != null) {
      try {
        await alertApi.end(alertId, { endedAt: new Date().toISOString() });
      } catch (e) {
        console.error('End alert error:', e);
      }
    }
    setResolvedDuration(elapsed);
    router.replace('/resolved');
  };

  return (
    <View style={styles.screen}>
      <SubHeader
        title="Alerta activa"
        onBack={() => router.replace('/')}
        rightIcon={<IconShield size={22} color="#fff" />}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Alert banner */}
        <View style={styles.alertBanner}>
          <View style={styles.bannerRow1}>
            <Animated.View style={[styles.dot, dotStyle]} />
            <Text style={styles.bannerTitle}>Alerta SOS enviada</Text>
          </View>
          <Text style={styles.bannerSub}>Tus contactos están siendo notificados</Text>
          <Text style={styles.timer}>{fmt(elapsed)}</Text>
        </View>

        {/* Map section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Ubicación en tiempo real</Text>
          <View style={styles.mapCard}>
            <LiveMap />
            <View style={styles.mapCtrls}>
              <Pressable style={styles.ctrlBtn} accessibilityLabel="Centrar">
                <IconCenterLoc size={18} color={Brand[600]} />
              </Pressable>
              <Pressable style={styles.ctrlBtn} accessibilityLabel="Compartir">
                <IconShare size={18} color={Brand[600]} />
              </Pressable>
            </View>
          </View>

          <View style={styles.riskRow}>
            <View>
              <Text style={styles.riskLabel}>Nivel de riesgo estimado</Text>
              <Text style={styles.riskSub}>Estamos priorizando tu alerta.</Text>
            </View>
            <View style={styles.pillHigh}>
              <Text style={styles.pillHighText}>ALTO</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>¿Necesitas agregar información?</Text>
          <View style={styles.actionsGrid}>
            <Pressable
              style={[styles.actBtn, recording && styles.actBtnActive]}
              onPress={() => setRecording(v => !v)}
            >
              <View style={[styles.icoBubble, recording && styles.icoBubbleRecording]}>
                <IconMic size={20} color={recording ? '#fff' : Brand[600]} />
              </View>
              <Text style={styles.actLabel}>{recording ? 'Grabando…' : 'Grabar audio'}</Text>
            </Pressable>

            <Pressable
              style={[styles.actBtn, photo && styles.actBtnActive]}
              onPress={() => setPhoto(v => !v)}
            >
              <View style={[styles.icoBubble, photo && styles.icoBubbleSOS]}>
                <IconCamera size={20} color={photo ? SOS[600] : Brand[600]} />
              </View>
              <Text style={styles.actLabel}>{photo ? 'Foto enviada' : 'Tomar foto'}</Text>
            </Pressable>

            <Pressable
              style={[styles.actBtn, note && styles.actBtnActive]}
              onPress={() => setNote(v => !v)}
            >
              <View style={[styles.icoBubble, note && styles.icoBubbleSOS]}>
                <IconNote size={20} color={note ? SOS[600] : Brand[600]} />
              </View>
              <Text style={styles.actLabel}>{note ? 'Nota guardada' : 'Nota rápida'}</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.cancelAlertBtn} onPress={() => setAskCancel(true)}>
          <IconClose size={18} color={Brand[700]} />
          <Text style={styles.cancelAlertText}>Cancelar alerta</Text>
        </Pressable>
      </ScrollView>

      {askCancel && (
        <Pressable style={styles.sheetBackdrop} onPress={() => setAskCancel(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>¿Cancelar la alerta?</Text>
            <Text style={styles.sheetBody}>
              Tus contactos recibirán una notificación de que estás a salvo. Solo cancela si realmente estás fuera de peligro.
            </Text>
            <View style={styles.btnRow}>
              <Pressable style={[styles.btn, styles.btnDanger]} onPress={handleCancel}>
                <Text style={styles.btnTextWhite}>Sí, estoy a salvo</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setAskCancel(false)}>
                <Text style={styles.btnTextDark}>Mantener alerta activa</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Canvas },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },

  // Alert banner
  alertBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: '#fff0f3',
    borderWidth: 1,
    borderColor: '#ffd6dd',
    borderRadius: 16,
    padding: 14,
  },
  bannerRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SOS[500],
  },
  bannerTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: Ink[900],
  },
  bannerSub: {
    fontSize: 13.5,
    color: Ink[500],
    marginTop: 4,
    marginLeft: 20,
  },
  timer: {
    marginLeft: 20,
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: 0.5,
    color: Ink[900],
    marginTop: 6,
    fontVariant: ['tabular-nums'],
  },

  // Sections
  sectionBlock: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Ink[900],
    marginTop: 18,
    marginBottom: 10,
  },

  // Map
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    backgroundColor: '#eef0f3',
    borderWidth: 1,
    borderColor: Line,
    position: 'relative',
  },
  mapCtrls: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    gap: 8,
  },
  ctrlBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Line,
    ...Shadow.sm,
  },

  // Risk row
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 4,
  },
  riskLabel: { fontWeight: '700', fontSize: 15, color: Ink[900] },
  riskSub: { fontSize: 13, color: Ink[500], marginTop: 2 },
  pillHigh: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#ffe1e6',
  },
  pillHighText: {
    color: '#b51e3a',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  // Action buttons
  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Line,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    paddingBottom: 12,
    alignItems: 'center',
    gap: 8,
  },
  actBtnActive: { borderColor: '#d8d3e8' },
  icoBubble: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoBubbleRecording: { backgroundColor: SOS[500] },
  icoBubbleSOS: { backgroundColor: SOS[100] },
  actLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Ink[900],
    textAlign: 'center',
    lineHeight: 16,
  },

  // Cancel alert button
  cancelAlertBtn: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 18,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: Brand[200],
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelAlertText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand[700],
  },

  // Bottom sheet
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,7,50,0.55)',
    zIndex: 30,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingBottom: 36,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Ink[900],
    marginBottom: 8,
    marginTop: 6,
  },
  sheetBody: {
    fontSize: 14,
    color: Ink[500],
    lineHeight: 20,
    marginBottom: 18,
  },
  btnRow: { gap: 8 },
  btn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDanger: { backgroundColor: SOS[500] },
  btnGhost: { backgroundColor: '#ecebf2' },
  btnTextWhite: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnTextDark: { color: Ink[900], fontWeight: '700', fontSize: 15 },
});
