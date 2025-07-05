/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { ThemedView } from './components/ThemedView';
import { ThemedText } from './components/ThemedText';
import { from_bougatfa_to_tunis, from_tunis_to_bougatfa } from './timelines';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
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
        <ThemedText type="title">
          {getClosestTime(currentDateTime, from_bougatfa_to_tunis)}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.box}>
        <ThemedText type="title">From Tunis</ThemedText>
        <ThemedText type="title">
          {getClosestTime(currentDateTime, from_tunis_to_bougatfa)}
        </ThemedText>
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
});

function getClosestTime(current: Date, timeline: string[]): string {
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
      return timeStr;
    }
  }
  return timeline[0];
}

export default App;
