import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  IconArrowLeft,
  IconBell,
  IconMenu,
  IconShield,
} from "@/components/aegis/icons";
import { Brand, SOS } from "@/constants/theme";

type HomeHeaderProps = {
  notifCount?: number;
};

export function HomeHeader({ notifCount = 1 }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[Brand[600], Brand[700], Brand[800]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      locations={[0, 0.7, 1]}
      style={[styles.header, { paddingTop: insets.top + 14 }]}
    >
      <View style={styles.headerRow}>
        <Pressable style={styles.iconBtn} accessibilityLabel="Menú">
          <IconMenu size={22} color="#fff" />
        </Pressable>
        <View style={styles.brandMark}>
          <IconShield size={22} color="#fff" />
          <Text style={styles.brandText}>Aegis</Text>
        </View>
        <Pressable style={styles.iconBtn} accessibilityLabel="Notificaciones">
          <IconBell size={22} color="#fff" />
          {notifCount > 0 && (
            <View style={styles.notifDot}>
              <Text style={styles.notifNum}>{notifCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.greetTitle}>Hola, Ana</Text>
        <Text style={styles.greetSub}>Estamos aquí para ayudarte</Text>
      </View>
    </LinearGradient>
  );
}

type SubHeaderProps = {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
};

export function SubHeader({ title, onBack, rightIcon }: SubHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[Brand[600], Brand[700], Brand[800]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      locations={[0, 0.7, 1]}
      style={[
        styles.header,
        { paddingTop: insets.top + 14, paddingBottom: 22 },
      ]}
    >
      <View style={styles.subheaderRow}>
        {onBack ? (
          <Pressable
            style={styles.iconBtn}
            onPress={onBack}
            accessibilityLabel="Atrás"
          >
            <IconArrowLeft size={22} color="#fff" />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
        <Text style={styles.subTitle}>{title}</Text>
        <View style={styles.iconBtn}>{rightIcon ?? null}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    height: 36,
  },
  brandMark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: -0.2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: SOS[500],
    borderWidth: 2,
    borderColor: Brand[700],
    alignItems: "center",
    justifyContent: "center",
  },
  notifNum: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 10,
  },
  greeting: {
    marginTop: 14,
  },
  greetTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.82)",
  },
  subheaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  subTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: -0.1,
  },
});
