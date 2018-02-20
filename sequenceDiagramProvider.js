var vscode = require('vscode');
var diagramRenderer = require('./diagramRenderer');


class sequenceDiagramProvider{

    constructor () {
            this._onDidChange = new vscode.EventEmitter();
            // this.diagram = "";
            // this.errors = "";
            // this.status = "";
            this.content = "";
            this.panZoomScript = "";
    }

    provideTextDocumentContent (uri, token) {
        var editor = vscode.window.activeTextEditor;
                if (editor)
                    editor.show();
                    // <script type="text/javascript" src="./node_modules/svg-pan-zoom/dist/svg-pan-zoom.js"></script>
 
        const html = `<!DOCTYPE html><html>
        <head>        
        <script src="http://ariutta.github.io/svg-pan-zoom/dist/svg-pan-zoom.min.js"></script>
        <script>
        ${this.panZoomScript}
        </script>
        <script>
            function initialise(){
               // console.log("init");
                var svg = document.getElementsByTagName("svg")[0];
                //console.log(svg);
                svgPanZoom(svg, {
                    zoomEnabled: true,
                    controlIconsEnabled: true,
                    fit: true,
                    center: true});
            }
        </script>
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

        #diagramView {
            width: 99%;
            width: 99vw;
            height: 99%;
            height: 99vh;                        
        }

        #svgDiagram {        
            width: 100%;
            height: 100%;
            position:fixed; 
          
        }

        </style>
        </head>
        <body style="background-color:white;" onload="initialise()">          
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
         function diagramRendered({ diagram, errors, status, panZoomScript }){            
            
            self.content = "";
            
            if(panZoomScript){
                self.panZoomScript = panZoomScript.toString();
            }

            if(diagram){
                diagram = diagram.replace(/<svg[^]+?>/img, '<svg id="svgDiagram" viewBox="0 0 713 791">');
                self.content += diagram;
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