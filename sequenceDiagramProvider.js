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
            
        const html = `<!DOCTYPE html><html>
        <head>
        </head>
        <body style="background-color:white">
            <div style="background-color:white">
                ${this.diagram}
            </div>
        </body>
        </html>`;
        return html;
    }

    load(uri){
        console.log("lodaa");
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const fileText = editor.document.getText();
        const renderer = new diagramRenderer();
       
        const self = this;
         function diagramRendered(contents){            
            self.diagram = contents;
            self._onDidChange.fire(uri);    
        }

        renderer.render(fileText, diagramRendered);
        //this.diagram = "rendering...";
       // this._onDidChange.fire(uri);
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

