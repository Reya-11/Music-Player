import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess, InterruptionModeAndroid } from 'expo-av';

export type TrackSource =
  | { type: 'module'; module: number } // from require('...')
  | { type: 'uri'; uri: string };

export type Track = {
  id: string;
  title: string;
  artist?: string;
  source: TrackSource;
};

export type PlayerState = {
  isLoaded: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  positionMillis: number;
  durationMillis: number | null;
  index: number;
  error?: string;
};

const defaultPlayerState: PlayerState = {
  isLoaded: false,
  isPlaying: false,
  isBuffering: false,
  positionMillis: 0,
  durationMillis: null,
  index: -1,
};

export function useAudioPlayer(initialTracks: Track[] = []) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [state, setState] = useState<PlayerState>(defaultPlayerState);

  // Configure audio mode (Android-first)
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {
      // Ignore configuration errors for now
    });
  }, []);

  const unloadAsync = useCallback(async () => {
    const current = soundRef.current;
    if (current) {
      try {
        await current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
  }, []);

  const onStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setState((s) => ({ ...s, isLoaded: false, isPlaying: false, isBuffering: false }));
      return;
    }
    const s = status as AVPlaybackStatusSuccess;
    setState((prev) => ({
      ...prev,
      isLoaded: true,
      isPlaying: s.isPlaying,
      isBuffering: s.isBuffering,
      positionMillis: s.positionMillis ?? 0,
      durationMillis: s.durationMillis ?? null,
    }));
    if (s.didJustFinish && !s.isLooping) {
      // Auto advance to next track
      void next();
    }
  }, []);

  const loadIndex = useCallback(
    async (index: number, autoPlay = true) => {
      if (index < 0 || index >= tracks.length) return;
      await unloadAsync();
      const track = tracks[index];
      const sound = new Audio.Sound();
      sound.setOnPlaybackStatusUpdate(onStatusUpdate);
      try {
        const source =
          track.source.type === 'module' ? track.source.module : { uri: track.source.uri };
        await sound.loadAsync(source, { shouldPlay: autoPlay, progressUpdateIntervalMillis: 250 });
        soundRef.current = sound;
        setState((s) => ({ ...s, index, isLoaded: true }));
      } catch (e: any) {
        setState((s) => ({ ...s, error: e?.message ?? 'Failed to load track' }));
      }
    },
    [onStatusUpdate, tracks, unloadAsync]
  );

  const play = useCallback(async () => {
    const sound = soundRef.current;
    if (sound) await sound.playAsync();
    else if (tracks.length > 0) await loadIndex(0, true);
  }, [loadIndex, tracks.length]);

  const pause = useCallback(async () => {
    const sound = soundRef.current;
    if (sound) await sound.pauseAsync();
  }, []);

  const togglePlay = useCallback(async () => {
    if (!state.isLoaded) {
      await play();
      return;
    }
    if (state.isPlaying) await pause();
    else await play();
  }, [pause, play, state.isLoaded, state.isPlaying]);

  const seek = useCallback(async (positionMillis: number) => {
    const sound = soundRef.current;
    if (sound && state.isLoaded) {
      await sound.setPositionAsync(positionMillis);
    }
  }, [state.isLoaded]);

  const next = useCallback(async () => {
    if (tracks.length === 0) return;
    const nextIndex = (state.index + 1) % tracks.length;
    await loadIndex(nextIndex, state.isPlaying || true);
  }, [loadIndex, state.index, state.isPlaying, tracks.length]);

  const previous = useCallback(async () => {
    if (tracks.length === 0) return;
    const prevIndex = (state.index - 1 + tracks.length) % tracks.length;
    await loadIndex(prevIndex, state.isPlaying || true);
  }, [loadIndex, state.index, state.isPlaying, tracks.length]);

  const setPlaylist = useCallback(async (list: Track[], startIndex = 0) => {
    setTracks(list);
    setState(defaultPlayerState);
    if (list.length > 0) {
      await loadIndex(Math.min(Math.max(0, startIndex), list.length - 1), false);
    }
  }, [loadIndex]);

  const currentTrack = useMemo(() => {
    if (state.index < 0 || state.index >= tracks.length) return undefined;
    return tracks[state.index];
  }, [state.index, tracks]);

  useEffect(() => {
    return () => {
      // cleanup sound on unmount
      unloadAsync();
    };
  }, [unloadAsync]);

  return {
    state,
    tracks,
    currentTrack,
    setPlaylist,
    loadIndex,
    play,
    pause,
    togglePlay,
    seek,
    next,
    previous,
  };
}
