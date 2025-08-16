
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

const daleChallWeight = 14;
const fleschKincaidWeight = 10;
const totalWeight = daleChallWeight + fleschKincaidWeight;

const vowelsByLanguage = {
    turkish: "euıioüaiö",
    english: "euoai",
    english2: "euoai",
    russian: "AЯOЁЮУЭЕИЫ"
}

exports.daleChall = function (language, text="") {
    if(text == "") return 0

    let wordlist = (FileManager.readFile(Path.join(cwd() ,"static_data", language + "_dale_chall"))).toString().split("\n")
    let lookupTable = {}
    for(let word of wordlist){
        lookupTable[word] = 1;
    }
   
    let tokens = text.toLowerCase().match(/\p{L}+/gu)|| [];

    let matchingTokenCount = 0
    for (let token of tokens){
        if(lookupTable[token.toLocaleLowerCase()] === 1) matchingTokenCount++;
    }

    return -daleChallWeight * 100 * (tokens.length - matchingTokenCount) / tokens.length / totalWeight
}

exports.fleschKincaid = function (language, text){
    let words = text.trim().split(/\s+/).filter(Boolean);
    let wordCount = words.length || 1;
    
    let sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(x => x.length > 3);
    let sentenceCount = sentences.length || 1;

    let sylabbles = text
    .toLowerCase()
    .split(new RegExp(`[${vowelsByLanguage[language]}]`, "g"))
    .map(s => s.trim())
    .filter(Boolean);
    let sylabbleCount = sylabbles.length || 1;

    let fleschReadability = ((206.835 - 1.025 * (wordCount / sentenceCount) - 84.6 * (sylabbleCount / wordCount))) * fleschKincaidWeight / totalWeight
    return fleschReadability
}