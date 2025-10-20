import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type Props = {
  isPlaying: boolean;
  onPrev: () => void | Promise<void>;
  onToggle: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
};

export default function PlayerControls({ isPlaying, onPrev, onToggle, onNext }: Props) {
  return (
    <ThemedView style={styles.container}>
      <Pressable accessibilityRole="button" onPress={onPrev} style={styles.button}>
        <ThemedText type="defaultSemiBold">Prev</ThemedText>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onToggle} style={styles.buttonPrimary}>
        <ThemedText type="defaultSemiBold">{isPlaying ? 'Pause' : 'Play'}</ThemedText>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onNext} style={styles.button}>
        <ThemedText type="defaultSemiBold">Next</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
