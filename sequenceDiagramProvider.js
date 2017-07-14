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

    provide(uri){
    
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        if(editor.document.languageId !== 'sd'){
            return;
        }

        const fileText = editor.document.getText();
        const editorFileName = editor.document.fileName;
        const renderer = new diagramRenderer();
       
        const self = this;
         function diagramRendered(contents){            
            self.diagram = contents;
            self._onDidChange.fire(uri);    
        }

        try{
        renderer.render(fileText, editorFileName, diagramRendered);        
        } catch(e){
            vscode.window.showErrorMessage(e.message);
        }
    }

    get onDidChange () { 
        return this._onDidChange.event;
    }

}

module.exports = sequenceDiagramProvider; 

