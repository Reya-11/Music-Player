import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import type { Track } from '@/hooks/use-audio-player';

type Props = {
  tracks: Track[];
  currentIndex: number;
  onSelect: (index: number) => void | Promise<void>;
};

export default function PlaylistList({ tracks, currentIndex, onSelect }: Props) {
  return (
    <FlatList
      data={tracks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <Pressable onPress={() => onSelect(index)}>
          <ThemedView style={[styles.row, index === currentIndex && styles.activeRow]}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            {item.artist ? <ThemedText>{item.artist}</ThemedText> : null}
          </ThemedView>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  activeRow: {
    borderWidth: 2,
  },
});
