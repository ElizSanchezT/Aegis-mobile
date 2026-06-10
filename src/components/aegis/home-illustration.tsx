import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

export function HomeIllustration() {
  return (
    <Svg width={86} height={86} viewBox="0 0 86 86">
      {/* face */}
      <Circle cx={40} cy={34} r={18} fill="#f1c6a9" />
      {/* hair */}
      <Path d="M22,30 C22,16 36,12 44,14 C58,18 60,30 58,34 C50,30 38,32 30,40 Z" fill="#3a2c52" />
      <Path d="M22,34 C22,44 26,52 32,56 L26,56 C22,52 20,46 22,34 Z" fill="#3a2c52" />
      {/* body */}
      <Path d="M22,72 C22,60 30,54 40,54 C50,54 58,60 58,72 L58,86 L22,86 Z" fill="#a48eff" />
      {/* phone */}
      <Rect x={44} y={46} width={14} height={22} rx={3} fill="#5837bd" />
      <Rect x={46} y={49} width={10} height={14} rx={1} fill="#c5b4ff" />
      {/* arm */}
      <Path d="M48,66 C54,64 58,60 60,54 L56,52 C54,58 50,62 46,64 Z" fill="#f1c6a9" />
      {/* shield badge */}
      <G transform="translate(60 14)">
        <Path d="M0,0 L14,0 L14,14 C14,20 7,24 7,24 C7,24 0,20 0,14 Z" fill="#a48eff" />
        <Path d="M4,12 l3,3 l5,-7" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}
