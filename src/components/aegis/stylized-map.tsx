import { useEffect } from 'react';
import Animated, { useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function StylizedMap() {
  const r = useSharedValue(7);

  useEffect(() => {
    r.value = withRepeat(withTiming(8.5, { duration: 1000 }), -1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animProps = useAnimatedProps(() => ({ r: r.value }));

  return (
    <Svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <Defs>
        <LinearGradient id="land" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0%" stopColor="#eef0f3" />
          <Stop offset="100%" stopColor="#e3e6ec" />
        </LinearGradient>
        <RadialGradient id="risk" cx="50%" cy="50%" r="50%">
          <Stop offset="0%"   stopColor="#ef4a64" stopOpacity={0.35} />
          <Stop offset="60%"  stopColor="#ef4a64" stopOpacity={0.18} />
          <Stop offset="100%" stopColor="#ef4a64" stopOpacity={0} />
        </RadialGradient>
        <Pattern id="grid-blocks" x={0} y={0} width={40} height={40} patternUnits="userSpaceOnUse">
          <Rect width={40} height={40} fill="transparent" />
          <Rect x={2} y={2} width={36} height={36} rx={2} fill="#dde1e7" fillOpacity={0.55} />
        </Pattern>
      </Defs>

      <Rect width={400} height={220} fill="url(#land)" />
      <Rect width={400} height={220} fill="url(#grid-blocks)" />

      <Path d="M310,10 Q360,10 380,30 L380,80 Q360,90 320,86 Q300,80 305,50 Z" fill="#c9e7c5" />
      <Path d="M30,150 Q70,140 80,180 L60,210 Q20,210 18,180 Z" fill="#cfe9ca" />

      <Path
        d="M-10,60 C 80,40 140,120 230,90 C 320,60 380,130 410,110"
        stroke="#cfe2ee"
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
      />

      <G stroke="#ffffff" strokeWidth={6} opacity={0.9}>
        <Line x1={0}   y1={60}  x2={400} y2={60}  />
        <Line x1={0}   y1={120} x2={400} y2={120} />
        <Line x1={0}   y1={180} x2={400} y2={180} />
        <Line x1={80}  y1={0}   x2={80}  y2={220} />
        <Line x1={200} y1={0}   x2={200} y2={220} />
        <Line x1={300} y1={0}   x2={300} y2={220} />
      </G>

      <Line x1={-20} y1={220} x2={420} y2={-10} stroke="#ffffff" strokeWidth={8} opacity={0.75} />

      <Circle cx={205} cy={118} r={70} fill="url(#risk)" />
      <Circle cx={205} cy={118} r={68} stroke="#ef4a64" strokeOpacity={0.35}
              strokeDasharray="3 5" strokeWidth={1.2} fill="none" />

      <Circle cx={205} cy={118} r={11} fill="#fff" />
      <AnimatedCircle cx={205} cy={118} fill="#2f6bff" animatedProps={animProps} />

      <G transform="translate(232 92)">
        <Path d="M0,-14 C8,-14 12,-8 12,-2 C12,8 0,18 0,18 C0,18 -12,8 -12,-2 C-12,-8 -8,-14 0,-14 Z"
              fill="#ef4a64" />
        <Circle cx={0} cy={-2} r={4} fill="#fff" />
      </G>
    </Svg>
  );
}
