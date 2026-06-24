import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { Brand, Ink } from '@/constants/theme';

type Coords = { latitude: number; longitude: number };

const DELTA = 0.004;

export function LiveMap() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [permDenied, setPermDenied] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let cancelled = false;
    let sub: Location.LocationSubscription | null = null;

    async function start() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!cancelled) setPermDenied(true);
        return;
      }

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 3000, distanceInterval: 5 },
        (loc) => {
          if (cancelled) return;
          const next: Coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setCoords(next);
          mapRef.current?.animateToRegion(
            { ...next, latitudeDelta: DELTA, longitudeDelta: DELTA },
            400,
          );
        },
      ).then((s) => {
        if (cancelled) s.remove();
        else sub = s;
      });
    }

    start();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  if (permDenied) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Permiso de ubicación no concedido</Text>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator color={Brand[500]} size="small" />
        <Text style={styles.placeholderText}>Obteniendo ubicación…</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      style={StyleSheet.absoluteFillObject}
      initialRegion={{ ...coords, latitudeDelta: DELTA, longitudeDelta: DELTA }}
    >
      <Marker coordinate={coords} pinColor="#ef4a64" />
      <Circle
        center={coords}
        radius={150}
        fillColor="rgba(239,74,100,0.12)"
        strokeColor="rgba(239,74,100,0.45)"
        strokeWidth={1.5}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef0f3',
    gap: 8,
  },
  placeholderText: {
    fontSize: 13,
    color: Ink[400],
  },
});
