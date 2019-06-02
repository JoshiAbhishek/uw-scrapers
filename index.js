"use strict";

const Path = require("path");
const Puppeteer = require('puppeteer');
const ExportUtils = require("./helpers/export.js");

const BuildingInfoScraper = require("./building_info/building_info_scraper.js");
const TimeScheduleScraper = require("./time_schedule/time_schedule_scraper.js");
const CourseCatalogScraper = require("./course_catalog/course_catalog_scraper.js");
const CourseEvaluationsCatalogScraper = require("./course_evaluations_catalog/course_evaluations_scraper.js");
const TimeScheduleDataParser = require("./time_schedule/time_schedule_data_parser.js");

const DATA_EXPORT_BASE_URL = Path.join(__dirname, "./data/");

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

(async function main() {
    try {
        const browser = await Puppeteer.launch({
            headless: true
        });

        const mainPage = await browser.newPage();
        mainPage.setDefaultTimeout(1200000);

        // Logs any console output from the Puppeteer page instance
        //mainPage.on('console', consoleObj => console.log(consoleObj.text()));

        // Scrape and export UW Facilities building information
        /*
        await BuildingInfoScraper.exportBuildingInfo(mainPage, false, function(data) {
            ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL, "detailed_building_info.json", "data", data);
        });
        */

        /*
        // Expose the extractCourseInfo function for use in the Puppeteer page instance
        await mainPage.exposeFunction("extractCourseInfo", TimeScheduleScraper.extractCourseInfo);

        // Scrape and export UW Time Schedule information by major for a quarter
        await TimeScheduleScraper.exportCoursesByMajorAndQuarter(mainPage, "SPR2019", function(file_name, data) {
            ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL + "SPR2019/", file_name, "data", data);
        });
        */

        // Scrape and export UW Course Catalog information by major
        /*
        await CourseCatalogScraper.exportCourseCatalogByMajor(mainPage, function(file_name, data) {
            ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL + "Catalog/", file_name, "data", data);
        });
        */

        // Scrape and export UW Course Evaluations Catalog information by major
        /*
        await CourseEvaluationsCatalogScraper.exportCourseEvaluationsCatalogByMajor(mainPage, function(file_name, data) {
            ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL + "CEC/", file_name, "data", data);
        });
        */

        // TimeScheduleDataParser.exportTimeScheduleDataMappedToLocationFromFile(DATA_EXPORT_BASE_URL + "SPR2019/info.json", function (data) {
        //     ExportUtils.exportJSONObject(DATA_EXPORT_BASE_URL, "TSINFOMAP.json", data);
        // });

        TimeScheduleDataParser.exportTimeScheduleDataMappedToLocationFromFolder(DATA_EXPORT_BASE_URL + "SPR2019/", function (data) {
            ExportUtils.exportJSONObject(DATA_EXPORT_BASE_URL, "TSMAP.json", data);
        });

        browser.close();
    } catch (error) {
        console.log(">> ERROR: ");
        console.log(error);
    }
})();