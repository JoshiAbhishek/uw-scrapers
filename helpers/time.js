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
 * @param {String} dateTimeRange 
 * @param {Object} finalObject 
 * @returns {Object} - 
 */
function addDayAndTimesToObject(dateTimeRange, finalObject) {
    if (dateTimeRange === undefined || dateTimeRange == null) {
        return null;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    var dayTimeCaptureGroups = fullDayAndTimeOfWeekRegex.exec(dateTimeRange.replace("midnight", "11:59 pm").replace(":", ""));

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

    if (dayTimeCaptureGroups[3] === undefined || dayTimeCaptureGroups[3] == null) {
        dayTimeCaptureGroups[3] = "";
    }

    if (dayTimeCaptureGroups[5] === undefined || dayTimeCaptureGroups[5] == null) {
        dayTimeCaptureGroups[5] = "";
    }

    if (!ParserUtils.regexCaputureGroupHasContent(dayTimeCaptureGroups[2]) || !ParserUtils.regexCaputureGroupHasContent(dayTimeCaptureGroups[4])) {
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

    if (timeObject == null) {
        return null;
    }

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
 * @param {String} dateTimeRange 
 * @param {Object} templateObject 
 * @returns {Object[]} - 
 */
function createArrayOfDayAndTimeObjectsFromTemplate(dateTimeRange, templateObject) {
    if (dateTimeRange === undefined || dateTimeRange == null) {
        return null;
    }

    if (templateObject === undefined || templateObject == null) {
        templateObject = {};
    }

    var daysAndTimes = addDayAndTimesToObject(dateTimeRange, {});

    if (daysAndTimes == null) {
        return null;
    }

    var finalDaysAndTimes = [];

    for (let i = 1; i <= 7; i++) {
        var day = numsToDaysEnum[i];

        if (daysAndTimes.hasOwnProperty(day)) {
            var temp = JSON.parse(JSON.stringify(templateObject));

            temp["day"] = day;
            temp["startTime"] = daysAndTimes[day]["startTime"];
            temp["endTime"] = daysAndTimes[day]["endTime"];

            finalDaysAndTimes.push(temp);
        }
    }

    return finalDaysAndTimes;
}

/**
 * 
 * @param {String} timeRange 
 * @returns {Object} - 
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

/**
 * 
 * @param {String} time
 * @returns {Boolean} -  
 */
function timeHourIsNotTwelve(time) {
    return !time.toLowerCase().startsWith("12") || (time.toLowerCase().startsWith("12") && time.length < 4);
}

/**
 * 
 * @param {String} startTime 
 * @param {String} endTime 
 * @param {String} startTimeOfDay 
 * @param {String} endTimeOfDay 
 * @returns {Object} - 
 */
function convertTimeAndTimesOfDayToMilitaryTimeFormat(startTime, endTime, startTimeOfDay, endTimeOfDay) {
    if (arguments.length < 4) {
        return null;
    }

    if (endTimeOfDay.toLowerCase().startsWith("p") && startTimeOfDay.toLowerCase().startsWith("a")) {
        console.log("");
        console.log(">> Cannot have time range from evening of one day to the morning of another: ");
        console.log(startTime + " " + startTimeOfDay + " - " + endTime + " " + endTimeOfDay);
        console.log("");

        return null;
    }

    var startTimeNum = Number(startTime);
    var endTimeNum = Number(endTime);

    if (startTime.length < 3) {
        startTimeNum *= 100;
    }

    if (endTime.length < 3) {
        endTimeNum *= 100;
    }

    var timeObject = {};

    if (startTimeNum == endTimeNum) {
        timeObject["startTime"] = startTimeNum;
        timeObject["endTime"] = endTimeNum;

        return timeObject;
    }

    if (startTimeOfDay.toLowerCase().startsWith("a")) {
        if (endTimeOfDay.toLowerCase().startsWith("p")) {
            if (timeHourIsNotTwelve(endTime)) {
                endTimeNum += 1200;
            }
        }
        else {
            if (!timeHourIsNotTwelve(endTime)) {
                endTimeNum %= 100;
            }
        }

        if (!timeHourIsNotTwelve(startTime)) {
            startTimeNum %= 100;
        }
    }
    else if (startTimeOfDay.toLowerCase().startsWith("p")) {
        if (endTimeOfDay.toLowerCase().startsWith("a") || endTime.startsWith("12")) {
            console.log("");
            console.log(">> Cannot have time range from evening of one day to the morning of another: ");
            console.log(startTime + " " + startTimeOfDay + " - " + endTime + " " + endTimeOfDay);
            console.log("");

            return null;
        }

        if (timeHourIsNotTwelve(startTime)) {
            startTimeNum += 1200;
        }

        if (timeHourIsNotTwelve(endTime)) {
            endTimeNum += 1200;
        }
    }
    else {
        if (endTimeOfDay.toLowerCase().startsWith("p")) {
            // Assume that start time is in the morning if it is larger than the end time
            if (startTimeNum < endTimeNum && timeHourIsNotTwelve(startTime)) {
                startTimeNum += 1200;
            }
            
            if (timeHourIsNotTwelve(endTime)) {
                endTimeNum += 1200;
            }
        }
        else if (!endTimeOfDay.toLowerCase().startsWith("a")) {
            // Assume that start time is in the morning if it is larger than the end time, with end time in the evening
            if (startTimeNum > endTimeNum && timeHourIsNotTwelve(endTime)) {
                endTimeNum += 1200;
            }
            else if (startTimeNum < 430 && endTimeNum < 430) {
                // Assume that both start and end time are in the afternoon if both are before 4:30
                startTimeNum += 1200;
                endTimeNum += 1200;
            }
        }
    }

    if (startTimeNum > endTimeNum) {
        console.log("");
        console.log(">> Could not parse time range: ");
        console.log(startTime + " " + startTimeOfDay + " - " + endTime + " " + endTimeOfDay);
        console.log("");

        return null;
    }

    timeObject["startTime"] = startTimeNum;
    timeObject["endTime"] = endTimeNum;

    return timeObject;
}

/**
 * 
 * @param {String} time 
 * @param {Boolean} isAfterNoon 
 * @returns {Number} -
 */
function convertTimeToMilitaryTimeNumber(time, isAfterNoon) {
    if (time === undefined || time == null || time.length < 2 || isAfterNoon === undefined || isAfterNoon == null) {
        return null;
    }

    if (typeof time === "string") {
        time = time.replace(":", "");
    }

    var newTime = Number(time);

    if (isAfterNoon) {
        if (time.length < 3) {
            newTime = newTime * 100;
        }

        if (timeHourIsNotTwelve(time)) {
            newTime += 1200;
        }
    }
    else {
        if (!timeHourIsNotTwelve(time)) {
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
    convertTimeAndTimesOfDayToMilitaryTimeFormat,
    convertTimeToMilitaryTimeNumber
};