"use strict";

const ImportUtils = require("../helpers/import.js");
const ParserUtils = require("../helpers/parser.js");
const TimeUtils = require("../helpers/time.js");

/**
 * 
 * @param {*} folderPath 
 * @returns {*} - 
 */
function mapTimeScheduleDataToLocationFromFolder(folderPath) {
    if (folderPath === undefined || folderPath == null || folderPath == "") {
        console.log(">> ERROR: folderPath must be defined");
        return null;
    }

    var finalTSLocationMapObject = {};

    var fileNames = ImportUtils.getFileNamesInFolder(folderPath);

    for (let i = 0; i < fileNames.length; i++) {
        var timeScheduleData = ImportUtils.getJSONPropertyContentsFromFile(fileNames[i], "data");

        finalTSLocationMapObject = mapTimeScheduleDataToLocation(timeScheduleData, finalTSLocationMapObject);
    }

    return finalTSLocationMapObject;
}

/**
 * 
 * @param {*} folderPath 
 * @param {*} exportFunction 
 */
function exportTimeScheduleDataMappedToLocationFromFolder(folderPath, exportFunction) {
    if(arguments.length < 2) {
        console.log(">> ERROR: folderPath and exportFunction must be defined");
        return;
    }

    var timeScheduleMapObject = mapTimeScheduleDataToLocationFromFolder(folderPath);

    exportFunction(timeScheduleMapObject);
}

/**
 * 
 * @param {*} filePath 
 * @returns {*} - 
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
 * 
 * @param {*} filePath 
 * @param {*} exportFunction 
 */
function exportTimeScheduleDataMappedToLocationFromFile(filePath, exportFunction) {
    if(arguments.length < 2) {
        console.log(">> ERROR: filePath and exportFunction must be defined");
        return;
    }

    var timeScheduleMapObject = mapTimeScheduleDataToLocationFromFile(filePath);

    exportFunction(timeScheduleMapObject);
}

/**
 * 
 * @param {*} timeScheduleData 
 * @param {*} finalObject 
 * @returns {*} - 
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

            for (let k = 0; k < objectsByDay.length; k++) {
                var day = objectsByDay[k]["day"];
                delete objectsByDay[k]["day"];

                if (!finalObject[building][room].hasOwnProperty(day)) {
                    finalObject[building][room][day] = {};
                }

                finalObject[building][room][day] = formatTimeScheduleCourseForLocationMap(objectsByDay[k]);
            }
        }
    }

    return finalObject;
}

/**
 * 
 * @param {*} course 
 */
function formatTimeScheduleCourseForLocationMap(course) {
    var temp = {};

    temp["sln"] = course["sln"];
    temp["alias"] = course["alias"];
    temp["title"] = course["title"];
    temp["instructor"] = course["instructor"]
    temp["catalogURL"] = course["catalogURL"];
    temp["startTime"] = course["startTime"];
    temp["endTime"] = course["endTime"];
    temp["location"] = course["location"];

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