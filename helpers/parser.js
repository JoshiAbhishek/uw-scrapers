"use strict";

/*

0 - Original string
1 - Days
2 - Start time
3 - End time
4 - Time of day
*/
const dayAndTimeOfWeekRegex = new RegExp(/([A-Za-z\.]+)\s(\d+)\-(\d+)([P]*)/);

//
const dayOfWeekSplitRegex = new RegExp(/(?=[A-Z])/, "g");

/**
 * 
 * @param {*} objectArray 
 * @param {*} finalObject 
 * @param {*} propertyName 
 * @param {*} customValueParser 
 * @returns {*} -  
 */
function groupObjectsByAProperty(objectArray, finalObject, propertyName, customValueParser) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1) {
        return objectArray;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    for (let i = 0; i < objectArray.length; i++) {
        var temp = JSON.parse(JSON.stringify(objectArray[i]));

        // pass to custom value parser if defined
        if (customValueParser != undefined && customValueParser != null) {
            temp = customValueParser(temp);
        }

        var property = temp[propertyName];

        if (!finalObject.hasOwnProperty(property)) {
            finalObject[property] = [];
        }

        finalObject[property].push(temp);
    }

    return finalObject;
}

/**
 * 
 * @param {*} objectArray 
 * @param {*} finalObject 
 * @param {*} propertyName 
 * @param {*} relatedProperties 
 * @param {*} customValueParser 
 * @returns {*} -  
 */
function groupObjectsWithRelatedArrayPropertiesByAProperty(objectArray, finalObject, propertyName, relatedProperties, customValueParser) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1 || propertyName === undefined || propertyName == null || relatedProperties === undefined || relatedProperties == null) {
        return null;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    for (let i = 0; i < objectArray.length; i++) {
        var relatePropsLength = getMaxRelatedPropertiesLength(objectArray[i], relatedProperties);

        for (let j = 0; j < relatePropsLength; j++) {
            // create a new object for each related properties item
            var temp = JSON.parse(JSON.stringify(objectArray[i]));

            // add all related properties by the current index
            for (let k = 0; k < relatedProperties.length; k++) {
                var currPropArray = objectArray[i][relatedProperties[k]];

                if (currPropArray !== undefined && currPropArray != null) {
                    if (currPropArray.length < relatePropsLength) {
                        temp[relatedProperties[k]] = currPropArray[currPropArray.length - 1];
                    }
                    else {
                        temp[relatedProperties[k]] = currPropArray[j];
                    }
                }
            }

            // pass to custom value parser if defined
            if (customValueParser != undefined && customValueParser != null) {
                temp = customValueParser(temp);
            }

            // add value to final object with the defined property's value
            var property = temp[propertyName];

            if (!finalObject.hasOwnProperty(property)) {
                finalObject[property] = [];
            }

            finalObject[property].push(temp);
        }
    }

    return finalObject;
}

/**
 * 
 * @param {*} object 
 * @param {*} relatedProperties 
 * @param {*} ignoreNullAndEmpty 
 * @returns {Boolean} -
 */
function checkRelatedPropertiesLengths(object, relatedProperties, ignoreNullAndEmpty) {
    var length = -1;
    var sameLength = true;

    let i = 0;
    while (i < relatedProperties.length && sameLength) {
        if (object[relatedProperties[i]] === undefined || object[relatedProperties[i]] == null) {
            if (!ignoreNullAndEmpty) {
                sameLength = false;
                length = -1;
            }
        }
        else {
            if (length == -1) {
                length = object[relatedProperties[i]].length;
            }
            else if (object[relatedProperties[i]].length != length) {
                sameLength = false;
                length = -1;
            }
        }

        i += 1;
    }

    return length;
}

/**
 * 
 * @param {*} object 
 * @param {*} relatedProperties 
 * @returns {*} - 
 */
function getMaxRelatedPropertiesLength(object, relatedProperties) {
    var length = 0;

    for (let i = 0; i < relatedProperties.length; i++) {
        if (object[relatedProperties[i]] != undefined && object[relatedProperties[i]] != null) {
            if (object[relatedProperties[i]].length > length) {
                length = object[relatedProperties[i]].length;
            }
        }
    }

    return length;
}

/**
 * 
 * @param {*} objectArray 
 * @param {*} relatedProperties 
 * @param {*} customValueParser 
 * @returns {Object[]} -  
 */
