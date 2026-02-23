// core/token.ts
export var TokenType;
(function (TokenType) {
    TokenType["StringName"] = "StringName";
    TokenType["FretNumber"] = "FretNumber";
    TokenType["HammerOn"] = "HammerOn";
    TokenType["PullOff"] = "PullOff";
    TokenType["SlideUp"] = "SlideUp";
    TokenType["SlideDown"] = "SlideDown";
    TokenType["Bend"] = "Bend";
    TokenType["Release"] = "Release";
    TokenType["Vibrato"] = "Vibrato";
    TokenType["Mute"] = "Mute";
    TokenType["BarLine"] = "BarLine";
    TokenType["Dash"] = "Dash";
    TokenType["Whitespace"] = "Whitespace";
    TokenType["NewLine"] = "NewLine";
    TokenType["Unknown"] = "Unknown";
    TokenType["EOF"] = "EOF";
})(TokenType || (TokenType = {}));
