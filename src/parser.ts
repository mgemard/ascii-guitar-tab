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
