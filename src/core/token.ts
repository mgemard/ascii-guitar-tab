// core/token.ts

export enum TokenType {
  StringName = "StringName",     // e, B, G, D, A, E
  FretNumber = "FretNumber",     // 0-24 (or more)
  HammerOn = "HammerOn",         // h
  PullOff = "PullOff",           // p
  SlideUp = "SlideUp",           // /
  SlideDown = "SlideDown",       // \
  Bend = "Bend",                 // b
  Release = "Release",           // r
  Vibrato = "Vibrato",           // ~
  Mute = "Mute",                 // x
  BarLine = "BarLine",           // |
  Dash = "Dash",                 // -
  Whitespace = "Whitespace",
  NewLine = "NewLine",
  Unknown = "Unknown",
  EOF = "EOF"
}

export interface Token {
  type: TokenType
  value: string
  position: number
}