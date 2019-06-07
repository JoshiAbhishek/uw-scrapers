"use strict";

const FS = require('fs');

/**
 * Returns an array of file paths to JSON files in a given folder
 * @param {String} folderPath - The file path of the folder with JSON files to import
 * @returns {String[]} - A String array of the file paths to JSON files in the given folder
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
 * Returns the value of a property in a JSON file
 * @param {String} filePath - The file path of the JSON file to import
 * @param {String} propertyName - The name of the property the data to import is assigned to
 * @returns {*} - Returns the Object or Array (of any type) that is the value of the given property in the JSON file
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