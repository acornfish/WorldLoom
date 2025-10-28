
/*
    Worldloom
    Copyright (C) 2025 Ege Açıkgöz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/    


const { FileManager } = require("./FileManager")
const Path = require("path")
const {cwd} = require("process")

const vowelsByLanguage = {
    turkish: "euıioüaiö",
    english: "euoai",
    english2: "euoai",
    russian: "AЯOЁЮУЭЕИЫ"
}
let last_language = ""
let dale_chall_list = []
let agglutinative_list = ""

exports.daleChall = function (language, text="") {
    if(text == "") return 0
    if(language == "turkish") return 50
    if(language != last_language){
        dale_chall_list = (FileManager.readFile(Path.join(cwd() ,"static_data", language + "_dale_chall"))).toString().split("\n")
        agglutinative_list = (FileManager.readFile(Path.join(cwd() ,"static_data", language + "_suffixes"))).toString()
        
        last_language = language
    }

    let wordlist = dale_chall_list
    let lookupTable = {}
    for(let word of wordlist){
        lookupTable[word] = 1;
    }
   
    let tokens = text.toLowerCase().match(/\p{L}+/gu)|| [];
    let words = text.trim().split(/[\s.()[\]{}\\/]+/).filter(Boolean);
    let wordCount = words.length || 1;

    let easyWords = 0
    for (let token of tokens){
        if(lookupTable[token.toLocaleLowerCase()] === 1) easyWords++;
    }

    /*console.log(`
        Word: ${wordCount},
        Easy: ${easyWords}
    `)*/

    return 100 * (easyWords / wordCount)
}

exports.fleschKincaid = function (language, text){
    let words = text.trim().split(/\s+/).filter(Boolean);
    let wordCount = words.length || 1;
    
    let sentences = text
      .split(/[.!?\n]+/)
      .map(s => s.trim())
      .filter(x => x.length > 3);
    let sentenceCount = sentences.length || 1;

    let sylabbles = text
    .toLowerCase()
    .split(new RegExp(`[${vowelsByLanguage[language]}]`, "g"))
    .map(s => s.trim())
    .filter(Boolean);
    let sylabbleCount = sylabbles.length || 1;

    let wordsPerSentence = (wordCount / sentenceCount)
    let syllablePerWord = sylabbleCount / wordCount

    /*console.log(`
        Sentence: ${sentenceCount},
        Sylabble: ${sylabbleCount},
        Word: ${wordCount},
        WordPerSentence: ${wordsPerSentence},
        SyllablePerWord: ${syllablePerWord}
    `)*/

    let fleschReadability = 206.835 - (1.015 * wordsPerSentence) - (84.6 * (syllablePerWord))
    return fleschReadability
}


//stemmers
/**
 * 
 * @param {string} word 
 * @param {string} language 
 * @returns 
 */
function stemAgglutinative(word, language) {
    let wordlist = agglutinative_list

    if(wordlist == ""){
        //not agglutinative
        return word
    }

    let suffixes = wordlist.split("\n");   
    let lastInd = word.length-1;
    for(let i = word.length-1;i>=0;i++){
        if(lastInd - i > 4){
            break;
        }

        if(suffixes.includes(word.slice(i, word))){
            lastInd = i;
        }
    }

    console.log(word)
    return word;
  }