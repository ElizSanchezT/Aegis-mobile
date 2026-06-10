import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
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
import { IconArrowLeft } from '@/components/aegis/icons';
import { useAppContext } from '@/contexts/app-context';
import { Brand, Canvas, Ink, Line } from '@/constants/theme';

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  return d.replace(/(\d{3})(\d{3})(\d{0,3})/, (_m, a, b, c) =>
    [a, b, c].filter(Boolean).join(' ')
  ).trim();
}

export default function LoginScreen() {
  const { setAuthenticated } = useAppContext();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [resendIn, setResendIn] = useState(0);
  const inputsRef = useRef<(TextInput | null)[]>([null, null, null, null]);

  const phoneDigits = phone.replace(/\D/g, '');
  const phoneValid = phoneDigits.length === 9;
  const codeComplete = code.every((d) => d !== '');

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  function goToCode() {
    if (!phoneValid) return;
    setStep('code');
    setResendIn(30);
    setTimeout(() => inputsRef.current[0]?.focus(), 350);
  }

  function handleVerify() {
    if (!codeComplete) return;
    setAuthenticated(true);
    router.replace('/');
  }

  function onCodeChange(i: number, text: string) {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 3) {
      inputsRef.current[i + 1]?.focus();
    }
  }

  function onCodeKeyPress(i: number, key: string) {
    if (key === 'Backspace') {
      if (!code[i] && i > 0) {
        const next = [...code];
        next[i - 1] = '';
        setCode(next);
        inputsRef.current[i - 1]?.focus();
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Hero header */}
        <LinearGradient
          colors={[Brand[600], Brand[700], Brand[800]]}
          locations={[0, 0.68, 1]}
          style={styles.hero}
        >
          {/* Decorative halo */}
          <View style={styles.halo} />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <IconArrowLeft size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.brand}>
            <View style={styles.logoWrap}>
              <AegisLogo size={76} />
            </View>
            <Text style={styles.brandName}>Aegis</Text>
            <Text style={styles.brandTag}>Tu red de apoyo, siempre contigo</Text>
          </View>
        </LinearGradient>

        {/* Sheet */}
        <ScrollView
          style={styles.sheet}
          contentContainerStyle={styles.sheetContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {step === 'phone' ? (
            <View style={styles.step}>
              <Text style={styles.stepTitle}>Ingresa con tu celular</Text>
              <Text style={styles.stepSub}>
                Te enviaremos un código de verificación por SMS.
              </Text>

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
                  onSubmitEditing={goToCode}
                  autoFocus
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity
                style={[styles.cta, !phoneValid && styles.ctaDisabled]}
                onPress={goToCode}
                disabled={!phoneValid}
                activeOpacity={0.88}
              >
                <Text style={[styles.ctaText, !phoneValid && styles.ctaTextDisabled]}>
                  Continuar
                </Text>
              </TouchableOpacity>

              <Text style={styles.legal}>
                Al continuar aceptas los{' '}
                <Text style={styles.legalLink}>Términos</Text>
                {' '}y la{' '}
                <Text style={styles.legalLink}>Política de privacidad</Text>.
              </Text>
            </View>
          ) : (
            <View style={styles.step}>
              <TouchableOpacity
                style={styles.linkBack}
                onPress={() => setStep('phone')}
                hitSlop={8}
              >
                <IconArrowLeft size={18} color={Brand[600]} />
                <Text style={styles.linkBackText}>Cambiar número</Text>
              </TouchableOpacity>

              <Text style={styles.stepTitle}>Verifica tu número</Text>
              <Text style={styles.stepSub}>
                {'Ingresa el código de 4 dígitos enviado al\n'}
                <Text style={styles.stepSubBold}>+51 {phone}</Text>
              </Text>

              <View style={styles.otpRow}>
                {code.map((d, i) => (
                  <TextInput
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el; }}
                    style={[styles.otpBox, d ? styles.otpBoxFilled : null]}
                    keyboardType="number-pad"
                    value={d}
                    onChangeText={(text) => onCodeChange(i, text)}
                    onKeyPress={({ nativeEvent }) => onCodeKeyPress(i, nativeEvent.key)}
                    textAlign="center"
                    caretHidden
                    selectTextOnFocus
                    returnKeyType="done"
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.cta, !codeComplete && styles.ctaDisabled]}
                onPress={handleVerify}
                disabled={!codeComplete}
                activeOpacity={0.88}
              >
                <Text style={[styles.ctaText, !codeComplete && styles.ctaTextDisabled]}>
                  Verificar
                </Text>
              </TouchableOpacity>

              <View style={styles.resend}>
                {resendIn > 0 ? (
                  <Text style={styles.resendMuted}>Reenviar código en {resendIn}s</Text>
                ) : (
                  <TouchableOpacity onPress={() => setResendIn(30)} hitSlop={8}>
                    <Text style={styles.resendLink}>Reenviar código</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
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
  step: {
    gap: 0,
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
  stepSubBold: {
    color: Ink[900],
    fontWeight: '700',
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
    marginBottom: 24,
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
  legal: {
    marginTop: 16,
    fontSize: 12.5,
    textAlign: 'center',
    color: Ink[400],
    lineHeight: 19,
  },
  legalLink: {
    color: Brand[600],
    fontWeight: '600',
  },
  linkBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  linkBackText: {
    color: Brand[600],
    fontWeight: '600',
    fontSize: 13.5,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  otpBox: {
    flex: 1,
    height: 64,
    borderWidth: 1.5,
    borderColor: Line,
    borderRadius: 14,
    backgroundColor: '#fff',
    fontSize: 26,
    fontWeight: '700',
    color: Ink[900],
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: Brand[400],
    backgroundColor: Brand[50],
  },
  resend: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendMuted: {
    fontSize: 13.5,
    color: Ink[500],
  },
  resendLink: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Brand[600],
  },
});
