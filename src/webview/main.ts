import { parseTab, playTab } from "../player/tabPlayer";

const vscode = acquireVsCodeApi();

let currentAudioContext: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];

function stopAllOscillators() {
  activeOscillators.forEach(osc => {
    try {
      osc.stop();
    } catch (e) {
      console.warn("Could not stop oscillator:", e);
    }
  });
  activeOscillators = [];
  if (currentAudioContext && currentAudioContext.state !== 'closed') {
    currentAudioContext.close().catch(console.warn);
  }
}

function playGuitarNote(
  audioContext: AudioContext,
  frequency: number,
  startTime: number,
  duration = 0.2
) {

    console.log("playGuitarNote");
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.value = 1000;
  filter.Q.value = 1;

  oscillator.frequency.value = frequency;
  oscillator.type = 'triangle';
  gainNode.gain.value = 0.2;

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);

  activeOscillators.push(oscillator);
}

function playArpeggiatedEChord() {
    console.log("playArpeggiatedEChord");
  stopAllOscillators();

  currentAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = currentAudioContext.currentTime;

  const notes = [
    { freq: 110.00 * Math.pow(2, 3/12), time: now + 0.0, duration: 3.9 },
    { freq: 329.63, time: now + 0.0, duration: 0.9 },
    { freq: 196.00, time: now + 0.5, duration: 0.9 },
    { freq: 329.63, time: now + 1.0, duration: 0.9 },
    { freq: 196.00, time: now + 1.5, duration: 0.9 },
    { freq: 329.63, time: now + 2.0, duration: 0.9 },
    { freq: 196.00, time: now + 2.5, duration: 0.9 },
    { freq: 329.63, time: now + 3.0, duration: 0.9 },
    { freq: 196.00, time: now + 3.5, duration: 0.9 },
    { freq: 82.41 * Math.pow(2, 3/12), time: now + 4.0, duration: 3.9 },
    { freq: 246.94, time: now + 4.0, duration: 0.9 },
    { freq: 146.83, time: now + 4.5, duration: 0.9 },
    { freq: 246.94, time: now + 5.0, duration: 0.9 },
    { freq: 146.83, time: now + 5.5, duration: 0.9 },
    { freq: 246.94, time: now + 6.0, duration: 0.9 },
    { freq: 146.83, time: now + 6.5, duration: 0.9 },
    { freq: 246.94, time: now + 7.0, duration: 0.9 },
    { freq: 146.83, time: now + 7.5, duration: 0.9 },
  ];

  notes.forEach(note => {
    playGuitarNote(
      currentAudioContext!,
      note.freq,
      note.time / 1.8,
      note.duration / 1.8
    );
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById('playLowE')
    ?.addEventListener('click', playArpeggiatedEChord);

  document.body.addEventListener(
    'click',
    () => {
      if (currentAudioContext?.state === 'suspended') {
        currentAudioContext.resume();
      }
    },
    { once: true }
  );

  vscode.postMessage({ type: 'ready' });
});




const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const textarea = document.getElementById('tabInput') as HTMLTextAreaElement;

let isPlaying = false;

playBtn.addEventListener('click', async () => {
  if (isPlaying) {
    location.reload(); // simple reset strategy
    return;
  }

  try {
    isPlaying = true;
    playBtn.textContent = 'Playing...';

    const parsed = parseTab(textarea.value);
    await playTab(parsed);

    playBtn.textContent = 'Play';
    isPlaying = false;
  } catch (err) {
    console.error(err);
    playBtn.textContent = 'Play';
    isPlaying = false;
  }
});
