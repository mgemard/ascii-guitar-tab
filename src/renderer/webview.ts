
export function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html>
    <body>
      <h3>AsciiTab Audio Engine</h3>
      <script>
        const vscode = acquireVsCodeApi();
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        window.addEventListener('message', event => {
          const message = event.data;

          if (message.type === 'play') {
            playTone(message.frequency);
          }
        });

        function playTone(frequency) {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

          gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 1);
        }

        document.body.addEventListener('click', () => {
          audioCtx.resume();
        });
      </script>
    </body>
    </html>
  `;
}