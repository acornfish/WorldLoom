const {
    QuillDeltaToHtmlConverter
} = require("quill-delta-to-html")
const {LogManager} = require("./LogManager")

class EncodingsManager{
    static deltaToHTMLConfig = {}

    static encodeScene(scene, synopsis, notes) {
        const encoder = new TextEncoder();
    
        const sceneBytes = encoder.encode(scene);
        const synopsisBytes = encoder.encode(synopsis);
        const notesBytes = encoder.encode(notes);
    
        const headerBytes = new Uint8Array(12);
        headerBytes.set([
            sceneBytes.length >> 24, (sceneBytes.length >> 16) & 0xFF, (sceneBytes.length >> 8) & 0xFF, sceneBytes
            .length & 0xFF,
            synopsisBytes.length >> 24, (synopsisBytes.length >> 16) & 0xFF, (synopsisBytes.length >> 8) & 0xFF,
            synopsisBytes.length & 0xFF,
            notesBytes.length >> 24, (notesBytes.length >> 16) & 0xFF, (notesBytes.length >> 8) & 0xFF, notesBytes
            .length & 0xFF,
        ]);
    
        const fileData = new Uint8Array(headerBytes.length + sceneBytes.length + synopsisBytes.length + notesBytes.length);
        fileData.set(headerBytes);
        fileData.set(sceneBytes, headerBytes.length);
        fileData.set(synopsisBytes, headerBytes.length + sceneBytes.length);
        fileData.set(notesBytes, headerBytes.length + sceneBytes.length + synopsisBytes.length);
    
        return fileData;
    }
    
    static parseScene(fileData) {
        const dataView = new DataView(fileData);
    
        const sceneLength = dataView.getUint32(0);
        const synopsisLength = dataView.getUint32(4);
        const notesLength = dataView.getUint32(8);
    
        const sceneOffset = 12;
        const synopsisOffset = sceneOffset + sceneLength;
        const notesOffset = synopsisOffset + synopsisLength;
    
        const decoder = new TextDecoder();
    
        const scene = decoder.decode(fileData.slice(sceneOffset, sceneOffset + sceneLength));
        const synopsis = decoder.decode(fileData.slice(synopsisOffset, synopsisOffset + synopsisLength));
        const notes = decoder.decode(fileData.slice(notesOffset, notesOffset + notesLength));
    
        return {
            scene,
            synopsis,
            notes
        };
    }

    static convertDeltaToHTML(delta) {
        return (new QuillDeltaToHtmlConverter(delta["ops"], deltaToHTMLConfig)).convert()
    }
    
}

exports.EncodingsManager = EncodingsManager

