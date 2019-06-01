"use strict";

const ParserUtils = require("./parser.js");

/*

0 - Original string
1 - Days
2 - Start time
3 - End time
4 - Time of day
*/
const simpleDayAndTimeOfWeekRegex = new RegExp(/([A-Za-z\.]+)\s(\d+)\-(\d+)([P]*)/);

/*
Replace midnight with 11:59pm and replace colons with nothing

0 - Original string
1 - Days (if null, assume all days of the week)
2 - Start time
3 - Start time of day
4 - End time
5 - End time of day
*/
const fullDayAndTimeOfWeekRegex = new RegExp(/([A-Za-z\-\.]+|\s*)\s*(\d+)(\s?[AamMpP\.]{1,5}|\s*)\-(\d+)(\s?[AamMpP\.]{1,5}|\s*)/);

/*
Replace midnight with 11:59pm and replace colons with nothing

0 - Original string
1 - Start time
2 - Start time of day
3 - End time
4 - End time of day
*/
const timeOfDayRegex = new RegExp(/(\d+)(\s?[AamMpP\.]{1,5}|\s*)\-(\d+)(\s?[AamMpP\.]{1,5}|\s*)/);

//
const dayOfWeekSplitRegex = new RegExp(/(?=[A-Z])/, "g");

// Enum for converting days of the week as names to corresponding numbers (starting at 1 for Monday)
var daysToNumsEnum = Object.freeze({
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7
});

// Enum for converting days of the week as numbers to their corresponding name (strating at Monday for 1)
var numsToDaysEnum = Object.freeze({
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
});

// Enum for converting lowercase string abbreviations of days of the week to their corresponding full name
var dayExpressionsToDayEnum = Object.freeze({
    "m": "Monday",
    "mo": "Monday",
    "mon": "Monday",
    "monday": "Monday",
    "t": "Tuesday",
    "tu": "Tuesday",
    "tue": "Tuesday",
    "tues": "Tuesday",
    "tuesday": "Tuesday",
    "w": "Wednesday",
    "wed": "Wednesday",
    "weds": "Wednesday",
    "wednesday": "Wednesday",
    "th": "Thursday",
    "thur": "Thursday",
    "thurs": "Thursday",
    "thursday": "Thursday",
    "f": "Friday",
    "fri": "Friday",
    "friday": "Friday",
    "s": "Saturday",
    "sat": "Saturday",
    "saturday": "Saturday",
    "su": "Sunday",
    "sun": "Sunday",
    "sunday": "Sunday"
});

/**
 * Returns the full name of a day of the week from an abbreviation
 * @param {String} day - An abbreviation of the name of a day of the week
 * @returns {String} - The full name of a day of the week
 */
function getFullDayNameFromAbbreviation(day) {
    return dayExpressionsToDayEnum[day.toLowerCase()];
}

/**
 * 
 * @param {*} dateTimeRange 
 * @param {*} finalObject 
 * @returns {*} - 
 */
