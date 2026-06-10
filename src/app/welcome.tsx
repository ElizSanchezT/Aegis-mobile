import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { AegisLogo } from '@/components/aegis/aegis-logo';
import { Brand, Ink } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#fdeef6', '#f5f4f9']}
      locations={[0, 0.55]}
      style={styles.root}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.main}>
          <View style={styles.logoStage}>
            <View style={styles.glowB} />
            <View style={styles.glowA} />
            <View style={styles.logoShadow}>
              <AegisLogo size={132} />
            </View>
          </View>

          <Text style={styles.wordmark}>Aegis</Text>

          <View style={styles.copy}>
            <Text style={styles.headline}>Bienvenida a Aegis</Text>
            <Text style={styles.body}>
              Tu escudo de protección y apoyo, siempre a un toque de distancia.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cta}
            onPress={() => router.push('/login')}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaText}>Comenzar</Text>
          </TouchableOpacity>
          <Text style={styles.note}>Gratis y confidencial · Disponible 24/7</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  logoStage: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  glowB: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#ffd9ec',
    opacity: 0.45,
  },
  glowA: {
    position: 'absolute',
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: '#ffc2e0',
    opacity: 0.5,
  },
  logoShadow: {
    shadowColor: '#a8186a',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.34,
    shadowRadius: 32,
    elevation: 10,
  },
  wordmark: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#c41a7c',
  },
  copy: {
    marginTop: 14,
    maxWidth: 320,
    alignItems: 'center',
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Ink[900],
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontSize: 15.5,
    lineHeight: 24,
    color: Ink[500],
    textAlign: 'center',
  },
  actions: {
    paddingTop: 16,
  },
  cta: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: Brand[600],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Brand[700],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 26,
    elevation: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 12.5,
    color: Ink[400],
  },
});
