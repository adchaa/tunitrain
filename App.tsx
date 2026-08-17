/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { ThemedView } from './components/ThemedView';
import { ThemedText } from './components/ThemedText';
import { from_bougatfa_to_tunis, from_tunis_to_bougatfa } from './timelines';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const bougatfaDeparture = getClosestDeparture(
    currentDateTime,
    from_bougatfa_to_tunis,
  );
  const tunisDeparture = getClosestDeparture(
    currentDateTime,
    from_tunis_to_bougatfa,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ThemedView style={styles.box}>
        <ThemedText type="title">From bougatfa</ThemedText>
        <Departure departure={bougatfaDeparture} />
      </ThemedView>
      <ThemedView style={styles.box}>
        <ThemedText type="title">From Tunis</ThemedText>
        <Departure departure={tunisDeparture} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  box: {
    alignItems: 'center',
    gap: 25,
  },
  departure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  marker: {
    minWidth: 42,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#0a7ea4',
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    textAlign: 'center',
  },
});

type TrainMarker = 'A' | 'B' | null;

type DepartureData = {
  time: string;
  marker: TrainMarker;
};

function Departure({ departure }: { departure: DepartureData }) {
  return (
    <View
      style={styles.departure}
      accessibilityLabel={`Departure at ${departure.time}${
        departure.marker ? `, ${departure.marker}` : ''
      }`}
    >
      <ThemedText type="title">{departure.time}</ThemedText>
      {departure.marker && (
        <ThemedText style={styles.marker}>{departure.marker}</ThemedText>
      )}
    </View>
  );
}

function getClosestDeparture(current: Date, timeline: string[]): DepartureData {
  const currentTimeMs =
    current.getHours() * 60 * 60 * 1000 +
    current.getMinutes() * 60 * 1000 +
    current.getSeconds() * 1000;

  for (let i = 0; i < timeline.length; i++) {
    const timeStr = timeline[i];
    const [hours, minutes] = timeStr.split(':').map(Number);
    const timelineTimeMs = hours * 60 * 60 * 1000 + minutes * 60 * 1000;

    const difference = timelineTimeMs - currentTimeMs;

    if (difference >= 0) {
      return { time: timeStr, marker: getMarker(i) };
    }
  }
  return { time: timeline[0], marker: getMarker(0) };
}

function getMarker(index: number): TrainMarker {
  if (index < 3) {
    return null;
  }

  if (index > 53) {
    return null;
  }

  return (['A', 'B', 'A', null] as const)[(index - 3) % 4];
}

export default App;
