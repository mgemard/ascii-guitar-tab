import * as vscode from 'vscode';

export function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {

  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js')
  );

  return `
    <!DOCTYPE html>
    <html>
    <body>
      <h3>AsciiTab Audio Engine</h3>
      <button id="playLowE">Play/Reset</button>

      <script src="${scriptUri}"></script>
    </body>
    </html>
  `;
}
