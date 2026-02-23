import * as assert from "assert";
import { Lexer } from "../core/lexer";
import { TokenType } from "../core/token";

suite("Lexer Tests", () => {

  test("Tokenizes simple fret", () => {
    const input = "5";
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();

    assert.strictEqual(tokens[0].type, TokenType.FretNumber);
    assert.strictEqual(tokens[0].value, "5aaaaaaaaa");
  });

  test("Tokenizes hammer-on expression 5h7", () => {
    const input = "5h7";
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();

    assert.strictEqual(tokens[0].type, TokenType.FretNumber);
    assert.strictEqual(tokens[1].type, TokenType.HammerOn);
    assert.strictEqual(tokens[2].type, TokenType.FretNumber);
  });

  test("Tokenizes multi-digit fret 10", () => {
    const input = "10";
    const lexer = new Lexer(input);
    const tokens = lexer.tokenize();

    assert.strictEqual(tokens[0].type, TokenType.FretNumber);
    assert.strictEqual(tokens[0].value, "10");
  });

});