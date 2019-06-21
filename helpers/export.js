"use strict";

const FS = require('fs');

/**
 * Forms the final URL to export data to
 * @param {String} dataDirectory - The file directory to export data to
 * @param {String} fileName - The name of the file to be exported
 * @param {Object} data - The data to be exported
 * @param {String} fileExtension - The extension of the file to be exported
 * @returns {String} - The local url of the file to be exported 
 */
function exportFoundation(dataDirectory, fileName, data, fileExtension) {
    if (data === undefined || data == null) {
        console.log(">> ERROR: data must be defined and not null to export");
        return null;
    }

    if (data === fileExtension || data == fileExtension) {
        console.log(">> ERROR: fileExtension must be defined and not null to export");
        return null;
    }

    if (dataDirectory === undefined || dataDirectory == null || fileName === undefined || fileName == null) {
        console.log(">> ERROR: dataDirectory and fileName must be defined and not null to export");
        return null;
    }

    if (!fileName.endsWith(fileExtension)) {
        fileName += fileExtension;
    }

    var url = dataDirectory + fileName;

    if (url != null) {
        console.log("> Exporting to " + url);
    }

    return url;
}

/**
 * Exports an object to the file system as a JSON file
 * @param {String} dataDirectory - The file directory to export data to
 * @param {String} fileName - The name of the file to be exported
 * @param {Object} data - The data to be exported
 */
function exportJSONObject(dataDirectory, fileName, data) {
    var url = exportFoundation(dataDirectory, fileName, data, ".json");
    if (url == null) { return; }

    var json = JSON.stringify(data);
    FS.writeFileSync(url, json, 'utf8');
}

/**
 * Exports an array of objects to the file system as a JSON file
 * @param {String} dataDirectory - The file directory to export data to
 * @param {String} fileName - The name of the file to be exported
 * @param {String} propertyName - The name of the property the exported data will be assigned to
 * @param {Object[]} data - The data to be exported
 */
function exportJSONArray(dataDirectory, fileName, propertyName, data) {
    var url = exportFoundation(dataDirectory, fileName, data, ".json");
    if (url == null) { return; }

    var json = JSON.stringify({ [propertyName]: data });
    FS.writeFileSync(url, json, 'utf8');
}

/**
 * Creates a delimited string representation of an array of objects
 * @param {*} headersArray - The properties of objects in the array to be represented as columns
 * @param {*} data - The data to be exported
 * @param {*} delimiter - The delimiter to be used for each row of data values
 * @returns {String} - A delimited string representation of the given data
 */
function convertDataToDelimitedString(headersArray, data, delimiter) {
    var result = headersArray.join(delimiter) + "\n";

    data.forEach(function (obj) {
        headersArray.forEach(function (k, ix) {
            if (ix) result += delimiter;
            result += obj[k];
        });
        result += "\n";
    });

    return result;
}

/**
 * Exports an array to the file system as a CSV file
 * @param {String} dataDirectory - The file directory to export data to
 * @param {String} fileName - The name of the file to be exported
 * @param {String[]} headersArray - The headers corresponding to the data's properties
 * @param {Object[]} data - The data to be exported
 */
function exportJSONArrayToCSV(dataDirectory, fileName, headersArray, data) {
    var url = exportFoundation(dataDirectory, fileName, data, ".csv");
    if (url == null) { return; }

    var delimitedString = convertDataToDelimitedString(headersArray, data, ",");

    FS.writeFileSync(url, delimitedString, 'utf8');
}

/**
 * Exports an array to the file system as a TSV file
 * @param {String} dataDirectory - The file directory to export data to
 * @param {String} fileName - The name of the file to be exported
 * @param {String[]} headersArray - The headers corresponding to the data's properties
 * @param {Object[]} data - The data to be exported
 */
function exportJSONArrayToTSV(dataDirectory, fileName, headersArray, data) {
    var url = exportFoundation(dataDirectory, fileName, data, ".csv");
    if (url == null) { return; }

    var delimitedString = convertDataToDelimitedString(headersArray, data, "\t");

    FS.writeFileSync(url, delimitedString, 'utf8');
}

module.exports = {
    exportJSONObject,
    exportJSONArray,
    convertDataToDelimitedString,
    exportJSONArrayToCSV,
    exportJSONArrayToTSV
};