function expandObjectArrayByRelatedArrayProperties(objectArray, relatedProperties, customValueParser) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1 || relatedProperties === undefined || relatedProperties == null) {
        return objectArray;
    }

    var originalArrayLength = Number(objectArray.length);

    for (let i = 0; i < originalArrayLength; i++) {
        var relatePropsLength = getMaxRelatedPropertiesLength(objectArray[i], relatedProperties);

        for (let j = 0; j < relatePropsLength; j++) {
            // create new object for each related properties item
            var temp = JSON.parse(JSON.stringify(objectArray[i]));

            // add all related properties by the current index
            for (let k = 0; k < relatedProperties.length; k++) {
                var currPropArray = objectArray[i][relatedProperties[k]];

                if (currPropArray !== undefined && currPropArray != null) {
                    if (currPropArray.length < relatePropsLength) {
                        temp[relatedProperties[k]] = currPropArray[currPropArray.length - 1];
                    }
                    else {
                        temp[relatedProperties[k]] = currPropArray[j];
                    }
                }
            }

            // pass to custom value parser if defined
            if (customValueParser != undefined && customValueParser != null) {
                temp = customValueParser(temp);
            }

            // replace original object in array and append new objects
            if (j == 0) {
                objectArray[i] = temp;
            }
            else {
                objectArray.push(temp);
            }
        }
    }

    return objectArray;
}

/**
 * 
 * @param {*} str 
 * @returns {Object} -
 */
function createDayAndTimeOfWeekObjectFromString(str) {
    if (str === undefined || str == null) {
        return null;
    }

    var temp = {};

    var dayAndTimeCaptureGroups = dayAndTimeOfWeekRegex.exec(str);

    var days = dayAndTimeCaptureGroups[1].split(dayOfWeekSplitRegex);

    var startTime = dayAndTimeCaptureGroups[2];
    var endTime = dayAndTimeCaptureGroups[3];
    var startTimeHour = startTime.charAt(0);
    var endTimeHour = endTime.charAt(0);

    var timeOfDay = dayAndTimeCaptureGroups[4];

    var startInEvening = false;
    var endInEvening = false;

    if (timeOfDay != null && timeOfDay.toLowerCase().startsWith("p")) {
        startInEvening = true;
        endInEvening = true;
    }  
    else if (startTimeHour > 3 && startTimeHour < 12) {
        if (endTimeHour > 3 && endTimeHour < 12) {
            startInEvening = false;
            endInEvening = false;
        }
        else {
            startInEvening = false;
            endInEvening = true;
        }
    }
    else {
        console.log("");
        console.log(">> ERROR: ");
        console.log("Could not parse time string: " + str);
        console.log("");

        return null;
    }
    
    startTime = convertTimeToMilitaryTimeNumber(startTime, startInEvening);
    endTime = convertTimeToMilitaryTimeNumber(endTime, endInEvening);

    temp["StartTime"] = startTime;
    temp["EndTime"] = endTime;

    return temp;
}

/**
 * 
 * @param {*} startTime 
 * @param {*} endTime 
 * @param {*} startTimeBeforeMidDay 
 * @param {*} endTimeBeforeMidDay 
 * @returns {Object} -
 */
function convertTimeRangeToMilitaryTime(startTime, endTime, startTimeBeforeMidDay, endTimeBeforeMidDay) {
    var temp = {};

    if (startTime === undefined || startTime == null || endTime === undefined || endTime == null) {
        return temp;
    }
}

/**
 * 
 * @param {*} time 
 * @param {*} isAfterTweleve 
 * @returns {*} -
 */
function convertTimeToMilitaryTimeNumber(time, isAfterTweleve) {
    if (time === undefined || time == null || time.length < 2 || isAfterTweleve === undefined || isAfterTweleve == null) {
        return time;
    }

    if (typeof time === "string") {
        time = time.replace(":", "");
    }

    var newTime = Number(time);

    if (isAfterTweleve) {
        if (time.length < 3) {
            newTime = newTime * 100;
        }

        if (!time.startsWith("12")) {
            newTime += 1200;
        }
    }
    else {
        if (time.startsWith("12")) {
            if (time.length < 3) {
                newTime = 0;
            }
            else {
                newTime = newTime % 100;
            }
        }
    }

    return newTime;
}

module.exports = {
    groupObjectsByAProperty,
    groupObjectsWithRelatedArrayPropertiesByAProperty,
    expandObjectArrayByRelatedArrayProperties,
    checkRelatedPropertiesLengths,
    getMaxRelatedPropertiesLength,
    createDayAndTimeOfWeekObjectFromString,
    convertTimeToMilitaryTimeNumber
};