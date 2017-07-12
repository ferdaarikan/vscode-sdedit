// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var sequenceDiagramProvider = require('./sequenceDiagramProvider');

const previewUri = vscode.Uri.parse('vscode-sdedit://authority/vscode-sdedit');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sdedit" is now active!');
    let provider = new sequenceDiagramProvider();
    let registration = vscode.workspace.registerTextDocumentContentProvider('vscode-sdedit', provider);
    
    function viewSequenceDiagram(){
    var disp = vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then(
            (success) => {                 
                provider.provide(previewUri); 
            },
            (reason) => { 
                vscode.window.showErrorMessage(reason); 
            });
    return disp;
    }

    vscode.workspace.onDidSaveTextDocument((e) => { provider.provide(previewUri); });
    vscode.workspace.onDidOpenTextDocument((e) => { provider.provide(previewUri); });
    vscode.window.onDidChangeActiveTextEditor((e) => { provider.provide(previewUri); });
    
    var viewSequenceDiagramCommand = vscode.commands.registerCommand('extension.viewSequenceDiagram', viewSequenceDiagram);

    // context.subscriptions.push(sayHello);
    context.subscriptions.push(viewSequenceDiagramCommand, viewSequenceDiagram, registration);
    // context.subscriptions.push(renderSequenceDiagram, registration);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    vscode.window.showInformationMessage('deactivated');
}

exports.deactivate = deactivate;