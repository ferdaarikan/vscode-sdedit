var vscode = require('vscode');
var diagramRenderer = require('./diagramRenderer');


class sequenceDiagramProvider{

    constructor () {
            this._onDidChange = new vscode.EventEmitter();
            this.diagram = "";
    }

provideTextDocumentContent (uri, token) {
     var editor = vscode.window.activeTextEditor;
            if (editor)
                editor.show();


    return this.diagram;
}

    load(uri){
        console.log("lodaa");
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const fileText = editor.document.getText();
        const renderer = new diagramRenderer();
        renderer.render(fileText);

        this.diagram = "processYumlDocument(text, filename, false);";

        this._onDidChange.fire(uri);
    }

    update(uri){
        console.log("updaa");
        this.diagram = "zopa" ;
        this._onDidChange.fire(uri);
    }

    get onDidChange () { 
        return this._onDidChange.event;
    }

}

module.exports = sequenceDiagramProvider; 

