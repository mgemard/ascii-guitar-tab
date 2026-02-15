export interface AsciiTab {
  tuning: string[];
  capo?: number;
  bpm?: number;
  measures: Measure[];
}

export interface Measure {
  strings: TabString[];
}

export interface TabString {
  name: string;
  frets: (number | null)[];
}
