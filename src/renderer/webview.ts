import * as vscode from 'vscode';

export function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {

  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js')
  );

  const nonce = getNonce();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />

      <!-- CSP -->
      <meta http-equiv="Content-Security-Policy"
        content="
          default-src 'none';
          style-src 'unsafe-inline' ${webview.cspSource};
          script-src 'nonce-${nonce}';
        "
      />

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AsciiTab Audio Engine</title>
    </head>

    <body>
      <h3>AsciiTab Audio Engine</h3>

      <textarea id="tabInput" style="width:100%; height:200px;">
title: Stairway to Heaven
artist: Led Zeppelin
tempo: 120
tuning: E A D G B E
capo: 2
time: 4/4

e|-----------------------------------|
B|-1---------1-----0---------0-------|
G|-------0-------0-------0-------0---|
D|-----2-------2-------2-------2-----|
A|-3-------3-------3-------3---------|
E|-----------------------------------|
      </textarea>

      <br /><br />
      <button id="playBtn">Play</button>

      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>
  `;
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
