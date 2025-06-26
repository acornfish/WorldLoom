exports.LogManager = class {
    static debugMode = true;
    
    static log(text){
        console.log(text)
    }

    static error(text){
        if(!this.debugMode) return
        console.log(text)
    }
}