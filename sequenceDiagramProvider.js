
class sequenceDiagramProvider{

provideTextDocumentContent (uri, token) {
    return "dabaa";
}

    load(uri){
        console.log("lodaa");
    }

    update(uri){
        console.log("updaa");
    }

    get onDidChange () { }

}

module.exports = sequenceDiagramProvider; 

