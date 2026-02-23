// core/lexer.ts

import { Token, TokenType } from "./token";

export class Lexer {
  private input: string;
  private position = 0;

  constructor(input: string) {
    this.input = input;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (!this.isAtEnd()) {
      const char = this.peek();
      const pos = this.position;

      if (this.isWhitespace(char)) {
        this.advance();
        tokens.push({ type: TokenType.Whitespace, value: char, position: pos });
        continue;
      }

      if (char === "\n") {
        this.advance();
        tokens.push({ type: TokenType.NewLine, value: "\n", position: pos });
        continue;
      }

      if (this.isDigit(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      if (this.isStringName(char)) {
        this.advance();
        tokens.push({ type: TokenType.StringName, value: char, position: pos });
        continue;
      }

      const symbolToken = this.matchSymbol(char, pos);
      if (symbolToken) {
        this.advance();
        tokens.push(symbolToken);
        continue;
      }

      this.advance();
      tokens.push({ type: TokenType.Unknown, value: char, position: pos });
    }

    tokens.push({ type: TokenType.EOF, value: "", position: this.position });
    return tokens;
  }

  private readNumber(): Token {
    const start = this.position;
    let value = "";

    while (!this.isAtEnd() && this.isDigit(this.peek())) {
      value += this.peek();
      this.advance();
    }

    return {
      type: TokenType.FretNumber,
      value,
      position: start
    };
  }

  private matchSymbol(char: string, position: number): Token | null {
    const grammar: Record<string, TokenType> = {
      "h": TokenType.HammerOn,
      "p": TokenType.PullOff,
      "/": TokenType.SlideUp,
      "\\": TokenType.SlideDown,
      "b": TokenType.Bend,
      "r": TokenType.Release,
      "~": TokenType.Vibrato,
      "x": TokenType.Mute,
      "|": TokenType.BarLine,
      "-": TokenType.Dash
    };

    if (grammar[char]) {
      return {
        type: grammar[char],
        value: char,
        position
      };
    }

    return null;
  }

  private peek(): string {
    return this.input[this.position];
  }

  private advance() {
    this.position++;
  }

  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private isWhitespace(char: string): boolean {
    return char === " " || char === "\t";
  }

  private isStringName(char: string): boolean {
    return ["e", "B", "G", "D", "A", "E"].includes(char);
  }
}