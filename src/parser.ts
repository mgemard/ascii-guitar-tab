import { AsciiTab } from "./model";

export function parseAsciiTab(content: string): AsciiTab {
  const lines = content.split(/\r?\n/);

  let tuning: string[] = [];
  let capo: number | undefined;
  let bpm: number | undefined;

  let index = 0;

  // Parse header
  while (lines[index].trim() !== "") {
    const line = lines[index];

    if (line.startsWith("Tuning:")) {
      tuning = line.replace("Tuning:", "").trim().split(/\s+/);
    } else if (line.startsWith("Capo:")) {
      capo = parseInt(line.replace("Capo:", "").trim(), 10);
    } else if (line.startsWith("BPM:")) {
      bpm = parseInt(line.replace("BPM:", "").trim(), 10);
    }

    index++;
  }

  index++; // skip empty line

  const tabLines = lines.slice(index).filter(l => l.trim().length > 0);

  const strings = tabLines.map(line => {
    const [name, body] = line.split("|");
    return {
      name: name.trim(),
      frets: parseFrets(body)
    };
  });

  return {
    tuning,
    capo,
    bpm,
    measures: [{ strings }]
  };
}

function parseFrets(body: string): (number | null)[] {
  const result: (number | null)[] = [];
  let i = 0;

  while (i < body.length) {
    const char = body[i];

    if (/\d/.test(char)) {
      let number = char;
      if (/\d/.test(body[i + 1])) {
        number += body[i + 1];
        i++;
      }
      result.push(parseInt(number, 10));
    } else {
      result.push(null);
    }

    i++;
  }

  return result;
}






// function parseGuitarTab(tab: string[]): GuitarNote[] {
//   const notes: GuitarNote[] = [];
//   const strings = ['E', 'A', 'D', 'G', 'B', 'e']; // Low to high
//   const openStringFreqs = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]; // EADGBE

//   tab.forEach((line, stringIndex) => {
//     const frets = line.match(/\d+/g);
//     if (frets) {
//       frets.forEach(fret => {
//         const fretNum = parseInt(fret, 10);
//         const frequency = openStringFreqs[stringIndex] * Math.pow(2, fretNum / 12);
//         notes.push({
//           string: stringIndex + 1,
//           fret: fretNum,
//           frequency,
//           timing: 0, // Set timing based on position in the tab
//           duration: 0.5,
//         });
//       });
//     }
//   });

//   return notes;
// }
