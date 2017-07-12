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

    readOptions(row) {
        const jsonString = row.replace("//", "");
        const options = JSON.parse(jsonString);

        return options ? options : {type : "svg" };
    }

    render(content, callback) {

        var diagramRows = [];
        var options = { type: "svg" };
        
        var rows = content.split(/\r|\n/);
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i].replace(/^\s+|\s+$/g, '');
            if (row.startsWith("//"))
                options = this.readOptions(row);
            else
                diagramRows.push(row);
        }

        //save rows to temp file    
        const inputPath = this.saveFile("diagram.input", diagramRows);

        const binaryPath = 'D:\\Projects\\vscode_extension\\sdedit\\sdedit-4.2-beta8.jar';
        const outputPath = 'D:\\Projects\\vscode_extension\\sdedit\\tmpdiagram\\tmp.' + options.type;
        
        //java -jar sdedit-4.2-beta8.jar -o ./seq.bmp -t bmp ./sample.sd
        var child = spawn('java', ['-jar', binaryPath, '-o', outputPath, '-t', options.type, inputPath]);

        child.on('close', function (exitCode) {
            if (exitCode !== 0) {
                vscode.window.showErrorMessage('Sequence diagram renderer exit code: ' + exitCode);
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