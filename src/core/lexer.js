// core/lexer.ts
import { TokenType } from "./token";
export class Lexer {
    input;
    position = 0;
    constructor(input) {
        this.input = input;
    }
    tokenize() {
        const tokens = [];
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
    readNumber() {
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
    matchSymbol(char, position) {
        const grammar = {
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
    peek() {
        return this.input[this.position];
    }
    advance() {
        this.position++;
    }
    isAtEnd() {
        return this.position >= this.input.length;
    }
    isDigit(char) {
        return /[0-9]/.test(char);
    }
    isWhitespace(char) {
        return char === " " || char === "\t";
    }
    isStringName(char) {
        return ["e", "B", "G", "D", "A", "E"].includes(char);
    }
}
