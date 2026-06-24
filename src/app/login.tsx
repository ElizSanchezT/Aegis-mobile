import * as Location from 'expo-location';
import { router } from 'expo-router';
import * as SMS from 'expo-sms';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { AegisLogo } from '@/components/aegis/aegis-logo';
import { useAppContext } from '@/contexts/app-context';
import { userApi } from '@/api/user';
import { Brand, Canvas, Ink, Line } from '@/constants/theme';

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  return d.replace(/(\d{3})(\d{3})(\d{0,3})/, (_m, a, b, c) =>
    [a, b, c].filter(Boolean).join(' ')
  ).trim();
}

export default function LoginScreen() {
  const { setAuthenticated, setFirstName, setUserId } = useAppContext();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const phoneDigits = phone.replace(/\D/g, '');
  const canSubmit = phoneDigits.length === 9 && pin.length === 6 && !loading;

  async function requestAppPermissions() {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      Alert.alert(
        'GPS desactivado',
        'Aegis necesita el GPS para compartir tu ubicación en emergencias. Por favor actívalo en los ajustes.',
        [
          { text: 'Ahora no', style: 'cancel' },
          {
            text: 'Abrir ajustes',
            onPress: () => {
              if (Platform.OS === 'android') {
                Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(() =>
                  Linking.openSettings(),
                );
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
      return;
    }

    await Location.requestForegroundPermissionsAsync();

    const smsAvailable = await SMS.isAvailableAsync();
    if (!smsAvailable) {
      Alert.alert(
        'SMS no disponible',
        'Tu dispositivo no puede enviar SMS. Las alertas notificarán a tus contactos por otras vías.',
      );
    }
  }

  async function handleLogin() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await userApi.login({ phone: `+51${phoneDigits}`, pin });
      if (res.firstName) await setFirstName(res.firstName);
      if (res.id) await setUserId(res.id);
      setAuthenticated(true);
      await requestAppPermissions();
      router.replace('/');
    } catch {
      Alert.alert('Error', 'Teléfono o PIN incorrecto. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safe} edges={['top']}>
        <LinearGradient
          colors={[Brand[600], Brand[700], Brand[800]]}
          locations={[0, 0.68, 1]}
          style={styles.hero}
        >
          <View style={styles.halo} />
          <View style={styles.brand}>
            <View style={styles.logoWrap}>
              <AegisLogo size={76} />
            </View>
            <Text style={styles.brandName}>Aegis</Text>
            <Text style={styles.brandTag}>Tu red de apoyo, siempre contigo</Text>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.sheet}
          contentContainerStyle={styles.sheetContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Text style={styles.stepTitle}>Iniciar sesión</Text>
          <Text style={styles.stepSub}>Ingresa tu teléfono y PIN para continuar.</Text>

          <Text style={styles.fieldLabel}>Número de celular</Text>
          <View style={styles.phoneField}>
            <View style={styles.dial}>
              <Text style={styles.flag}>🇵🇪</Text>
              <Text style={styles.dialCode}>+51</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              keyboardType="number-pad"
              placeholder="987 654 321"
              placeholderTextColor={Ink[300]}
              value={phone}
              onChangeText={(t) => setPhone(formatPhone(t))}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.fieldLabel}>PIN</Text>
          <TextInput
            style={[styles.input, styles.inputSpacing]}
            keyboardType="number-pad"
            placeholder="••••••"
            placeholderTextColor={Ink[300]}
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 6))}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={[styles.cta, !canSubmit && styles.ctaDisabled]}
            onPress={handleLogin}
            disabled={!canSubmit}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.ctaText, !canSubmit && styles.ctaTextDisabled]}>
                Ingresar
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerNote}>¿Primera vez en Aegis?</Text>
            <TouchableOpacity onPress={() => router.push('/register')} hitSlop={8}>
              <Text style={styles.registerLink}> Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Canvas,
  },
  safe: {
    flex: 1,
  },
  hero: {
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 64,
    position: 'relative',
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
    right: -60,
    top: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  brand: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoWrap: {
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.32,
    shadowRadius: 26,
    elevation: 10,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#fff',
  },
  brandTag: {
    fontSize: 14.5,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
  },
  sheet: {
    flex: 1,
    backgroundColor: Canvas,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -36,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 32,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Ink[900],
    marginBottom: 6,
  },
  stepSub: {
    fontSize: 14.5,
    lineHeight: 22,
    color: Ink[500],
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Ink[500],
    marginBottom: 8,
  },
  phoneField: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dial: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 56,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: Line,
    borderRadius: 14,
  },
  flag: {
    fontSize: 18,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '700',
    color: Ink[900],
  },
  phoneInput: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: Line,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: Ink[900],
    backgroundColor: '#fff',
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: Line,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 4,
    color: Ink[900],
    backgroundColor: '#fff',
  },
  inputSpacing: {
    marginBottom: 24,
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
    elevation: 6,
  },
  ctaDisabled: {
    backgroundColor: Ink[200],
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaTextDisabled: {
    color: Ink[400],
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerNote: {
    fontSize: 13.5,
    color: Ink[500],
  },
  registerLink: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Brand[600],
  },
});
