"use strict";

const ProgressBar = require('progress');

const ImportUtils = require("../helpers/import.js");
const ParserUtils = require("../helpers/parser.js");
const TimeUtils = require("../helpers/time.js");

/**
 * Maps scraped UW Time Schedule data by building, room, and day of the week
 * @param {String} folderPath - The file path of the folder with scraped UW Time Schedule data exported to JSON files
 * @returns {Object} - An object mapping UW Time Schedule data by building, room, and day of the week
 */
function mapTimeScheduleDataToLocationFromFolder(folderPath) {
    if (folderPath === undefined || folderPath == null || folderPath == "") {
        console.log(">> ERROR: folderPath must be defined");
        return null;
    }

    var finalTSLocationMapObject = {};

    var fileNames = ImportUtils.getFileNamesInFolder(folderPath);

    var bar = new ProgressBar(':bar :current/:total', {
        total: fileNames.length
    });

    for (let i = 0; i < fileNames.length; i++) {
        bar.tick();

        var timeScheduleData = ImportUtils.getJSONPropertyContentsFromFile(folderPath + fileNames[i], "data");

        finalTSLocationMapObject = mapTimeScheduleDataToLocation(timeScheduleData, finalTSLocationMapObject);
    }

    return finalTSLocationMapObject;
}

/**
 * Exports mapped UW Time Schedule data
 * @param {String} folderPath - The file path of the folder with scraped UW Time Schedule data exported to JSON files
 * @param {Function} exportFunction - The function to callback with mapped UW Time Schedule data 
 */
function exportTimeScheduleDataMappedToLocationFromFolder(folderPath, exportFunction) {
    if (arguments.length < 2) {
        console.log(">> ERROR: folderPath and exportFunction must be defined");
        return;
    }

    var timeScheduleMapObject = mapTimeScheduleDataToLocationFromFolder(folderPath);

    exportFunction(timeScheduleMapObject);
}

/**
 * Maps scraped UW Time Schedule data by building, room, and day of the week
 * @param {String} filePath - The file path of a JSON file with scraped UW Time Schedule data
 * @returns {Object} - A object mapping UW Time Schedule data by building, room, and day of the week
 */
function mapTimeScheduleDataToLocationFromFile(filePath) {
    if (filePath === undefined || filePath == null || filePath == "") {
        console.log(">> ERROR: filePath must be defined");
        return null;
    }

    var timeScheduleData = ImportUtils.getJSONPropertyContentsFromFile(filePath, "data");

    var finalTSLocationMapObject = mapTimeScheduleDataToLocation(timeScheduleData, {});

    return finalTSLocationMapObject;
}

/**
 * Exports mapped UW Time Schedule data
 * @param {String} filePath - The file path of a JSON file with scraped UW Time Schedule data
 * @param {Function} exportFunction - The function to callback with mapped UW Time Schedule data 
 */
function exportTimeScheduleDataMappedToLocationFromFile(filePath, exportFunction) {
    if (arguments.length < 2) {
        console.log(">> ERROR: filePath and exportFunction must be defined");
        return;
    }

    var timeScheduleMapObject = mapTimeScheduleDataToLocationFromFile(filePath);

    exportFunction(timeScheduleMapObject);
}

/**
 * Maps scraped UW Time Schedule data by building, room, and day of the week
 * @param {Object[]} timeScheduleData - Scrapped UW Time Schedule data to map
 * @param {Object} finalObject - The object to add mapped UW Time Schedule data by building alias
 * @returns {Object} - An object mapping UW Time Schedule data by building, room, and day of the week
 */
function mapTimeScheduleDataToLocation(timeScheduleData, finalObject) {
    if (timeScheduleData === undefined || timeScheduleData == null) {
        return null;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }
    
    for (let i = 0; i < timeScheduleData.length; i++) {
        var expandedObjects = ParserUtils.getExpandedObjectsArrayFromRelatedArrayProperties(timeScheduleData[i], ["time", "location", "instructor"]);

        for (let j = 0; j < expandedObjects.length; j++) {
            if (expandedObjects[j]["location"] === undefined || expandedObjects[j]["time"] === undefined || expandedObjects[j]["location"] == null || expandedObjects[j]["time"] == null || expandedObjects[j]["location"].length < 1 || expandedObjects[j]["time"].length < 1) {
                continue;
            }

            var locationSplit = expandedObjects[j]["location"].split(" ");

            if (locationSplit == null || locationSplit.length < 2) {
                console.log("");
                console.log(">> Could not parse location information for course: ");
                console.log(timeScheduleData[i]);
                console.log("");

                break;
            }

            var building = locationSplit[0];
            var room = locationSplit[1];

            if (!finalObject.hasOwnProperty(building)) {
                finalObject[building] = {};
            }

            if (!finalObject[building].hasOwnProperty(room)) {
                finalObject[building][room] = {};
            }

            var objectsByDay = TimeUtils.createArrayOfDayAndTimeObjectsFromTemplate(expandedObjects[j]["time"], expandedObjects[j]);

            if (objectsByDay == null) {
                continue;
            }

            for (let k = 0; k < objectsByDay.length; k++) {
                var day = objectsByDay[k]["day"];
                delete objectsByDay[k]["day"];

                if (!finalObject[building][room].hasOwnProperty(day)) {
                    finalObject[building][room][day] = [];

                    finalObject[building][room][day].push(formatTimeScheduleCourseForLocationMap(objectsByDay[k]));
                }
                else {
                    var originalDayArrayLength = finalObject[building][room][day].length;

                    var duplicateStartOrEndTime = false;

                    for (let l = 0; l < originalDayArrayLength; l++) {
                        if (finalObject[building][room][day][l]["startTime"] == objectsByDay[k]["startTime"] || finalObject[building][room][day][l]["endTime"] == objectsByDay[k]["endTime"]) {
                            duplicateStartOrEndTime = true;
                            break;
                        }
                    }

                    if (!duplicateStartOrEndTime) {
                        finalObject[building][room][day].push(formatTimeScheduleCourseForLocationMap(objectsByDay[k]));
                    }
                }
            }
        }
    }

    return finalObject;
}

/**
 * Selects UW Time Schedule course properties to add to the mapped data
 * @param {Object} course - A scrapped UW Time Schedule course
 * @returns {Object} - The given UW Time Schedule course with specific properties
 */
function formatTimeScheduleCourseForLocationMap(course) {
    var temp = {};

    temp["sln"] = course["sln"];
    temp["alias"] = course["alias"];
    temp["title"] = course["title"];
    temp["startTime"] = course["startTime"];
    temp["endTime"] = course["endTime"];
    temp["catalogURL"] = course["catalogURL"];

    return temp;
}

module.exports = {
    mapTimeScheduleDataToLocationFromFolder,
    mapTimeScheduleDataToLocationFromFile,
    mapTimeScheduleDataToLocation,
    exportTimeScheduleDataMappedToLocationFromFolder,
    exportTimeScheduleDataMappedToLocationFromFile,
    formatTimeScheduleCourseForLocationMap
};