// tabPlayer.ts

type TabMetadata = {
    title?: string;
    artist?: string;
    tempo: number;     // BPM
    tuning: string[];  // ["E","A","D","G","B","E"]
    capo: number;
    timeSignature: string; // "4/4"
};

type NoteEvent = {
    stringIndex: number; // 0 = high e, 5 = low E
    fret: number;
    startBeat: number;
    durationBeats: number;
};

type ParsedTab = {
    metadata: TabMetadata;
    notes: NoteEvent[];
};

const STANDARD_TUNING_FREQ: Record<string, number> = {
    "C": 16.35,
    "C#": 17.32,
    "D": 18.35,
    "D#": 19.45,
    "E": 20.60,
    "F": 21.83,
    "F#": 23.12,
    "G": 24.50,
    "G#": 25.96,
    "A": 27.50,
    "A#": 29.14,
    "B": 30.87,
};

/**
 * Main entry point
 */
export function parseTab(text: string): ParsedTab {
    const lines = text.split(/\r?\n/);

    const metadata: TabMetadata = {
        tempo: 120,
        tuning: ["E", "A", "D", "G", "B", "E"],
        capo: 0,
        timeSignature: "4/4",
    };

    const tabLines: string[] = [];

    for (const line of lines) {
        if (line.startsWith("title:")) {
            metadata.title = line.replace("title:", "").trim();
        } else if (line.startsWith("artist:")) {
            metadata.artist = line.replace("artist:", "").trim();
        } else if (line.startsWith("tempo:")) {
            metadata.tempo = parseInt(line.replace("tempo:", "").trim(), 10);
        } else if (line.startsWith("tuning:")) {
            metadata.tuning = line
                .replace("tuning:", "")
                .trim()
                .split(/\s+/);
        } else if (line.startsWith("capo:")) {
            metadata.capo = parseInt(line.replace("capo:", "").trim(), 10);
        } else if (line.startsWith("time:")) {
            metadata.timeSignature = line.replace("time:", "").trim();
        } else if (/^[eBGDAE]\|/.test(line)) {
            tabLines.push(line);
        }
    }

    const notes = parseTabLines(tabLines, metadata);

    return { metadata, notes };
}

/**
 * Parse ASCII tab rows into note events
 */
function parseTabLines(tabLines: string[], metadata: TabMetadata): NoteEvent[] {
    if (tabLines.length === 0) return [];

    const stringOrder = tabLines.map(line => line[0]); // e B G D A E

    const columns = tabLines.map(line => {
        const content = line.substring(2); // remove "e|"
        return content;
    });

    const length = columns[0].length;
    const events: NoteEvent[] = [];

    for (let col = 0; col < length; col++) {
        for (let stringIdx = 0; stringIdx < columns.length; stringIdx++) {
            const char = columns[stringIdx][col];

            if (/\d/.test(char)) {
                // Handle multi-digit frets
                let fretStr = char;
                let offset = 1;

                while (
                    col + offset < length &&
                    /\d/.test(columns[stringIdx][col + offset])
                ) {
                    fretStr += columns[stringIdx][col + offset];
                    offset++;
                }

                const fret = parseInt(fretStr, 10);
                const startBeat = colToBeat(col, metadata);

                events.push({
                    stringIndex: stringIdx,
                    fret,
                    startBeat,
                    durationBeats: 0.25, // treat each column as 16th note
                });

                col += offset - 1;
            }
        }
    }

    return events;
}

/**
 * Convert column index to musical beat
 */
function colToBeat(col: number, metadata: TabMetadata): number {
    return col * 0.25; // 16th note grid
}

/**
 * Convert string + fret into frequency
 */
function getFrequency(
    tuningNote: string,
    fret: number,
    capo: number
): number {
    const baseFreq = STANDARD_TUNING_FREQ[tuningNote.toUpperCase()];
    const semitoneOffset = fret + capo;
    return baseFreq * Math.pow(2, semitoneOffset / 12);
}

/**
 * Play parsed tab using Web Audio API
 */
export async function playTab(parsed: ParsedTab) {
    const audioContext = new AudioContext();

    const secondsPerBeat = 60 / parsed.metadata.tempo;
    const now = audioContext.currentTime + 0.1;

    let latestEndTime = now;

    for (const note of parsed.notes) {
        const tuningNote =
            parsed.metadata.tuning[
                parsed.metadata.tuning.length - 1 - note.stringIndex
            ];

        const frequency = getFrequency(
            tuningNote,
            note.fret,
            parsed.metadata.capo
        );

        const startTime = now + note.startBeat * secondsPerBeat;
        const duration = note.durationBeats * secondsPerBeat;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = "triangle";
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            startTime + duration
        );

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);

        latestEndTime = Math.max(latestEndTime, startTime + duration);
    }

    // IMPORTANT: resume only after scheduling everything
    await audioContext.resume();

    // Optional: resolve when playback finishes
    return new Promise<void>((resolve) => {
        const check = () => {
            if (audioContext.currentTime >= latestEndTime) {
                resolve();
            } else {
                requestAnimationFrame(check);
            }
        };
        check();
    });
}
