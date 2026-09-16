import {
  addExpirationListener,
  getBackgroundTimeRemaining,
  getForegroundIdentifiers,
  isAvailable,
  startForegroundAction,
  stopForegroundAction,
} from 'expo-bgtwn';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function App() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);

  const append = (line: string) => setLog((prev) => [line, ...prev].slice(0, 40));

  useEffect(() => {
    const subscription = addExpirationListener((event) => {
      append(`expired #${event.identifier}, ${event.remaining.toFixed(1)}s left`);
      stopRef.current = true;
    });
    return () => subscription.remove();
  }, []);

  const run = async () => {
    if (running) {
      stopRef.current = true;
      return;
    }
    setRunning(true);
    stopRef.current = false;
    const identifier = await startForegroundAction();
    append(`started #${identifier} (native: ${isAvailable ? 'yes' : 'no'})`);
    try {
      // Background the app now: the loop keeps ticking until iOS expires the task.
      for (let i = 0; i < 60 && !stopRef.current; i++) {
        const remaining = await getBackgroundTimeRemaining();
        const ids = await getForegroundIdentifiers();
        append(`${i}s remaining=${remaining > 1e6 ? 'foreground' : remaining.toFixed(1)} ids=${ids.join(',')}`);
        await sleep(1000);
      }
    } finally {
      await stopForegroundAction(identifier);
      append(`stopped #${identifier}`);
      setRunning(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>expo-bgtwn</Text>
      <Pressable
        onPress={run}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>{running ? 'Stop' : 'Start 60s task, then background the app'}</Text>
      </Pressable>
      {log.map((line, index) => (
        <Text key={`${index}-${line}`} style={styles.line}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  line: {
    fontFamily: 'Menlo',
    fontSize: 12,
    marginBottom: 2,
  },
});
