var vscode = require('vscode');
var spawn = require('child_process').spawn;
var fs = require('fs');
const path = require('path');

class diagramRenderer {

    ensurePathExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    saveFile(fileName, rowArray) {
        const rootPath = `${__dirname}/tmpdiagram`;        
        this.ensurePathExists(rootPath);        
        const filePath = `${rootPath}/${fileName}`;
        fs.writeFileSync(filePath, rowArray.join('\n') , 'utf-8'); 
        return filePath;
    }

    readOptions(row, options) {
        // const jsonString = row.replace("//", "");
        // const options = JSON.parse(jsonString);

        // return options ? options : {type : "svg" };
        row = row.replace(/^\s+|\s+$/g,'');
        var keyvalue = /^\/\/\s+\{\s*([\w]+)\s*:\s*([\w]+)\s*\}$/.exec(row);  // extracts directives as:  // {key:value}
        if (keyvalue != null && keyvalue.length == 3)
        {
            var key = keyvalue[1];
            var value = keyvalue[2];

            options[key] = value;
        }
    }

    buildArgs(baseArgs, options, inputPath) {
        for (var property in options) {
            if (options.hasOwnProperty(property)) {                
                switch(property){
                    case "threaded":
                    if (/^(true|false)$/.test(value)){
                        baseArgs.push('--threaded');
                        baseArgs.push(options[property]);
                    } else {
                        options.error = "Error: invalid value for 'threaded'. Allowed values are: true, false.";
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
        var options = { previewType : "svg", threaded : false };
        
        var rows = content.split(/\r|\n/);
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i].replace(/^\s+|\s+$/g, '');
            if (row.startsWith("//"))
                this.readOptions(row, options);
            else
                diagramRows.push(row);
        }

        //save rows to temp file    
        const inputPath = this.saveFile("diagram.input", diagramRows);

        const binaryPath = 'D:\\Projects\\vscode_extension\\sdedit\\sdedit-4.2-beta8.jar';
        const outputPath = 'D:\\Projects\\vscode_extension\\sdedit\\tmpdiagram\\tmp.' + options.previewType;
        
        if(options.exportType){
            var exportFileName = editorFile.replace(/\.[^.$]+$/, '.' + options.exportType);
            const baseArgs = this.buildArgs([ '-jar', binaryPath, '-o', exportFileName, '-t', options.exportType ], 
                            options, inputPath );
            // ['-jar', binaryPath, '-o', exportFileName, '-t', options.exportType, inputPath]
            spawn('java', baseArgs);
        }

        const previewArgs = this.buildArgs(['-jar', binaryPath, '-o', outputPath, '-t', options.previewType], options, inputPath );
        var child = spawn('java', previewArgs);


        child.on('close', function (exitCode) {
            if (exitCode !== 0) {                
                console.log('Sequence diagram renderer exit code: ' + exitCode);
            }
            fs.readFile(outputPath, "utf8", function(err, data) {
                callback("rendered code: " + exitCode + data);    
            });            
        });

        // If you’re really just passing it through, though, pass {stdio: 'inherit'}
        // to child_process.spawn instead.
        // child.stderr.on('data', function (data) {
        //     process.stderr.write(data);
        // });

        child.stdout.on('data', function (data) {
            console.log("IM HERE");
            console.log('data' + data);
        });

        child.stderr.on('data', function (data) {
            console.log("IM HERE - Error");
            console.log('test: ' + data);
        });
    }
}

module.exports = diagramRenderer;