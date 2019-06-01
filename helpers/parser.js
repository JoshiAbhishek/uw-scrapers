"use strict";

function regexCaputureGroupHasContent(captureGroup) {
    return captureGroup != undefined && captureGroup != null && captureGroup != "" && captureGroup != " ";
}

function multipleRegexCaptureGroupsHaveContent(captureGroupsArray, startIndex, endIndex) {
    if(startIndex > endIndex || endIndex > captureGroupsArray.length - 1) {
        return false;
    }

    for(let i = 0; i < captureGroupsArray.length; i++) {
        if(!regexCaputureGroupHasContent(captureGroupsArray[i])) {
            return false;
        }
    }

    return true;
}

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
 * @param {*} object 
 * @param {*} relatedProperties 
 * @param {*} customValueParser 
 * @returns {Object[]} -  
 */
function getExpandedObjectsArrayFromRelatedArrayProperties(currentObject, relatedProperties, customValueParser) {
    if (currentObject === undefined || currentObject == null || relatedProperties === undefined || relatedProperties == null) {
        return currentObject;
    }

    var objectArray = [];

    var relatePropsLength = getMaxRelatedPropertiesLength(currentObject, relatedProperties);

    for (let j = 0; j < relatePropsLength; j++) {
        // create new object for each related properties item
        var temp = JSON.parse(JSON.stringify(currentObject));

        // add all related properties by the current index
        for (let k = 0; k < relatedProperties.length; k++) {
            var currPropArray = currentObject[relatedProperties[k]];

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
        objectArray.push(temp);
    }

    return objectArray;
}

/**
 * 
 * @param {*} str
 * @param {*} finalObject  
 * @returns {Object} -
 */
function createDayAndTimeOfWeekObjectsFromString(str, finalObject) {
    if (str === undefined || str == null) {
        return null;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    var dayAndTimeCaptureGroups = dayAndTimeOfWeekRegex.exec(str);

    var days = dayAndTimeCaptureGroups[1].split(dayOfWeekSplitRegex);

    var startTime = dayAndTimeCaptureGroups[2];
    var endTime = dayAndTimeCaptureGroups[3];
    var timeOfDay = dayAndTimeCaptureGroups[4];

    var timeObject = createTimeOfDayObject(startTime, endTime, timeOfDay, finalObject);

    var daysAndTimes = new Array(days.length);

    for(let i = 0; i < days.length; i++) {
        var temp = JSON.parse(JSON.stringify(timeObject));
        temp["day"] = getFullDayNameFromAbbreviation(days[i]);
        daysAndTimes[i] = temp;
    }

    return daysAndTimes;
}

/**
 * 
 * @param {*} startTime 
 * @param {*} endTime 
 * @param {*} timeOfDay 
 * @param {*} finalObject 
 */
function createTimeOfDayObject(startTime, endTime, timeOfDay, finalObject) {
    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    var startTimeHour = startTime.charAt(0);
    var endTimeHour = endTime.charAt(0);

    var startInEvening = false;
    var endInEvening = false;

    if (timeOfDay != null && timeOfDay.toLowerCase().startsWith("p")) {
        startInEvening = true;
        endInEvening = true;
    }
    else if ((startTimeHour > 3 && startTimeHour < 12) || (startTimeHour == 4 && Number(startTime) < 430)) {
        startInEvening = false;

        if (endTimeHour > 3 && endTimeHour < 12) {
            endInEvening = false;
        }
        else {
            endInEvening = true;
        }
    }
    else {
        startInEvening = true;

        if (endTimeHour > 3 && endTimeHour < 12) {
            endInEvening = false;
        }
        else {
            endInEvening = true;
        }
    }

    startTime = convertTimeToMilitaryTimeNumber(startTime, startInEvening);
    endTime = convertTimeToMilitaryTimeNumber(endTime, endInEvening);

    finalObject["StartTime"] = startTime;
    finalObject["EndTime"] = endTime;

    return finalObject;
}

/**
 * 
 * @param {*} time 
 * @param {*} isAfterTwelve 
 * @returns {*} -
 */
function convertTimeToMilitaryTimeNumber(time, isAfterTwelve) {
    if (time === undefined || time == null || time.length < 2 || isAfterTwelve === undefined || isAfterTwelve == null) {
        return time;
    }

    if (typeof time === "string") {
        time = time.replace(":", "");
    }

    var newTime = Number(time);

    if (isAfterTwelve) {
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
    regexCaputureGroupHasContent,
    multipleRegexCaptureGroupsHaveContent,
    groupObjectsByAProperty,
    groupObjectsWithRelatedArrayPropertiesByAProperty,
    checkRelatedPropertiesLengths,
    getMaxRelatedPropertiesLength,
    expandObjectArrayByRelatedArrayProperties,
    getExpandedObjectsArrayFromRelatedArrayProperties
};