function addDayAndTimesToObject(dateTimeRange, finalObject) {
    if (dateTimeRange === undefined || dateTimeRange == null) {
        return null;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    var dayTimeCaptureGroups = fullDayAndTimeOfWeekRegex.exec(str1.replace("midnight", "11:59 pm").replace(":", ""));

    var dayTimeRange = false;
    var days;

    if (ParserUtils.regexCaputureGroupHasContent(dayTimeCaptureGroups[1])) {
        days = dayTimeCaptureGroups[1].split("-");

        if (days.length > 1) {
            dayTimeRange = true;
        }
        else {
            days = dayTimeCaptureGroups[1].split(dayOfWeekSplitRegex);
        }
    }
    else {
        days = ["Mon", "Sun"];
        dayTimeRange = true;
    }

    if (!ParserUtils.multipleRegexCaptureGroupsHaveContent(dayTimeCaptureGroups, 2, 5) || days.length > 2 || days.length < 1) {
        console.log("");
        console.log(">> Could not parse day / time string: ");
        console.log(dayTimeRange);
        console.log("");

        return null;
    }

    var startTime = dayTimeCaptureGroups[2];
    var startTimeOfDay = dayTimeCaptureGroups[3];
    var endTime = dayTimeCaptureGroups[4];
    var endTimeOfDay = dayTimeCaptureGroups[5];

    var timeObject = convertTimeAndTimesOfDayToMilitaryTimeFormat(startTime, endTime, startTimeOfDay, endTimeOfDay);

    // Day range or multiple days
    if (dayTimeRange) {
        var start = daysToNumsEnum[getFullDayNameFromAbbreviation(days[0])];
        var end = daysToNumsEnum[getFullDayNameFromAbbreviation(days[1])];

        if (start > end) {
            for (var x = start; x <= 7; x++) {
                finalObject[numsToDaysEnum[x]] = JSON.parse(JSON.stringify(timeObject));
            }

            start = 1;
        }

        for (var x = start; x <= end; x++) {
            finalObject[numsToDaysEnum[x]] = JSON.parse(JSON.stringify(timeObject));
        }
    }
    else {
        for (let i = 0; i < days.length; i++) {
            finalObject[getFullDayNameFromAbbreviation(days[i])] = JSON.parse(JSON.stringify(timeObject));
        }
    }

    return finalObject;
}

/**
 * 
 * @param {*} dateTimeRange 
 * @param {*} templateObject 
 * @returns {*} - 
 */
function createArrayOfDayAndTimeObjectsFromTemplate(dateTimeRange, templateObject) {
    if (dateTimeRange === undefined || dateTimeRange == null) {
        return null;
    }

    if (templateObject === undefined || templateObject == null) {
        templateObject = {};
    }

    var daysAndTimes = addDayAndTimesToObject(dateTimeRange, {});

    var finalDaysAndTimes = [];

    for(let i = 1; i <= 7; i++) {
        var day = numsToDaysEnum[i];

        if(daysAndTimes.hasOwnProperty(day)) {
            var temp = JSON.parse(JSON.stringify(templateObject));

            temp["day"] = day;
            temp["startTime"] = daysAndTimes["day"]["startTime"];
            temp["endTime"] = daysAndTimes["day"]["endTime"];

            finalDaysAndTimes.push(temp);
        }        
    }

    return finalDaysAndTimes;
}

/**
 * 
 * @param {*} timeRange 
 * @returns {*} - 
 */
function convertTimeRangeToMilitaryTimeFormat(timeRange) {
    if (timeRange === undefined || timeRange == null) {
        return null;
    }

    var timeCaptureGroups = timeOfDayRegex.exec(str1.replace("midnight", "11:59 pm").replace(":", ""));

    if (!ParserUtils.multipleRegexCaptureGroupsHaveContent(timeCaptureGroups, 1, 4)) {
        console.log("");
        console.log(">> Could not parse time string: ");
        console.log(timeRange);
        console.log("");

        return null;
    }

    var startTime = timeCaptureGroups[1];
    var startTimeOfDay = timeCaptureGroups[2];
    var endTime = timeCaptureGroups[3];
    var endTimeOfDay = timeCaptureGroups[4];

    var timeObject = convertTimeAndTimesOfDayToMilitaryTimeFormat(startTime, endTime, startTimeOfDay, endTimeOfDay);

    return timeObject;
}


function convertTimeAndTimesOfDayToMilitaryTimeFormat(startTime, endTime, startTimeOfDay, endTimeOfDay) {
    if(arguments.length < 4) {
        return null;
    }

    
}

module.exports = {
    simpleDayAndTimeOfWeekRegex,
    fullDayAndTimeOfWeekRegex,
    timeOfDayRegex,
    dayOfWeekSplitRegex,
    daysToNumsEnum,
    numsToDaysEnum,
    dayExpressionsToDayEnum,
    getFullDayNameFromAbbreviation,
    addDayAndTimesToObject,
    createArrayOfDayAndTimeObjectsFromTemplate,
    convertTimeRangeToMilitaryTimeFormat,
    convertTimeAndTimesOfDayToMilitaryTimeFormat
};