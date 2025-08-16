
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