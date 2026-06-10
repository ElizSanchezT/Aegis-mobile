import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { runOnJS, SharedValue, useAnimatedProps, useAnimatedReaction } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useState } from 'react';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const C = 122;
const CIRC = 2 * Math.PI * C;

type HoldOverlayProps = {
  progressShared: SharedValue<number>;
  onCancel: () => void;
};

export function HoldOverlay({ progressShared, onCancel }: HoldOverlayProps) {
  const [count, setCount] = useState(3);

  useAnimatedReaction(
    () => Math.max(1, 3 - Math.floor(progressShared.value * 3 + 0.0001)),
    (next, prev) => {
      if (next !== prev) runOnJS(setCount)(next);
    }
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRC * (1 - progressShared.value),
  }));

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.holdStage}>
          <View style={styles.ringWrap}>
            <View style={styles.holdCenter}>
              <Text style={styles.num}>{count}</Text>
              <Text style={styles.lbl}>Sigue presionando</Text>
            </View>
            <Svg style={[StyleSheet.absoluteFill, styles.rotated]} viewBox="0 0 260 260">
              <Circle cx={130} cy={130} r={C} stroke="rgba(255,255,255,0.18)" strokeWidth={6} fill="none" />
              <AnimatedCircle
                cx={130}
                cy={130}
                r={C}
                stroke="#fff"
                strokeWidth={6}
                fill="none"
                strokeDasharray={`${CIRC}`}
                strokeLinecap="round"
                animatedProps={animatedProps}
              />
            </Svg>
          </View>

          <Text style={styles.title}>Enviando alerta…</Text>
          <Text style={styles.sub}>Suelta el botón para cancelar.</Text>
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelTxt}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,7,50,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  holdStage: {
    alignItems: 'center',
  },
  ringWrap: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotated: {
    transform: [{ rotate: '-90deg' }],
  },
  holdCenter: {
    position: 'absolute',
    width: 244,
    height: 244,
    borderRadius: 122,
    backgroundColor: '#ef4a64',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4a64',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.55,
    shadowRadius: 30,
  },
  num: {
    fontSize: 64,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 68,
  },
  lbl: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  sub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 22,
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 999,
  },
  cancelTxt: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
