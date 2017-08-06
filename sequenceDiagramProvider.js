var vscode = require('vscode');
var diagramRenderer = require('./diagramRenderer');


class sequenceDiagramProvider{

    constructor () {
            this._onDidChange = new vscode.EventEmitter();
            // this.diagram = "";
            // this.errors = "";
            // this.status = "";
            this.content = "";
    }

    provideTextDocumentContent (uri, token) {
        var editor = vscode.window.activeTextEditor;
                if (editor)
                    editor.show();
            
        const html = `<!DOCTYPE html><html>
        <head>
        <style>
       /* The alert message box */
        .error {
        padding: 20px;
        /* background-color: #f44336;  
         color: white;*/
        color: #D8000C;
        background-color: #FFBABA;
        margin-bottom: 15px;
        }

        .loader {
        border: 2px solid #f3f3f3; /* Light grey */
        border-top: 2px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 12px;
        height: 12px;
        animation: spin 2s linear infinite;        
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
        </head>
        <body style="background-color:white;">
            ${this.content}                        
        </body>
        </html>`;
        return html;
    }

    provide(uri){    
        var editor = vscode.window.activeTextEditor;
        if (!editor) {            
            return; // No open text editor
        }

        if(editor.document.languageId !== "sd"){
            return;
        }

        const fileText = editor.document.getText();
        const editorFileName = editor.document.fileName;
        const renderer = new diagramRenderer();
       
        const self = this;
         function diagramRendered({ diagram, errors, status }){            
            
            self.content = "";
            if(diagram){
                self.content += `<div>${diagram}</div>`;            
            } 
           
            if(errors){  
                if(errors.length > 0)                 
                self.content += `<div class="error">${errors}</div>`;
            }

            if(status){
                self.content += `<div>`; 
                 if(!diagram && !errors){
                    self.content += `<div class="loader"></div>`;
                } 
                self.content += `${status}</div>`;
            }

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