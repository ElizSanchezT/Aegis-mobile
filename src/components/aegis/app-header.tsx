import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  IconArrowLeft,
  IconBell,
  IconMenu,
  IconShield,
} from "@/components/aegis/icons";
import { useAppContext } from "@/contexts/app-context";
import { Brand, Ink, SOS } from "@/constants/theme";

const DRAWER_WIDTH = 280;

type HomeHeaderProps = {
  notifCount?: number;
};

export function HomeHeader({ notifCount = 1 }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { firstName, logout } = useAppContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  function openMenu() {
    setMenuOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 20,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function closeMenu(callback?: () => void) {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuOpen(false);
      callback?.();
    });
  }

  function handleLogout() {
    closeMenu(() => logout());
  }

  const greetName = firstName.trim() || 'tú';

  return (
    <>
      <LinearGradient
        colors={[Brand[600], Brand[700], Brand[800]]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        locations={[0, 0.7, 1]}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        <View style={styles.headerRow}>
          <Pressable
            style={styles.iconBtn}
            accessibilityLabel="Menú"
            onPress={openMenu}
          >
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
          <Text style={styles.greetTitle}>Hola, {greetName}</Text>
          <Text style={styles.greetSub}>Estamos aquí para ayudarte</Text>
        </View>
      </LinearGradient>

      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        onRequestClose={() => closeMenu()}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          {/* Overlay */}
          <Animated.View
            style={[styles.overlay, { opacity: overlayAnim }]}
            pointerEvents="box-none"
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={() => closeMenu()} />
          </Animated.View>

          {/* Drawer */}
          <Animated.View
            style={[
              styles.drawer,
              { paddingTop: insets.top + 24 },
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {/* Brand */}
            <View style={styles.drawerBrand}>
              <View style={styles.drawerBrandIcon}>
                <IconShield size={24} color="#fff" />
              </View>
              <Text style={styles.drawerBrandName}>Aegis</Text>
            </View>

            {/* User info */}
            <View style={styles.drawerUser}>
              <View style={styles.drawerAvatar}>
                <Text style={styles.drawerAvatarText}>
                  {firstName ? firstName[0].toUpperCase() : '?'}
                </Text>
              </View>
              <Text style={styles.drawerUserName}>
                {firstName || 'Usuario'}
              </Text>
            </View>

            <View style={styles.drawerDivider} />

            {/* Logout */}
            <Pressable
              style={({ pressed }) => [
                styles.drawerLogoutBtn,
                pressed && styles.drawerLogoutPressed,
              ]}
              onPress={handleLogout}
            >
              <Text style={styles.drawerLogoutText}>Cerrar sesión</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </>
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

  /* Modal / Drawer */
  modalRoot: {
    flex: 1,
    flexDirection: "row",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingBottom: 36,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  drawerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  drawerBrandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Brand[600],
    alignItems: "center",
    justifyContent: "center",
  },
  drawerBrandName: {
    fontSize: 20,
    fontWeight: "800",
    color: Brand[700],
    letterSpacing: -0.3,
  },
  drawerUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  drawerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Brand[100],
    alignItems: "center",
    justifyContent: "center",
  },
  drawerAvatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: Brand[600],
  },
  drawerUserName: {
    fontSize: 17,
    fontWeight: "600",
    color: Ink[900],
  },
  drawerDivider: {
    height: 1,
    backgroundColor: Ink[100],
    marginBottom: 20,
  },
  drawerLogoutBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#fff0f3",
  },
  drawerLogoutPressed: {
    backgroundColor: "#ffe0e6",
  },
  drawerLogoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#c0392b",
  },
});
