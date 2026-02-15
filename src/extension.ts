import * as vscode from 'vscode';
import { parseAsciiTab } from './parser';
import { getWebviewContent } from './renderer/webview';

let sidePanel: vscode.WebviewPanel | undefined;
let webviewReady = false;

export function activate(context: vscode.ExtensionContext) {
  console.log("AsciiTab extension activated");

  context.subscriptions.push(vscode.commands.registerCommand(
    'asciitab.openAudioPanel',
    () => { createOrShowPanel("current"); }
  ));

  context.subscriptions.push(vscode.commands.registerCommand(
    'asciitab.openAudioPanelToSide',
    () => { createOrShowPanel("side"); }
  ));
}

function createOrShowPanel(location: "side" | "current"): vscode.WebviewPanel {

  console.log(`location ${location}`);
  const column =
    location === "side" ? vscode.ViewColumn.Beside : vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One;

  if (location === "current") {
    // Always create a new panel in the current editor
    return createWebviewPanel('AsciiTab Audio', column);
  }

  // Side panel: reuse if exists
  if (sidePanel) {
    sidePanel.reveal(column);
    return sidePanel;
  }

  sidePanel = createWebviewPanel('AsciiTab Audio', column);
  return sidePanel;
}

function createWebviewPanel(title: string, column: vscode.ViewColumn): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'asciitabAudio',
    title,
    column,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  panel.webview.html = getWebviewContent();

  panel.webview.onDidReceiveMessage(msg => {
    if (msg.type === 'ready') webviewReady = true;
  });

  panel.onDidDispose(() => {
    if (sidePanel === panel) sidePanel = undefined;
    webviewReady = false;
  });

  return panel;
}

export function deactivate() { }
