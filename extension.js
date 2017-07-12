// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var spawn = require('child_process').spawn;

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
                                                                           
    var renderSequenceDiagram = vscode.commands.registerCommand('extension.renderSequenceDiagram', function () {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        //java -jar sdedit-4.2-beta8.jar -o ./seq.bmp -t bmp ./sample.sd
        var child = spawn('java', ['-jar', 'sdedit-4.2-beta8.jar', '-o', './tmp.bmp', 'D:\Projects\vscode_extension\sdedit\sample.sd']);
        
        child.on('close', function (exitCode) {
            if (exitCode !== 0) {
                console.error('Something went wrong!');
            }
        });

        // If you’re really just passing it through, though, pass {stdio: 'inherit'}
        // to child_process.spawn instead.
        child.stderr.on('data', function (data) {
            process.stderr.write(data);
        });

        // Display a message box to the user
        vscode.window.showInformationMessage('Diagram rendered');
    });

    context.subscriptions.push(sayHello);
    context.subscriptions.push(renderSequenceDiagram);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    vscode.window.showInformationMessage('deactivated');
}
exports.deactivate = deactivate;