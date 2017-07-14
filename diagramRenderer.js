var spawn = require('child_process').spawn;
var fs = require('fs');
var os = require('os');
const path = require('path');

class diagramRenderer {
    constructor(){
        this.options = { previewType : "svg", threaded : false , errors: [] };
        this.rootPath = path.join(os.tmpdir(), "tmpdiagram");        
    }

    ensurePathExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    saveFile(fileName, rowArray) {        
        this.ensurePathExists(this.rootPath);        
        const filePath = `${this.rootPath}/${fileName}`;
        fs.writeFileSync(filePath, rowArray.join(os.EOL) , 'utf-8'); 
        return filePath;
    }

    readOptions(row) {      
        row = row.replace(/^\s+|\s+$/g,'');
        var keyvalue = /^#\s+\{\s*([\w]+)\s*:\s*([\w]+)\s*\}$/.exec(row);  // extracts directives as:  // {key:value}
        if (keyvalue != null && keyvalue.length == 3)
        {
            var key = keyvalue[1];
            var value = keyvalue[2];

            switch(key){
                    case "threaded":
                        if (/^(true|false)$/.test(value)){
                            //baseArgs.push('--threaded', value);
                        } else {
                            throw new Error("Error: invalid value for 'threaded'. Allowed values are: true, false.");
                        }                    
                    break;
                    case "exportType":
                        if (/^(ps|pdf|emf|svg|png|gif|jpg|bmp)$/.test(value)){                        
                        } else {
                            throw new Error("Error: invalid value for 'exportType'. Allowed values are: ps, pdf, emf, svg, png, gif, jpg, bmp.");
                        }                    
                    break;
                }

            this.options[key] = value;
        }
    }

    buildArgs(baseArgs, inputPath) {
        for (var property in this.options) {
            if (this.options.hasOwnProperty(property)) {                
                const value = this.options[property];
                switch(property){
                    case "threaded":
                        if (/^(true|false)$/.test(value)){
                            baseArgs.push('--threaded', value);
                        } else {
                            this.options.errors.push("Error: invalid value for 'threaded'. Allowed values are: true, false.");
                        }                    
                    break;
                    case "exportType":
                        if (/^(ps|pdf|emf|svg|png|gif|jpg|bmp)$/.test(value)){                        
                        } else {
                            this.options.errors.push("Error: invalid value for 'exportType'. Allowed values are: ps, pdf, emf, svg, png, gif, jpg, bmp.");
                        }                    
                    break;
                }
            }
        }

        baseArgs.push(inputPath);
        return baseArgs;
    }

    render(content, editorFile, callback) {

        var diagramRows = [];                
        var rows = content.split(/\r|\n/);
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i].replace(/^\s+|\s+$/g, '');
            if (row.startsWith("#"))
                this.readOptions(row);
            else
                diagramRows.push(row);
        }

        //save rows to temp file    
        const inputPath = this.saveFile("diagram.input", diagramRows);
        const binaryPath = path.join(__dirname, 'sdedit-4.2-beta8.jar');
        const outputPath = path.join(this.rootPath, 'tmp.' + this.options.previewType);
        
        if(this.options.exportType){
            var exportFileName = editorFile.replace(/\.[^.$]+$/, '.' + this.options.exportType);
            const baseArgs = this.buildArgs([ '-jar', binaryPath, '-o', exportFileName, '-t', this.options.exportType ], inputPath );            
            spawn('java', baseArgs);
        }

        const previewArgs = this.buildArgs(['-jar', binaryPath, '-o', outputPath, '-t', this.options.previewType], inputPath );
        var child = spawn('java', previewArgs);

        const self = this;
        child.on('close', function (exitCode) {
            if (exitCode !== 0) {                
                self.options.errors.push('Sequence diagram renderer exit code: ' + exitCode);                                
            } else {
                self.options.errors = [];                
            }
            
            const messages = self.options.errors.join('\n')
            fs.readFile(outputPath, "utf8", function(err, data) {                                                
                callback(data + messages);    
            });            
        });

        // If you’re really just passing it through, though, pass {stdio: 'inherit'}
        // to child_process.spawn instead.
        // child.stderr.on('data', function (data) {
        //     process.stderr.write(data);
        // });
        
        child.stdout.on('data', function (data) {                        
            self.options.errors.push( data.toString());
        });

        child.stderr.on('data', function (data) {            
             self.options.errors.push( data.toString());
        });
    }
}

module.exports = diagramRenderer;