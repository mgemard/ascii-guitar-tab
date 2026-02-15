import * as vscode from 'vscode';
import { parseAsciiTab } from './parser';
import { getWebviewContent } from './renderer/webview';

let panel: vscode.WebviewPanel | undefined;
let webviewReady = false;

export function activate(context: vscode.ExtensionContext) {
  console.log("AsciiTab extension activated");

  function createOrShowPanel(location: "side" | "current"): vscode.WebviewPanel {
  const column =
    location === "side" ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active;

  // If user wants a new tab (current tab), always create a new panel
  if (location === "current") {
    return vscode.window.createWebviewPanel(
      'asciitabAudio',
      'AsciiTab Audio',
      column,
      { enableScripts: true, retainContextWhenHidden: true }
    );
  }

  // For side panel, reuse single panel
  if (panel) {
    panel.reveal(column);
    return panel;
  }

  panel = vscode.window.createWebviewPanel(
    'asciitabAudio',
    'AsciiTab Audio',
    column,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  panel.webview.html = getWebviewContent();

  panel.webview.onDidReceiveMessage(msg => {
    if (msg.type === 'ready') webviewReady = true;
  });

  panel.onDidDispose(() => {
    panel = undefined;
    webviewReady = false;
  });

  return panel;
}

vscode.commands.registerCommand(
  'asciitab.openAudioPanel',
  (location: "side" | "current" = "side") => {
    createOrShowPanel(location);
  }
);
}

export function deactivate() {}
