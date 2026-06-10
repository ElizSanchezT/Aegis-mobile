import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Stop } from 'react-native-svg';

type Props = { size?: number };

export function AegisLogo({ size = 132 }: Props) {
  const h = Math.round(size * (232 / 200));
  return (
    <Svg width={size} height={h} viewBox="0 0 200 232" fill="none">
      <Defs>
        <LinearGradient id="aegis-shield" x1="100" y1="34" x2="100" y2="186" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#ff7ec0" />
          <Stop offset="48%" stopColor="#e83592" />
          <Stop offset="100%" stopColor="#a8186a" />
        </LinearGradient>
        <LinearGradient id="aegis-hand" x1="0" y1="-16" x2="0" y2="20" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#f25aa8" />
          <Stop offset="100%" stopColor="#9c1665" />
        </LinearGradient>
        <LinearGradient id="aegis-figure" x1="100" y1="60" x2="100" y2="150" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#ff8ec9" />
          <Stop offset="100%" stopColor="#e7409a" />
        </LinearGradient>
      </Defs>

      {/* Signal waves */}
      <G stroke="#f25aa8" strokeWidth={4.4} strokeLinecap="round">
        <Path d="M86 24 Q100 13 114 24" opacity={0.95} fill="none" />
        <Path d="M78 19 Q100 1 122 19" opacity={0.6} fill="none" />
        <Path d="M70 14 Q100 -11 130 14" opacity={0.32} fill="none" />
      </G>
      <Circle cx={100} cy={27} r={3.4} fill="#e83592" />

      {/* Left hand */}
      <G transform="translate(70, 176)">
        <Path
          d="M2 18 C-6 18 -12 12 -12 4 C-12 -2 -8 -5 -3 -3 L10 4 C16 7 18 12 14 16 C11 19 6 19 2 18 Z"
          fill="url(#aegis-hand)"
        />
        <Line x1={-9} y1={2} x2={-13} y2={-9} stroke="url(#aegis-hand)" strokeWidth={3.4} strokeLinecap="round" />
        <Line x1={-4} y1={-2} x2={-6} y2={-15} stroke="url(#aegis-hand)" strokeWidth={3.4} strokeLinecap="round" />
        <Line x1={1} y1={-3} x2={1} y2={-16} stroke="url(#aegis-hand)" strokeWidth={3.4} strokeLinecap="round" />
        <Line x1={6} y1={-2} x2={9} y2={-13} stroke="url(#aegis-hand)" strokeWidth={3.4} strokeLinecap="round" />
      </G>

      {/* Right hand (mirrored) */}
      <G transform="translate(130, 176) scale(-1, 1)">
        <Path
          d="M2 18 C-6 18 -12 12 -12 4 C-12 -2 -8 -5 -3 -3 L10 4 C16 7 18 12 14 16 C11 19 6 19 2 18 Z"
          fill="url(#aegis-hand)"
        />
        <Line x1={-9} y1={2} x2={-13} y2={-9} stroke="url(#aegis-hand)" strokeWidth={3.4} strokeLinecap="round" />
        <Line x1={-4} y1={-2} x2={-6} y2={-15} stroke="url(#aegis-hand)" strokeWidth={3.4} strokeLinecap="round" />
        <Line x1={1} y1={-3} x2={1} y2={-16} stroke="url(#aegis-hand)" strokeWidth={3.4} strokeLinecap="round" />
        <Line x1={6} y1={-2} x2={9} y2={-13} stroke="url(#aegis-hand)" strokeWidth={3.4} strokeLinecap="round" />
      </G>

      {/* Shield */}
      <Path
        d="M100 36 L158 53 V100 C158 138 134 164 100 182 C66 164 42 138 42 100 V53 Z"
        fill="url(#aegis-shield)"
      />
      {/* Shield highlight */}
      <Path
        d="M100 36 L158 53 V100 C158 116 153 129 145 140 L100 60 Z"
        fill="#ffffff"
        fillOpacity={0.14}
      />
      {/* Shield inner border */}
      <Path
        d="M100 45 L150 60 V100 C150 133 130 156 100 172 C70 156 50 133 50 100 V60 Z"
        stroke="#ffffff"
        strokeOpacity={0.45}
        strokeWidth={2}
        fill="none"
      />

      {/* Location pin */}
      <Path
        d="M100 66 C82 66 68 80 68 98 C68 121 100 150 100 150 C100 150 132 121 132 98 C132 80 118 66 100 66 Z"
        fill="#ffffff"
      />

      {/* Woman figure — head */}
      <Circle cx={100} cy={92} r={10} fill="url(#aegis-figure)" />
      {/* Body */}
      <Path
        d="M100 104 C88 104 80 112 79 124 C79 127 81 129 84 129 L116 129 C119 129 121 127 121 124 C120 112 112 104 100 104 Z"
        fill="url(#aegis-figure)"
      />
      {/* Skirt (pin tip) */}
      <Path
        d="M100 124 L112 132 L100 150 L88 132 Z"
        fill="url(#aegis-figure)"
        fillOpacity={0.9}
      />
    </Svg>
  );
}
