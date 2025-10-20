import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';
import PlayerControls from '@/components/PlayerControls';
import PlaylistList from '@/components/PlaylistList';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { LOCAL_TRACKS } from '@/constants/tracks';

export default function HomeScreen() {
  const player = useAudioPlayer(LOCAL_TRACKS);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Now Playing</ThemedText>
        {player.currentTrack ? (
          <View>
            <ThemedText type="defaultSemiBold">{player.currentTrack.title}</ThemedText>
            {player.currentTrack.artist ? (
              <ThemedText>{player.currentTrack.artist}</ThemedText>
            ) : null}
          </View>
        ) : (
          <ThemedText>No track loaded. Add files under assets/audio.</ThemedText>
        )}
        {player.state.error ? (
          <ThemedText>{`Error: ${player.state.error}`}</ThemedText>
        ) : null}
        <PlayerControls
          isPlaying={player.state.isPlaying}
          onPrev={player.previous}
          onToggle={player.togglePlay}
          onNext={player.next}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Playlist</ThemedText>
        <PlaylistList
          tracks={player.tracks}
          currentIndex={player.state.index}
          onSelect={(i) => player.loadIndex(i, true)}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>{`Tip: Drop demo1.mp3 and demo2.mp3 in assets/audio to test playback.`}</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
