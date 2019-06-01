"use strict";

const ParserUtils = require("../helpers/parser.js");

/**
 * 
 * @param {*} folderPath 
 */
function mapTimeScheduleDataToLocationFromFolder(folderPath) {

}

/**
 * 
 * @param {*} timeScheduleData 
 * @param {*} finalObject 
 */
function mapTimeScheduleDataToLocation(timeScheduleData, finalObject) {
    if (timeScheduleData === undefined || timeScheduleData == null) {
        return null;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    for (let i = 0; i < timeScheduleData.length; i++) {
        var locationSplit = timeScheduleData[i]["location"].split(" ");
        
        if (locationSplit == null || locationSplit.length < 2) {
            console.log("");
            console.log(">> Could not parse location information for course: ");
            console.log(timeScheduleData[i]);
            console.log("");

            continue;
        }

        var building = locationSplit[0];
        var room = locationSplit[1];

        if (!finalObject.hasOwnProperty(building)) {
            finalObject[building] = {};
        }
        
        if (!finalObject[building].hasOwnProperty(room)) {
            finalObject[building][room] = {};
        }

        var expandedObjects = getExpandedObjectsArrayFromRelatedArrayProperties(timeScheduleData[i], ["time", "location", "instructor"]);

        for(let j = 0; j < expandedObjects.length; j++) {
            var objectsByDay = createDayAndTimeOfWeekObjectsFromString(expandedObjects[i]["time"], expandedObjects[i]);

            for(let k = 0; k < objectsByDay.length; k++) {
                var day = objectsByDay[k]["day"];
                delete objectsByDay[k]["day"];

                if(!finalObject[building][room].hasOwnProperty(day)) {
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
    temp["time"] = course["time"];
    temp["location"] = course["location"];

    return temp;
}

module.exports = {
    mapTimeScheduleDataToLocationFromFolder,
    mapTimeScheduleDataToLocation,
    formatTimeScheduleCourseForLocationMap
};