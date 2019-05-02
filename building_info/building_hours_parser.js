"use strict";

//
var DaysToNumsEnum = Object.freeze({
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7
});

//
var NumsToDaysEnum = Object.freeze({
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
});

//
var DayExpressionsToDay = Object.freeze({
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
 * 
 * @param {*} hours 
 */
function getBuildingHours(hours) {
    if(hours === undefined || hours == "") {
        return {};
    }

    hours = hours.replace("midnight", "11:59 pm");
    hours = hours.replace(/\r\n|\r|\n/g, ";");
    hours = hours.replace(/(;[a-zA-Z]+)(\s\s+)/g, "$1 ");
    hours = hours.replace(/\s\s\s+/g, ';');

    var time = hours.split(";");

    var finalHours = {
        "Monday": {
            "StartTime": -1,
            "EndTime": -1
        },
        "Tuesday": {
            "StartTime": -1,
            "EndTime": -1
        },
        "Wednesday": {
            "StartTime": -1,
            "EndTime": -1
        },
        "Thursday": {
            "StartTime": -1,
            "EndTime": -1
        },
        "Friday": {
            "StartTime": -1,
            "EndTime": -1
        },
        "Saturday": {
            "StartTime": -1,
            "EndTime": -1
        },
        "Sunday": {
            "StartTime": -1,
            "EndTime": -1
        }
    };

    time.forEach(t => {
        t = t.replace(/[^a-zA-Z\d\s-]/g, "");
        t = t.replace(/-/g, " ");
        t = t.replace(/(\d+)([a-z]+)/g, '$1 $2');
        t = t.replace(/([a-z]+)(\d+)/g, '$1 $2');
        t = t.replace(/\s\s+/g, " ");

        var firstDay = "";
        var secondDay = "";
        var startTime = -1;
        var endTime = -1;

        var timeSplit = t.split(" ");

        var i;

        for (i = 0; i < timeSplit.length; i++) {
            var ti = timeSplit[i].toLowerCase().trim();

            if (ti == " " || ti == "" || ti == "fall" || ti == "spring" || ti == "winter") {
                continue;
            }
            else if (ti == "summer") {
                break;
            }
            else if (ti == "weekend" || ti == "weekends") {
                firstDay = "Saturday";
                secondDay = "Sunday";
            }

            if (isNaN(ti)) {
                // Day of week or am / pm
                var day = getDay(ti);

                if (ti == "pm") {
                    // am or pm

                    if (startTime > 0) {
                        if (endTime > 0) {
                            // set end time 

                            if (100 > endTime) {
                                endTime *= 100;
                            }

                            if (!endTime.toString().startsWith("12")) {
                                endTime += 1200;
                            }
                        } else {
                            // set start time 

                            if (100 > startTime) {
                                startTime *= 100;
                            }

                            if (!startTime.toString().startsWith("12")) {
                                startTime += 1200;
                            }
                        }
                    }
                } else if (ti == "am") {
                    // set if time is 12, to change to 24 hour format

                    if (startTime > 0) {
                        if (endTime > 0) {
                            // set end time 

                            if (100 > endTime) {
                                endTime *= 100;
                            }

                            if (endTime.toString().startsWith("12")) {
                                endTime %= 100;
                            }
                        } else {
                            // set start time 

                            if (100 > startTime) {
                                startTime *= 100;
                            }

                            if (startTime.toString().startsWith("12")) {
                                startTime %= 100;
                            }
                        }
                    }
                } else if (day != undefined) {
                    // Started new day 
                    // Set Times
                    if (firstDay != "" && startTime > -1 && endTime > -1) {
                        // Set times
                        if (secondDay != "") {
                            var s = DaysToNumsEnum[firstDay];
                            var e = DaysToNumsEnum[secondDay];

                            if (s > e) {
                                var x;
                                for (x = s; x <= 7; x++) {
                                    finalHours[NumsToDaysEnum[x]].StartTime = startTime;
                                    finalHours[NumsToDaysEnum[x]].EndTime = endTime;
                                }

                                s = 1;
                            }

                            var x;
                            for (x = s; x <= e; x++) {
                                finalHours[NumsToDaysEnum[x]].StartTime = startTime;
                                finalHours[NumsToDaysEnum[x]].EndTime = endTime;
                            }

                            startTime = -1;
                            endTime = -1;
                            firstDay = "";
                            secondDay = "";
                        } else {
                            finalHours[firstDay].StartTime = startTime;
                            finalHours[firstDay].EndTime = endTime;

                            startTime = -1;
                            endTime = -1;
                            firstDay = "";
                        }
                    }

                    // Day of week

                    if (firstDay != "") {
                        secondDay = day;
                    } else {
                        firstDay = day;
                    }
                }
            } else {
                // Time

                if (startTime > -1) {
                    endTime = Number(ti);
                } else {
                    startTime = Number(ti);
                }
            }
        }

        // Set Times
        if (startTime > -1 && endTime > -1) {
            if(firstDay == "" && secondDay == "") {
                firstDay = getDay("Mon");
                secondDay = getDay("Fri");
            }

            // Set times
            if (secondDay != "") {
                var s = DaysToNumsEnum[firstDay];
                var e = DaysToNumsEnum[secondDay];

                if (s > e) {
                    var x;
                    for (x = s; x <= 7; x++) {
                        finalHours[NumsToDaysEnum[x]].StartTime = startTime;
                        finalHours[NumsToDaysEnum[x]].EndTime = endTime;
                    }

                    s = 1;
                }

                var x;
                for (x = s; x <= e; x++) {
                    finalHours[NumsToDaysEnum[x]].StartTime = startTime;
                    finalHours[NumsToDaysEnum[x]].EndTime = endTime;
                }

                startTime = -1;
                endTime = -1;
                firstDay = "";
                secondDay = "";
            } else {
                finalHours[firstDay].StartTime = startTime;
                finalHours[firstDay].EndTime = endTime;

                startTime = -1;
                endTime = -1;
                firstDay = "";
            }
        }

        t = t.trim().toLowerCase();
        if(t == "closed saturday and sunday" || t == "weekends closed" || t == "weekend closed") {
            finalHours["Saturday"].StartTime = -1;
            finalHours["Saturday"].EndTime = -1;

            finalHours["Sunday"].StartTime = -1;
            finalHours["Sunday"].EndTime = -1;
        }
    });

    return finalHours;
}

/**
 * 
 * @param {*} day 
 */
function getDay(day) {
    return DayExpressionsToDay[day.toLowerCase()];
}

module.exports = {
    getBuildingHours: getBuildingHours
}