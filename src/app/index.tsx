import * as Location from "expo-location";
import { Redirect, router } from "expo-router";
import * as SMS from "expo-sms";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { alertApi } from "@/api/alert";
import { contactApi } from "@/api/contact";
import { HomeHeader } from "@/components/aegis/app-header";
import { HoldOverlay } from "@/components/aegis/hold-overlay";
import { HomeIllustration } from "@/components/aegis/home-illustration";
import { IconLocation, IconWarn } from "@/components/aegis/icons";
import { TabBar } from "@/components/aegis/tab-bar";
import { Brand, Canvas, Ink, Shadow, SOS } from "@/constants/theme";
import { useAppContext } from "@/contexts/app-context";

const HOLD_MS = 3000;
const CIRC_R = 110;
const CIRC = 2 * Math.PI * CIRC_R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.View;

// Separate component so useAnimatedProps is NOT in the same scope as the mutations
function SOSProgressRing({
  progressShared,
}: {
  progressShared: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRC * (1 - progressShared.value),
  }));

  return (
    <Svg style={styles.sosProgress} viewBox="0 0 240 240">
      <Circle
        cx={120}
        cy={120}
        r={CIRC_R}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={4}
        fill="none"
      />
      <AnimatedCircle
        cx={120}
        cy={120}
        r={CIRC_R}
        stroke="#fff"
        strokeWidth={4}
        fill="none"
        strokeDasharray={`${CIRC}`}
        strokeLinecap="round"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const { isAuthenticated, hasRegistered, userId, firstName, setAlertStartedAt, setAlertId } = useAppContext();

  const holdProgress = useSharedValue(0);
  const [holdVisible, setHoldVisible] = useState(false);
  const holdStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const firedRef = useRef(false);
  const holdVisibleRef = useRef(false);

  const ring1Scale = useSharedValue(0.78);
  const ring1Opacity = useSharedValue(0.65);
  const ring2Scale = useSharedValue(0.78);
  const ring2Opacity = useSharedValue(0.65);

  useEffect(() => {
    const dur = 2200;
    ring1Scale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: dur * 0.7 }),
        withTiming(1.18, { duration: dur * 0.3 }),
      ),
      -1,
      false,
    );
    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: dur * 0.7 }),
        withTiming(0, { duration: dur * 0.3 }),
      ),
      -1,
      false,
    );
    const t = setTimeout(() => {
      ring2Scale.value = withRepeat(
        withSequence(
          withTiming(1.18, { duration: dur * 0.7 }),
          withTiming(1.18, { duration: dur * 0.3 }),
        ),
        -1,
        false,
      );
      ring2Opacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: dur * 0.7 }),
          withTiming(0, { duration: dur * 0.3 }),
        ),
        -1,
        false,
      );
    }, 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));

  if (hasRegistered === null) return null;

  if (!isAuthenticated) {
    return <Redirect href={hasRegistered ? '/login' : '/welcome'} />;
  }

  function stopHold() {
    holdStartRef.current = null;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    firedRef.current = false;
    holdVisibleRef.current = false;
    cancelAnimation(holdProgress);
    holdProgress.value = withTiming(0, { duration: 250 });
    setHoldVisible(false);
  }

  function handleSOSFired() {
    // eslint-disable-next-line react-hooks/purity
    setAlertStartedAt(Date.now());
    router.push("/active");
    void triggerAlertFlow();
  }

  async function triggerAlertFlow() {
    if (!userId) return;

    // Fetch location and contacts in parallel
    const [locSettled, contactsSettled] = await Promise.allSettled([
      (async () => {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") return null;
        return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      })(),
      contactApi.getByUser(userId),
    ]);

    const loc = locSettled.status === "fulfilled" ? locSettled.value : null;
    const latitude = loc?.coords.latitude ?? 0;
    const longitude = loc?.coords.longitude ?? 0;
    const precision = loc?.coords.accuracy ?? 0;

    // Create alert in background — don't block SMS on it
    alertApi
      .create({
        triggeredById: userId,
        triggeredAt: new Date().toISOString(),
        latitude,
        longitude,
        precision,
      })
      .then((res) => setAlertId(res.id))
      .catch((e) => console.error("Create alert error:", e));

    // Send SMS independently of the alert API result
    if (contactsSettled.status === "fulfilled") {
      const phones = contactsSettled.value
        .filter((c) => c.alertEnabled && c.phone)
        .map((c) => c.phone as string);
      if (phones.length > 0) {
        try {
          if (await SMS.isAvailableAsync()) {
            const name = firstName || "Tu contacto";
            const locPart =
              latitude !== 0 || longitude !== 0
                ? `Ubicación: https://maps.google.com/maps?q=${latitude},${longitude}`
                : "Ubicación no disponible.";
            await SMS.sendSMSAsync(
              phones,
              `🚨 ALERTA SOS: ${name} ha activado una emergencia. ${locPart}`,
            );
          }
        } catch (e) {
          console.error("SMS error:", e);
        }
      }
    }
  }

  function startHold() {
    holdStartRef.current = performance.now();
    firedRef.current = false;

    const loop = () => {
      if (holdStartRef.current == null) return;
      const elapsed = performance.now() - holdStartRef.current;
      const p = Math.min(1, elapsed / HOLD_MS);
      holdProgress.value = p;
      if (p > 0.05 && !holdVisibleRef.current) {
        holdVisibleRef.current = true;
        setHoldVisible(true);
      }
      if (p >= 1 && !firedRef.current) {
        firedRef.current = true;
        stopHold();
        handleSOSFired();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  function handleTabChange(
    tab: "home" | "contacts" | "resources" | "settings",
  ) {
    if (tab === "home") return;
    router.replace(`/${tab}` as "/contacts" | "/resources" | "/settings");
  }

  return (
    <View style={styles.screen}>
      <HomeHeader notifCount={1} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            <Text style={styles.infoStrong}>En una emergencia,</Text> tu ayuda
            está a un toque.{"\n"}Mantén la calma y presiona el botón.
          </Text>
          <View style={styles.illu}>
            <HomeIllustration />
          </View>
        </View>

        <View style={styles.sosStage}>
          <View style={styles.sosWrap}>
            <AnimatedView style={[styles.sosRing, ring1Style]} />
            <AnimatedView
              style={[styles.sosRing, styles.sosRing2, ring2Style]}
            />

            <Pressable
              style={({ pressed }) => [
                styles.sosButton,
                pressed && styles.sosButtonPressed,
              ]}
              accessibilityLabel="Mantén presionado para activar SOS"
              onPressIn={startHold}
              onPressOut={stopHold}
            >
              <SOSProgressRing progressShared={holdProgress} />
              <View style={styles.sosLabel}>
                <View style={styles.sosBigRow}>
                  <IconWarn size={28} color="#fff" strokeWidth={2.4} />
                  <Text style={styles.sosBigText}>SOS</Text>
                </View>
                <Text style={styles.sosSmallText}>
                  Mantén presionado{"\n"}3 segundos
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.locHint}>
          <View style={styles.locPin}>
            <IconLocation size={20} color={Brand[600]} />
          </View>
          <Text style={styles.locText}>
            Tu ubicación se enviará a tus contactos y a la central de apoyo.
          </Text>
        </View>
      </ScrollView>

      <TabBar active="home" onChange={handleTabChange} />

      {holdVisible && (
        <HoldOverlay progressShared={holdProgress} onCancel={stopHold} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Canvas },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 78 + 12 },

  infoCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    paddingBottom: 16,
    flexDirection: "row",
    gap: 8,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: "#ecebf2",
  },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20, color: Ink[700] },
  infoStrong: { fontWeight: "700", color: Ink[900] },
  illu: { alignSelf: "flex-end" },

  sosStage: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  sosWrap: {
    width: 230,
    height: 230,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  sosRing: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 999,
    backgroundColor: SOS[100],
  },
  sosRing2: { backgroundColor: SOS[50] },
  sosButton: {
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: SOS[500],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ef4a64",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.65,
    shadowRadius: 24,
    elevation: 18,
  },
  sosButtonPressed: { transform: [{ scale: 0.96 }] },
  sosProgress: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 200,
    height: 200,
    transform: [{ rotate: "-90deg" }],
  },
  sosLabel: { alignItems: "center" },
  sosBigRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sosBigText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1.5,
    lineHeight: 46,
  },
  sosSmallText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    opacity: 0.94,
    fontWeight: "500",
  },

  locHint: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ecebf2",
    ...Shadow.sm,
  },
  locPin: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Brand[50],
    alignItems: "center",
    justifyContent: "center",
  },
  locText: { flex: 1, fontSize: 13.5, lineHeight: 19, color: Ink[700] },
});
