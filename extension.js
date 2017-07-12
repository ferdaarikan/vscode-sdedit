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
                provider.load(previewUri); 
            },
            (reason) => { 
                vscode.window.showErrorMessage(reason); 
            });
    return disp;
    }

    viewSequenceDiagram();

    vscode.workspace.onDidSaveTextDocument((e) => { provider.load(previewUri); });
    vscode.workspace.onDidOpenTextDocument((e) => { provider.load(previewUri); });
    vscode.window.onDidChangeActiveTextEditor((e) => { provider.load(previewUri); });


    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var sayHello = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    var viewSequenceDiagramCommand = vscode.commands.registerCommand('extension.viewSequenceDiagram', viewSequenceDiagram);

    var renderSequenceDiagram = vscode.commands.registerCommand('extension.renderSequenceDiagram', function () {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const fileText = editor.document.getText();
        console.log(fileText);

        // Display a message box to the user
        // vscode.window.showInformationMessage('Diagram rendered');
    }); 

    context.subscriptions.push(sayHello);
    context.subscriptions.push(viewSequenceDiagramCommand, viewSequenceDiagram);
    context.subscriptions.push(renderSequenceDiagram, registration);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    vscode.window.showInformationMessage('deactivated');
}
exports.deactivate = deactivate;