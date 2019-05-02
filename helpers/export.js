"use strict";

const fs = require('fs');

/**
 * 
 * @param {*} data_directory 
 * @param {*} file_name 
 * @param {*} data 
 */
function exportJSONObject(data_directory, file_name, data) {
    if(!file_name.endsWith(".json")) {
        file_name += ".json";
    }

    var url = data_directory + file_name;

    console.log("> Exporting to " + url);

    var json = JSON.stringify(data);
    fs.writeFileSync(url, json, 'utf8');
}

/**
 * 
 * @param {*} data_directory 
 * @param {*} file_name 
 * @param {*} property_name 
 * @param {*} data 
 */
function exportJSONArray(data_directory, file_name, property_name, data) {
    if(!file_name.endsWith(".json")) {
        file_name += ".json";
    }

    var url = data_directory + file_name;

    console.log("> Exporting to " + url);

    var json = JSON.stringify({[property_name] : data});
    fs.writeFileSync(url, json, 'utf8');
}

/**
 * 
 * @param {*} data_directory 
 * @param {*} file_name 
 * @param {*} headers_array 
 * @param {*} data 
 */
function exportJSONArrayToCSV(data_directory, file_name, headers_array, data) {
    if(!file_name.endsWith(".json")) {
        file_name += ".json";
    }
    
    var url = data_directory + file_name;
    
    console.log("> Exporting to " + url);

    
}

module.exports = {
    exportJSONObject,
    exportJSONArray,
    exportJSONArrayToCSV
};