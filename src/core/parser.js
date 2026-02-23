// core/parser.ts
import { TokenType } from "./token";
export class Parser {
    tokens;
    position = 0;
    constructor(tokens) {
        this.tokens = tokens;
    }
    parse() {
        const track = { strings: [] };
        while (!this.isAtEnd()) {
            const string = this.parseStringLine();
            if (string) {
                track.strings.push(string);
            }
            else {
                this.advance();
            }
        }
        return { tracks: [track] };
    }
    parseStringLine() {
        const token = this.peek();
        if (token.type !== TokenType.StringName) {
            return null;
        }
        const stringName = token.value;
        this.advance();
        const events = [];
        while (!this.isAtEnd() && this.peek().type !== TokenType.NewLine) {
            const event = this.parseEvent();
            if (event) {
                events.push(event);
            }
            else {
                this.advance();
            }
        }
        this.consume(TokenType.NewLine);
        return {
            name: stringName,
            events
        };
    }
    parseEvent() {
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
    parseFretExpression() {
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
    peek() {
        return this.tokens[this.position];
    }
    advance() {
        this.position++;
    }
    consume(type) {
        const token = this.peek();
        if (token.type !== type) {
            throw new Error(`Expected ${type} but got ${token.type}`);
        }
        this.advance();
        return token;
    }
    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }
}
