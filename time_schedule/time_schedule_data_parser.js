"use strict";

const ParserUtils = require("../helpers/parser.js");

function mapTimeScheduleDataToLocation() {
    var objectArray = [{
        "title": "VISUAL INFO DESIGN",
        "alias": "INFO 362",
        "sln": "15363",
        "section": "A",
        "credits": "5",
        "type": "",
        "time": ["MW 1030-1220", "M 1230-120"],
        "location": ["MGH 430", "MGH 430"],
        "instructor": ["Ostergren,Marilyn"],
        "enrollment": "40",
        "limit": "40",
        "grades": "",
        "capacity": "",
        "space": "",
        "fee": "",
        "other": "",
        "requirements": "(VLPA)",
        "status": "",
        "notes": "PERIOD I: INFO MAJORS ONLY. PERIOD II: REGISTRATION IS OPEN TO ALL MAJORS. PERIOD III: ADD CODE REQUIRED. PLEASE CONTACT INSTRUCTOR FOR ADD CODE.",
        "catalogURL": "https://www.washington.edu/students/crscat/info.html#info362"
    }, {
        "title": "ADV DATA SCI METHDS",
        "alias": "INFO 371",
        "sln": "15364",
        "section": "A",
        "credits": "5",
        "type": "",
        "time": ["MW 1030-1220"],
        "location": ["SMI 304"],
        "instructor": ["Toomet,Ott S."],
        "enrollment": "43",
        "limit": "70",
        "grades": "",
        "capacity": "",
        "space": "",
        "fee": "",
        "other": "",
        "requirements": "(QSR)",
        "status": "Open",
        "notes": "PERIOD I: INFO MAJORS ONLY. PERIOD II & III: REGISTRATION IS OPEN TO ALL MAJORS.",
        "catalogURL": "https://www.washington.edu/students/crscat/info.html#info371"
    },
    {
        "title": "TOPICS IN CYBERSEC",
        "alias": "INFO 415",
        "sln": "15375",
        "section": "A",
        "credits": "5",
        "type": "",
        "time": ["MW 530-720P", "M 730-820P"],
        "location": ["JHN 022"],
        "instructor": ["COX,JEFFREY LARTER"],
        "enrollment": "19",
        "limit": "35",
        "grades": "",
        "capacity": "",
        "space": "",
        "fee": "",
        "other": "",
        "requirements": "",
        "status": "Open",
        "notes": "PERIOD I: INFO MAJORS ONLY. PERIOD II & III: REGISTRATION IS OPEN TO ALL MAJORS. INFO 340 IS STRONGLY RECOMMENDED.",
        "catalogURL": "https://www.washington.edu/students/crscat/info.html#info415"
    }];

    var objectMap = ParserUtils.groupObjectsWithRelatedArrayPropertiesByAProperty(objectArray, null, "location", ["time", "location", "instructor"], formatTimeScheduleCourseForLocationMap);

    console.log(objectMap);

}

function formatTimeScheduleCourseForLocationMap(course) {
    var temp = {};

    temp["sln"] = course["sln"];
    temp["alias"] = course["alias"];
    temp["title"] = course["title"];
    temp["instructor"] = course["instructor"]
    temp["catalogURL"] = course["catalogURL"];
    temp["time"] = course["time"];
    temp["location"] = course["location"];

    ParserUtils.getTimeOfDayFromRange(temp["time"]);

    return temp;
}

module.exports = {
    mapTimeScheduleDataToLocation
};