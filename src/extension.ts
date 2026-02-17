import * as vscode from 'vscode';
import { parseAsciiTab } from './parser';
import { getWebviewContent } from './renderer/webview';
// import { getWebviewContent } from './webview/main';

let sidePanel: vscode.WebviewPanel | undefined;
let webviewReady = false;

export function activate(context: vscode.ExtensionContext) {
  console.log("AsciiTab extension activated");

  let extensionUri = context.extensionUri;

  context.subscriptions.push(vscode.commands.registerCommand(
    'asciitab.openAudioPanel',
    () => { createOrShowPanel("current", extensionUri); }
  ));

  context.subscriptions.push(vscode.commands.registerCommand(
    'asciitab.openAudioPanelToSide',
    () => { createOrShowPanel("side", extensionUri); }
  ));

}

function createOrShowPanel(location: "side" | "current", extensionUri: vscode.Uri): vscode.WebviewPanel {

  console.log(`location ${location}`);
  const column =
    location === "side" ? vscode.ViewColumn.Beside : vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One;

  if (location === "current") {
    // Always create a new panel in the current editor
    // TODO this line seems duplicated
    return createWebviewPanel('AsciiTab Audio', column, extensionUri);
  }

  // Side panel: reuse if exists
  if (sidePanel) {
    sidePanel.reveal(column);
    return sidePanel;
  }

  sidePanel = createWebviewPanel('AsciiTab Audio', column, extensionUri);
  return sidePanel;
}

function createWebviewPanel(
  title: string,
  column: vscode.ViewColumn,
  extensionUri: vscode.Uri
): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'asciitabAudio',
    title,
    column,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  panel.webview.html = getWebviewContent(panel.webview, extensionUri);

  panel.webview.onDidReceiveMessage(msg => {
    if (msg.type === 'ready') { webviewReady = true;}
  });

  panel.onDidDispose(() => {
    if (sidePanel === panel) { sidePanel = undefined; }
    webviewReady = false;
  });

  return panel;
}

export function deactivate() { }
