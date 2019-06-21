"use strict";

const ImportUtils = require("../helpers/import.js");

/**
 * 
 * @param {Object[]} data 
 * @returns {Object[]} - 
 */
function expandCECMajorData(data) {
    if(data === undefined || data == null) {
        return null;
    }

    var newDataArray = [];

    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i]["questions"].length; j++) {
            var temp = JSON.parse(JSON.stringify(data[i]));
            delete temp["questions"];

            for(var attr in data[i]["questions"][j]) {
                temp[attr] = data[i]["questions"][j][attr];
            }
            
            newDataArray.push(temp);
        }
    }

    return newDataArray;
}

/**
 * 
 * @param {*} filePath 
 * @returns {*} - 
 */
function expandCECMajorDataFromFile(filePath) {
    if (filePath === undefined || filePath == null || filePath == "") {
        console.log(">> ERROR: filePath must be defined");
        return null;
    }

    var cecMajorData = ImportUtils.getJSONPropertyContentsFromFile(filePath, "data");

    var expandedCECMajorData = expandCECMajorData(cecMajorData);

    return expandedCECMajorData;
}

/**
 * 
 * @param {*} filePath 
 * @param {*} exportFunction 
 * @returns {*} - 
 */
function exportExpandedCECMajorDataFromFile(filePath, exportFunction) {
    if (arguments.length < 2) {
        console.log(">> ERROR: filePath and exportFunction must be defined");
        return;
    }

    var expandedCECMajorData = expandCECMajorDataFromFile(filePath);

    exportFunction(Object.keys(expandedCECMajorData[0]), expandedCECMajorData);
}

module.exports = {
    expandCECMajorData,
    expandCECMajorDataFromFile,
    exportExpandedCECMajorDataFromFile
};