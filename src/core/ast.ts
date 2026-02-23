// core/ast.ts

export interface TabFile {
  tracks: Track[]
}

export interface Track {
  strings: TabString[]
}

export interface TabString {
  name: string
  events: TabEvent[]
}

export type TabEvent =
  | NoteEvent
  | HammerOnEvent
  | PullOffEvent
  | SlideEvent
  | BendEvent
  | VibratoEvent
  | MuteEvent
  | BarEvent

export interface BaseEvent {
  position: number
}

export interface NoteEvent extends BaseEvent {
  type: "Note"
  fret: number
}

export interface HammerOnEvent extends BaseEvent {
  type: "HammerOn"
  fromFret: number
  toFret: number
}

export interface PullOffEvent extends BaseEvent {
  type: "PullOff"
  fromFret: number
  toFret: number
}

export interface SlideEvent extends BaseEvent {
  type: "Slide"
  fromFret: number
  toFret: number
  direction: "up" | "down"
}

export interface BendEvent extends BaseEvent {
  type: "Bend"
  fret: number
}

export interface VibratoEvent extends BaseEvent {
  type: "Vibrato"
  fret: number
}

export interface MuteEvent extends BaseEvent {
  type: "Mute"
}

export interface BarEvent extends BaseEvent {
  type: "Bar"
}