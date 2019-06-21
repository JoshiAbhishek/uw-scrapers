"use strict";

const ImportUtils = require("../helpers/import.js");

/**
 * Expands evaluations of a major's courses by evaluation question
 * @param {Object[]} data - The CEC data of a major to be expanded by evaluation questions
 * @returns {Object[]} - The expanded CEC data 
 */
function expandCECMajorData(data) {
    if (data === undefined || data == null) {
        return null;
    }

    var newDataArray = [];

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]["questions"].length; j++) {
            var temp = JSON.parse(JSON.stringify(data[i]));
            delete temp["questions"];

            for (var attr in data[i]["questions"][j]) {
                temp[attr] = data[i]["questions"][j][attr];
            }

            newDataArray.push(temp);
        }
    }

    return newDataArray;
}

/**
 * Expands evaluations of a major's courses by evaluation question from a file
 * @param {String} filePath - The file path of a JSON file with scraped UW CEC data
 * @returns {Object[]} - The expanded CEC data 
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
 * Exports expanded UW CEC Major data
 * @param {String} filePath - The file path of a JSON file with scraped UW CEC data
 * @param {Function} exportFunction - The function to callback with parsed UW CEC data 
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