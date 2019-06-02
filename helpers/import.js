"use strict";

const FS = require('fs');

/**
 * 
 * @param {*} folderPath 
 * @returns {*} - 
 */
function getFileNamesInFolder(folderPath) {
    if(folderPath === undefined || folderPath == null || folderPath == "") {
        console.log(">> ERROR: folderPath must be defined");
        return null;
    }

    var fileNames = FS.readdirSync(folderPath);

    return fileNames;
}

/**
 * 
 * @param {*} filePath 
 * @param {*} propertyName 
 * @returns {*} - 
 */
function getJSONPropertyContentsFromFile(filePath, propertyName) {
    if(filePath === undefined || filePath == null || filePath == "") {
        console.log(">> ERROR: filePath must be defined");
        return null;
    }

    if(propertyName === undefined || propertyName == null) {
        console.log(">> ERROR: propertyName must be defined");
        return null;
    }

    if(filePath.endsWith(".json")) {
        filePath.replace(".json", "");
    }
    else {
        console.log(">> ERROR: file must be in json format");
        return null;
    }
    
    var jsonObject = require(filePath);

    return jsonObject[propertyName];
}

module.exports = {
    getFileNamesInFolder,
    getJSONPropertyContentsFromFile
};