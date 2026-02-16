
export function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html>
    <body>
      <h3>AsciiTab Audio Engine</h3>
      <button id="playLowE">Play/Reset</button>

     <script>
      const vscode = acquireVsCodeApi();
      let currentAudioContext = null;
      let activeOscillators = [];

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

      function playGuitarNote(audioContext, frequency, startTime, duration = 0.2) {
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

// function playGuitarNote(audioContext, frequency, startTime, duration = 0.4) {
//   // --- Oscillator (string vibration) ---
//   const oscillator = audioContext.createOscillator();
//   oscillator.type = 'sawtooth'; // richer harmonics than triangle
//   oscillator.frequency.value = frequency;

//   // --- Noise burst (finger pluck) ---
//   const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.02, audioContext.sampleRate);
//   const noiseData = noiseBuffer.getChannelData(0);
//   for (let i = 0; i < noiseData.length; i++) {
//     noiseData[i] = Math.random() * 2 - 1;
//   }
//   const noiseSource = audioContext.createBufferSource();
//   noiseSource.buffer = noiseBuffer;

//   // --- Filters ---
//   const bodyFilter = audioContext.createBiquadFilter();
//   bodyFilter.type = 'bandpass';
//   bodyFilter.frequency.value = 1100;
//   bodyFilter.Q.value = 0.8;

//   const brightnessFilter = audioContext.createBiquadFilter();
//   brightnessFilter.type = 'lowpass';
//   brightnessFilter.frequency.value = 4500;
//   brightnessFilter.Q.value = 0.7;

//   // --- Gain (pluck envelope) ---
//   const gainNode = audioContext.createGain();
//   gainNode.gain.setValueAtTime(0.0001, startTime);
//   gainNode.gain.exponentialRampToValueAtTime(0.25, startTime + 0.01); // sharp attack
//   gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // natural decay

//   // --- Wiring ---
//   oscillator.connect(bodyFilter);
//   noiseSource.connect(bodyFilter);
//   bodyFilter.connect(brightnessFilter);
//   brightnessFilter.connect(gainNode);
//   gainNode.connect(audioContext.destination);

//   // --- Playback ---
//   oscillator.start(startTime);
//   noiseSource.start(startTime);
//   noiseSource.stop(startTime + 0.02);
//   oscillator.stop(startTime + duration);

//   activeOscillators.push(oscillator);
// }


      function playArpeggiatedEChord() {
        // Stop any ongoing playback
        stopAllOscillators();

        // Create a new audio context
        currentAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = currentAudioContext.currentTime;

        // const notes = [
        //   { freq: 82.41, time: now + 0.0 },   // E2 (low E)
        //   { freq: 110.00 * Math.pow(2, 2/12), time: now + 0.1 },   // B3
        //   { freq: 146.83 * Math.pow(2, 2/12), time: now + 0.2 },   // E4
        //   { freq: 196.00, time: now + 0.3 },   // G#4
        //   { freq: 246.94, time: now + 0.4 },   // B4
        //   { freq: 329.63, time: now + 0.5 },   // E5 (high E)
        // ];

        const notes = [
          { freq: 110.00 * Math.pow(2, 3/12), time: now + 0.0, duration: 4.4 },
          { freq: 329.63, time: now + 0.0, duration: 0.9 },
          { freq: 196.00, time: now + 0.5, duration: 0.9 },
          { freq: 329.63, time: now + 1.0, duration: 0.9 },
          { freq: 196.00, time: now + 1.5, duration: 0.9 },
          { freq: 329.63, time: now + 2.0, duration: 0.9 },
          { freq: 196.00, time: now + 2.5, duration: 0.9 },
          { freq: 329.63, time: now + 3.0, duration: 0.9 },
          { freq: 196.00, time: now + 3.5, duration: 0.9 },
          { freq: 82.41 * Math.pow(2, 3/12) , time: now + 4.0, duration: 4.4 },
          { freq: 246.94, time: now + 4.0, duration: 0.9 },
          { freq: 146.83, time: now + 4.5, duration: 0.9 },
          { freq: 246.94, time: now + 5.0, duration: 0.9 },
          { freq: 146.83, time: now + 5.5, duration: 0.9 },
          { freq: 246.94, time: now + 6.0, duration: 0.9 },
          { freq: 146.83, time: now + 6.5, duration: 0.9 },
          { freq: 246.94, time: now + 7.0, duration: 0.9 },
          { freq: 146.83, time: now + 7.5, duration: 0.9 },
           
        ];
        // /fn=f0*2^(n/12)

        notes.forEach(note => {
          playGuitarNote(currentAudioContext, note.freq, note.time/1.5, note.duration/1.5);
        });
      }

      document.getElementById('playLowE').addEventListener('click', () => {
        playArpeggiatedEChord();
      });

      // Resume audio context on first user interaction
      document.body.addEventListener('click', () => {
        if (currentAudioContext && currentAudioContext.state === 'suspended') {
          currentAudioContext.resume();
        }
      }, { once: true });
    </script>


    </body>
    </html>
  `;
}

// const filter = audioContext.createBiquadFilter();
// filter.type = 'lowpass';
// filter.frequency.value = 1000;
// oscillator.connect(filter);
// filter.connect(gainNode);