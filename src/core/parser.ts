// core/parser.ts

import { Token, TokenType } from "./token";
import {
  TabFile,
  Track,
  TabString,
  TabEvent
} from "./ast";

export class Parser {
  private tokens: Token[];
  private position = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): TabFile {
    const track: Track = { strings: [] };

    while (!this.isAtEnd()) {
      const string = this.parseStringLine();
      if (string) {
        track.strings.push(string);
      } else {
        this.advance();
      }
    }

    return { tracks: [track] };
  }

  private parseStringLine(): TabString | null {
    const token = this.peek();

    if (token.type !== TokenType.StringName) {
      return null;
    }

    const stringName = token.value;
    this.advance();

    const events: TabEvent[] = [];

    while (!this.isAtEnd() && this.peek().type !== TokenType.NewLine) {
      const event = this.parseEvent();
      if (event) {
        events.push(event);
      } else {
        this.advance();
      }
    }

    this.consume(TokenType.NewLine);

    return {
      name: stringName,
      events
    };
  }

  private parseEvent(): TabEvent | null {
    const token = this.peek();

    if (token.type === TokenType.FretNumber) {
      return this.parseFretExpression();
    }

    if (token.type === TokenType.Mute) {
      this.advance();
      return {
        type: "Mute",
        position: token.position
      };
    }

    if (token.type === TokenType.BarLine) {
      this.advance();
      return {
        type: "Bar",
        position: token.position
      };
    }

    return null;
  }

  private parseFretExpression(): TabEvent | null {
    const startToken = this.consume(TokenType.FretNumber);
    const fromFret = parseInt(startToken.value);

    const next = this.peek();

    if (next.type === TokenType.HammerOn) {
      this.advance();
      const to = this.consume(TokenType.FretNumber);
      return {
        type: "HammerOn",
        fromFret,
        toFret: parseInt(to.value),
        position: startToken.position
      };
    }

    if (next.type === TokenType.PullOff) {
      this.advance();
      const to = this.consume(TokenType.FretNumber);
      return {
        type: "PullOff",
        fromFret,
        toFret: parseInt(to.value),
        position: startToken.position
      };
    }

    if (next.type === TokenType.SlideUp || next.type === TokenType.SlideDown) {
      const direction = next.type === TokenType.SlideUp ? "up" : "down";
      this.advance();
      const to = this.consume(TokenType.FretNumber);

      return {
        type: "Slide",
        fromFret,
        toFret: parseInt(to.value),
        direction,
        position: startToken.position
      };
    }

    if (next.type === TokenType.Bend) {
      this.advance();
      return {
        type: "Bend",
        fret: fromFret,
        position: startToken.position
      };
    }

    if (next.type === TokenType.Vibrato) {
      this.advance();
      return {
        type: "Vibrato",
        fret: fromFret,
        position: startToken.position
      };
    }

    return {
      type: "Note",
      fret: fromFret,
      position: startToken.position
    };
  }

  private peek(): Token {
    return this.tokens[this.position];
  }

  private advance() {
    this.position++;
  }

  private consume(type: TokenType): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new Error(`Expected ${type} but got ${token.type}`);
    }
    this.advance();
    return token;
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
}