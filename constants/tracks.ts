import type { Track } from '@/hooks/use-audio-player';

// Drop a few audio files in assets/audio and update the require paths below.
// These are examples; if the files don't exist, the app will still run but won't auto-play.

// Use try/catch around require to avoid bundling failure when file missing in dev resets
function safeRequire(path: string): number | null {
  try {
    // @ts-ignore
    return require(path);
  } catch {
    return null;
  }
}

const demo1 = safeRequire('@/assets/audio/demo1.mp3');
const demo2 = safeRequire('@/assets/audio/demo2.mp3');

const local: Track[] = [];
if (demo1 !== null) {
  local.push({
    id: 'local-1',
    title: 'Demo Track 1',
    artist: 'Local',
    source: { type: 'module', module: demo1 },
  });
}
if (demo2 !== null) {
  local.push({
    id: 'local-2',
    title: 'Demo Track 2',
    artist: 'Local',
    source: { type: 'module', module: demo2 },
  });
}

export const LOCAL_TRACKS: Track[] = local;
