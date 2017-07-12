// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var spawn = require('child_process').spawn;
var sequenceDiagramProvider = require('./sequenceDiagramProvider');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sdedit" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var sayHello = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    const previewUri = vscode.Uri.parse('vscode-sdedit://authority/vscode-sdedit');

    var renderSequenceDiagram = vscode.commands.registerCommand('extension.renderSequenceDiagram', function () {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const fileText = editor.document.getText();
        console.log(fileText);
        

        //java -jar sdedit-4.2-beta8.jar -o ./seq.bmp -t bmp ./sample.sd
        // var child = spawn('java', ['-jar', 'D:\\Projects\\vscode_extension\\sdedit\\sdedit-4.2-beta8.jar', '-o', 
        //     'D:\\Projects\\vscode_extension\\sdedit\\tmp.bmp', 'D:\\Projects\\vscode_extension\\sdedit\\sample.sd']);
        
        // child.on('close', function (exitCode) {
        //     if (exitCode !== 0) {                
        //         vscode.window.showErrorMessage('Sequence diagram renderer exit code: ' + exitCode);
        //     }
        // });

        // If you’re really just passing it through, though, pass {stdio: 'inherit'}
        // to child_process.spawn instead.
        // child.stderr.on('data', function (data) {
        //     process.stderr.write(data);
        // });

        // child.stdout.on('data', function (data) {
        //     console.log("IM HERE");
        //     console.log('data' + data);
        // });

        // child.stderr.on('data', function (data) {
        //     console.log("IM HERE - Error");
        //     console.log('test: ' + data);
        // });
 
    var disp = vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two).then(
            (success) => { provider.load(previewUri); },
            (reason) => { vscode.window.showErrorMessage(reason); });
    return disp;

        // Display a message box to the user
        // vscode.window.showInformationMessage('Diagram rendered');
    });

     function load(uri){
         console.log('loading ', uri);
         return "preview here";
     }

    let provider = new sequenceDiagramProvider();
    let registration = vscode.workspace.registerTextDocumentContentProvider('vscode-yuml', provider);


    vscode.workspace.onDidSaveTextDocument((e) => { provider.load(previewUri); });
    vscode.workspace.onDidOpenTextDocument((e) => { provider.load(previewUri); });
    vscode.window.onDidChangeActiveTextEditor((e) => { provider.load(previewUri); });

    context.subscriptions.push(sayHello);
    context.subscriptions.push(renderSequenceDiagram, registration);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    vscode.window.showInformationMessage('deactivated');
}
exports.deactivate = deactivate;