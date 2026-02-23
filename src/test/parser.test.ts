import * as assert from "assert";
import { Lexer } from "../core/lexer";
import { Parser } from "../core/parser";

suite("Parser Tests", () => {

  test("Parses single note", () => {
    const input = "e5\n";
    const tokens = new Lexer(input).tokenize();
    const ast = new Parser(tokens).parse();

    const string = ast.tracks[0].strings[0];
    const event = string.events[0];

    assert.strictEqual(event.type, "Note");
    assert.strictEqual(event.fret, 5);
  });

  test("Parses hammer-on 5h7", () => {
    const input = "e5h7\n";
    const tokens = new Lexer(input).tokenize();
    const ast = new Parser(tokens).parse();

    const event = ast.tracks[0].strings[0].events[0];

    assert.strictEqual(event.type, "HammerOn");
    assert.strictEqual(event.fromFret, 5);
    assert.strictEqual(event.toFret, 7);
  });

  test("Parses slide up 7/9", () => {
    const input = "e7/9\n";
    const tokens = new Lexer(input).tokenize();
    const ast = new Parser(tokens).parse();

    const event = ast.tracks[0].strings[0].events[0];

    assert.strictEqual(event.type, "Slide");
    assert.strictEqual(event.direction, "up");
    assert.strictEqual(event.fromFret, 7);
    assert.strictEqual(event.toFret, 9);
  });

});