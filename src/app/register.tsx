import * as Location from 'expo-location';
import { router } from 'expo-router';
import * as SMS from 'expo-sms';
import { useRef, useState } from 'react';
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

export default function RegisterScreen() {
  const { setAuthenticated, markRegistered, setFirstName, setUserId } = useAppContext();

  const [firstName, setFirstNameField] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const lastNameRef = useRef<TextInput>(null);
  const dniRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const pinRef = useRef<TextInput>(null);
  const confirmPinRef = useRef<TextInput>(null);

  const phoneDigits = phone.replace(/\D/g, '');

  const isValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    dni.length === 8 &&
    phoneDigits.length === 9 &&
    pin.length === 6 &&
    confirmPin.length === 6 &&
    pin === confirmPin;

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

  async function handleRegister() {
    if (!isValid || loading) return;

    if (pin !== confirmPin) {
      Alert.alert('Error', 'Los PINs no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await userApi.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: `+51${phoneDigits}`,
        dni,
        pin,
      });
      await setFirstName(firstName.trim());
      if (res.id) await setUserId(res.id);
      await markRegistered();
      setAuthenticated(true);
      await requestAppPermissions();
      router.replace('/');
    } catch {
      Alert.alert('Error', 'No se pudo registrar. Verifica los datos e intenta nuevamente.');
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
              <AegisLogo size={64} />
            </View>
            <Text style={styles.brandName}>Aegis</Text>
            <Text style={styles.brandTag}>Crea tu cuenta para comenzar</Text>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.sheet}
          contentContainerStyle={styles.sheetContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.stepTitle}>Crear cuenta</Text>
          <Text style={styles.stepSub}>Todos los campos son obligatorios.</Text>

          {/* Nombres */}
          <Text style={styles.fieldLabel}>Nombres</Text>
          <TextInput
            style={[styles.input, styles.inputSpacing]}
            placeholder="Ingresa tus nombres"
            placeholderTextColor={Ink[300]}
            value={firstName}
            onChangeText={setFirstNameField}
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
            autoCapitalize="words"
          />

          {/* Apellidos */}
          <Text style={styles.fieldLabel}>Apellidos</Text>
          <TextInput
            ref={lastNameRef}
            style={[styles.input, styles.inputSpacing]}
            placeholder="Ingresa tus apellidos"
            placeholderTextColor={Ink[300]}
            value={lastName}
            onChangeText={setLastName}
            returnKeyType="next"
            onSubmitEditing={() => dniRef.current?.focus()}
            autoCapitalize="words"
          />

          {/* DNI */}
          <Text style={styles.fieldLabel}>DNI</Text>
          <TextInput
            ref={dniRef}
            style={[styles.input, styles.inputSpacing]}
            placeholder="12345678"
            placeholderTextColor={Ink[300]}
            keyboardType="number-pad"
            maxLength={8}
            value={dni}
            onChangeText={(t) => setDni(t.replace(/\D/g, '').slice(0, 8))}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />
          {dni.length > 0 && dni.length < 8 && (
            <Text style={styles.hint}>El DNI debe tener 8 dígitos.</Text>
          )}

          {/* Teléfono */}
          <Text style={styles.fieldLabel}>Número de celular</Text>
          <View style={styles.phoneField}>
            <View style={styles.dial}>
              <Text style={styles.flag}>🇵🇪</Text>
              <Text style={styles.dialCode}>+51</Text>
            </View>
            <TextInput
              ref={phoneRef}
              style={styles.phoneInput}
              keyboardType="number-pad"
              placeholder="987 654 321"
              placeholderTextColor={Ink[300]}
              value={phone}
              onChangeText={(t) => setPhone(formatPhone(t))}
              returnKeyType="next"
              onSubmitEditing={() => pinRef.current?.focus()}
            />
          </View>
          {phoneDigits.length > 0 && phoneDigits.length < 9 && (
            <Text style={[styles.hint, styles.hintPhone]}>El teléfono debe tener 9 dígitos.</Text>
          )}

          {/* PIN */}
          <Text style={styles.fieldLabel}>PIN (6 dígitos)</Text>
          <TextInput
            ref={pinRef}
            style={[styles.input, styles.inputPin, styles.inputSpacing]}
            keyboardType="number-pad"
            placeholder="••••••"
            placeholderTextColor={Ink[300]}
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 6))}
            returnKeyType="next"
            onSubmitEditing={() => confirmPinRef.current?.focus()}
          />

          {/* Confirmar PIN */}
          <Text style={styles.fieldLabel}>Confirmar PIN</Text>
          <TextInput
            ref={confirmPinRef}
            style={[
              styles.input,
              styles.inputPin,
              styles.inputSpacing,
              confirmPin.length === 6 && pin !== confirmPin && styles.inputError,
            ]}
            keyboardType="number-pad"
            placeholder="••••••"
            placeholderTextColor={Ink[300]}
            secureTextEntry
            maxLength={6}
            value={confirmPin}
            onChangeText={(t) => setConfirmPin(t.replace(/\D/g, '').slice(0, 6))}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />
          {confirmPin.length === 6 && pin !== confirmPin && (
            <Text style={styles.errorText}>Los PINs no coinciden.</Text>
          )}

          <TouchableOpacity
            style={[styles.cta, (!isValid || loading) && styles.ctaDisabled]}
            onPress={handleRegister}
            disabled={!isValid || loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.ctaText, !isValid && styles.ctaTextDisabled]}>
                Crear cuenta
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginNote}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => router.push('/login')} hitSlop={8}>
              <Text style={styles.loginLink}> Inicia sesión</Text>
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
    paddingBottom: 56,
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
    marginTop: 28,
  },
  logoWrap: {
    marginBottom: 10,
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
    fontSize: 14,
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
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: Line,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Ink[900],
    backgroundColor: '#fff',
  },
  inputPin: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 4,
  },
  inputSpacing: {
    marginBottom: 20,
  },
  inputError: {
    borderColor: '#ef4a64',
  },
  phoneField: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
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
  hint: {
    fontSize: 12,
    color: Ink[400],
    marginTop: -14,
    marginBottom: 16,
  },
  hintPhone: {
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4a64',
    marginTop: -14,
    marginBottom: 16,
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
    marginTop: 4,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginNote: {
    fontSize: 13.5,
    color: Ink[500],
  },
  loginLink: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Brand[600],
  },
});
