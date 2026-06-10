import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

type TabIconProps = {
  size?: number;
  color?: string;
  active?: boolean;
};

function Ico({
  size = 22,
  color = 'currentColor',
  strokeWidth = 2,
  fill = 'none',
  children,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  children: React.ReactNode;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

export function IconMenu({ size = 22, color = '#fff' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M3 6h18" />
      <Path d="M3 12h18" />
      <Path d="M3 18h18" />
    </Ico>
  );
}

export function IconBell({ size = 22, color = '#fff' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M6 8a6 6 0 1 1 12 0c0 4.6 1.5 6 1.5 6h-15S6 12.6 6 8Z" />
      <Path d="M10 19a2 2 0 0 0 4 0" />
    </Ico>
  );
}

export function IconShield({ size = 22, color = '#fff', fill = 'none' }: IconProps & { fill?: string }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <Path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

export function IconArrowLeft({ size = 22, color = '#fff' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M15 6l-6 6 6 6" />
    </Ico>
  );
}

export function IconPlus({ size = 20, color = '#432a96' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M12 5v14M5 12h14" />
    </Ico>
  );
}

export function IconHome({ size = 24, color = '#8b85a3', active = false }: TabIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? color : 'none'}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M3.5 11.5 12 4l8.5 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-6v6H4.5a1 1 0 0 1-1-1v-8.5Z" />
    </Svg>
  );
}

export function IconUsers({ size = 24, color = '#8b85a3', active = false }: TabIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? color : 'none'}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={9} cy={9} r={3.2} />
      <Circle cx={17} cy={10.5} r={2.4} />
      <Path d="M3 19c1-3 3-4.5 6-4.5s5 1.5 6 4.5" />
      <Path d="M15 19c.8-2.4 2.3-3.6 4.5-3.6" />
    </Svg>
  );
}

export function IconBook({ size = 24, color = '#8b85a3', active = false }: TabIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? color : 'none'}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H12v17H6.5A1.5 1.5 0 0 1 5 18.5v-14Z" />
      <Path d="M19 4.5A1.5 1.5 0 0 0 17.5 3H12v17h5.5a1.5 1.5 0 0 0 1.5-1.5v-14Z" />
    </Svg>
  );
}

export function IconSettings({ size = 24, color = '#8b85a3', active = false }: TabIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? color : 'none'}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </Svg>
  );
}

export function IconLocation({ size = 20, color = '#5837bd' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <Circle cx={12} cy={10} r={2.6} />
    </Ico>
  );
}

export function IconWarn({ size = 28, color = '#fff', strokeWidth = 2.4 }: IconProps) {
  return (
    <Ico size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="M12 3 2 20h20L12 3Z" />
      <Path d="M12 10v5" />
      <Circle cx={12} cy={17.5} r={0.8} fill={color} stroke="none" />
    </Ico>
  );
}

export function IconMic({ size = 20, color = '#5837bd' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Rect x={9} y={3} width={6} height={12} rx={3} />
      <Path d="M5 11a7 7 0 0 0 14 0" />
      <Path d="M12 18v3" />
    </Ico>
  );
}

export function IconCamera({ size = 20, color = '#5837bd' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M3 8h3l2-2h8l2 2h3v11H3V8Z" />
      <Circle cx={12} cy={13} r={3.5} />
    </Ico>
  );
}

export function IconNote({ size = 20, color = '#5837bd' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Rect x={5} y={3} width={14} height={18} rx={3} />
      <Path d="M9 8h6M9 12h6M9 16h4" />
    </Ico>
  );
}

export function IconClose({ size = 18, color = '#432a96' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M6 6l12 12M18 6 6 18" />
    </Ico>
  );
}

export function IconPhone({ size = 22, color = '#fff' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.7 19.7 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2.2Z" />
    </Ico>
  );
}

export function IconChat({ size = 22, color = '#fff' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M21 12a8 8 0 0 1-12 6.9L4 21l1.5-4.5A8 8 0 1 1 21 12Z" />
    </Ico>
  );
}

export function IconFire({ size = 22, color = '#fff' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-2 1-2 4a5 5 0 0 0 10 0c0-6-5-9-5-9Z" />
    </Ico>
  );
}

export function IconCenterLoc({ size = 18, color = '#5837bd' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Circle cx={12} cy={12} r={3} />
      <Path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </Ico>
  );
}

export function IconShare({ size = 18, color = '#5837bd' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <Path d="M16 6l-4-4-4 4" />
      <Path d="M12 2v14" />
    </Ico>
  );
}

export function IconCheck({ size = 42, color = '#fff', strokeWidth = 3 }: IconProps) {
  return (
    <Ico size={size} color={color} strokeWidth={strokeWidth}>
      <Path d="m5 13 4 4L19 7" />
    </Ico>
  );
}

export function IconClock({ size = 18, color = '#5837bd' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7v5l3 2" />
    </Ico>
  );
}

export function IconChevR({ size = 18, color = '#b5b0c8' }: IconProps) {
  return (
    <Ico size={size} color={color}>
      <Path d="m9 6 6 6-6 6" />
    </Ico>
  );
}

export function IconUsersSmall({ size = 22, color = '#4e2db8' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={9} cy={9} r={3.2} />
      <Circle cx={17} cy={10.5} r={2.4} />
      <Path d="M3 19c1-3 3-4.5 6-4.5s5 1.5 6 4.5" />
      <Path d="M15 19c.8-2.4 2.3-3.6 4.5-3.6" />
    </Svg>
  );
}

export function IconNotifDot({ count }: { count: number }) {
  return (
    <G>
      <Circle cx={12} cy={12} r={9} fill="#ef4a64" />
    </G>
  );
}
