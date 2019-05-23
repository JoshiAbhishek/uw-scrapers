"use strict";

const FS = require('fs');

/**
 * Forms the final URL to export data to
 * @param {String} dataDirectory - The file directory to export data to
 * @param {String} fileName - The name of the file to be exported
 * @param {Object} data - The data to be exported
 * @returns {String} - The local url of the file to be exported 
 */
function exportFoundation(dataDirectory, fileName, data) {
    if (data === undefined || data == null) {
        console.log(">> ERROR: data must be defined and not null to export");
        return null;
    }

    if (dataDirectory === undefined || dataDirectory == null || fileName === undefined || fileName == null) {
        console.log(">> ERROR: dataDirectory and fileName must be defined and not null to export");
        return null;
    }

    if (!fileName.endsWith(".json")) {
        fileName += ".json";
    }

    var url = dataDirectory + fileName;

    if(url != null) {
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
    var url = exportFoundation(dataDirectory, fileName, data);
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
    var url = exportFoundation(dataDirectory, fileName, data);
    if (url == null) { return; }

    var json = JSON.stringify({ [propertyName]: data });
    FS.writeFileSync(url, json, 'utf8');
}

/**
 * Exports an array to the file system as a CSV file
 * @param {String} dataDirectory - The file directory to export data to
 * @param {String} fileName - The name of the file to be exported
 * @param {String[]} headersArray - The headers corresponding to the data's properties
 * @param {Object[]} data - The data to be exported
 */
function exportJSONArrayToCSV(dataDirectory, fileName, headersArray, data) {
    var url = exportFoundation(dataDirectory, fileName, data);
    if (url == null) { return; }

    
}

module.exports = {
    exportJSONObject,
    exportJSONArray,
    exportJSONArrayToCSV
};