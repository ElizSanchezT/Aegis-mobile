# Aegis Mobile

Aplicación móvil multiplataforma (iOS, Android, Web) construida con Expo SDK 56 y React Native.

## Stack

| Tecnología      | Versión                        |
| --------------- | ------------------------------ |
| Expo SDK        | 56                             |
| Expo Router     | 56 (rutas tipadas, file-based) |
| React           | 19 con React Compiler          |
| React Native    | 0.85                           |
| TypeScript      | 6 (strict mode)                |
| Package manager | pnpm 11                        |

**Librerías principales:**

- `react-native-reanimated` v4 — animaciones
- `react-native-gesture-handler` — gestures
- `react-native-safe-area-context` — áreas seguras
- `expo-image` — imágenes optimizadas
- `@expo/ui` — primitivas de UI nativas
- `expo-glass-effect` — efectos de cristal

## Requisitos previos

- Node.js ≥ 18
- pnpm 11 (`npm install -g pnpm@11`)
- Para iOS: macOS con Xcode instalado
- Para Android: Android Studio con un emulador configurado

## Instalación

```bash
pnpm install
```

## Comandos

| Tarea                  | Comando              |
| ---------------------- | -------------------- |
| Servidor de desarrollo | `pnpm start`         |
| Simulador iOS          | `pnpm ios`           |
| Emulador Android       | `pnpm android`       |
| Web                    | `pnpm web`           |
| Lint                   | `pnpm lint`          |
| Reset del proyecto     | `pnpm reset-project` |

## Estructura del proyecto

```
src/
  app/            # Pantallas y layouts (Expo Router)
  components/     # Componentes UI reutilizables
  constants/      # Tokens de tema (colores, espaciado, fuentes)
  hooks/          # Custom hooks
assets/
  images/         # Iconos, splash, favicon
  expo.icon/      # Icono iOS
```

## Routing

Este proyecto usa [Expo Router](https://docs.expo.dev/router/introduction/) con rutas basadas en archivos:

- Las pantallas viven bajo `src/app/`. El nombre del archivo define la ruta.
- Los layouts se definen en `_layout.tsx`.
- La navegación por tabs está en `src/components/app-tabs.tsx`.
- Las rutas son **tipadas** — importar `Href` desde `expo-router` para navegar.

## Convenciones

- **Estilos:** siempre `StyleSheet.create`, nunca objetos inline. Usar tokens de `@/constants/theme`.
- **Componentes:** un componente por archivo. Exports nombrados para componentes compartidos, default para pantallas.
- **TypeScript:** sin `any`. Usar `unknown` con type narrowing.
- **Memoización:** React Compiler la gestiona automáticamente — no agregar `memo`, `useCallback` ni `useMemo` manualmente.
- **Imágenes:** usar `expo-image`, no el `Image` de React Native.
- **SafeAreaView:** de `react-native-safe-area-context`, no de `react-native`.
- **Diferencias de plataforma:** preferir archivos `.ios.tsx` / `.android.tsx` / `.web.tsx` sobre ramas `Platform.OS` cuando las implementaciones difieran significativamente.

## Lint

Ejecutar antes de cada commit:

```bash
pnpm lint
```

El proyecto sigue las reglas de `eslint-config-expo`: sin variables/imports sin usar, hooks solo en el nivel superior de componentes, `react-hooks/exhaustive-deps` activo.

## Tema

El tema soporta modo claro y oscuro de forma automática (`userInterfaceStyle: "automatic"`). Los tokens están en `src/constants/theme.ts`:

- `Colors` — paleta light/dark
- `Fonts` — familias tipográficas por plataforma
- `Spacing` — escala de espaciado (half → six)
- `MaxContentWidth` — ancho máximo de contenido (800 px)
- `BottomTabInset` — inset inferior para tabs
