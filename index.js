"use strict";

const Path = require("path");
const Puppeteer = require('puppeteer');
const ExportUtils = require("./helpers/export.js");

const BuildingInfoScraper = require("./building_info/building_info_scraper.js");
const TimeScheduleScraper = require("./time_schedule/time_schedule_scraper.js");
const CourseCatalogScraper = require("./course_catalog/course_catalog_scraper.js");
const CourseEvaluationsCatalogScraper = require("./course_evaluations_catalog/course_evaluations_scraper.js");

const TimeScheduleDataParser = require("./time_schedule/time_schedule_data_parser.js");
const CECDataParser = require("./course_evaluations_catalog/course_evaluations_data_parser.js");

const DATA_EXPORT_BASE_URL = Path.join(__dirname, "./data/");

process.on('unhandledRejection', (reason, promise) => {
    console.log('>>ERROR: Unhandled Rejection at:', reason.stack || reason)
});

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

        // Expose the extractCourseInfo function for use in the Puppeteer page instance by the Time Schedule scraper
        await mainPage.exposeFunction("extractCourseInfo", TimeScheduleScraper.extractCourseInfo);

        // Scrape and export UW Time Schedule information by major for a quarter
        /*
        await TimeScheduleScraper.exportCoursesByMajorAndQuarter(mainPage, "AUT2019", function(file_name, data) {
            ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL + "AUT2019/", file_name, "data", data);
        });
        */

        // Parse and export the UW Time Schedule data by grouping courses in to arrays mapped from building, room, and day of the week 
        /*
        TimeScheduleDataParser.exportTimeScheduleDataMappedToLocationFromFolder(DATA_EXPORT_BASE_URL + "AUT2019/", function (data) {
            ExportUtils.exportJSONObject(DATA_EXPORT_BASE_URL, "TSMAP.json", data);
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

        // Parse and export UW Course Evaluations Catalog data by expanding evaluations for each question
        /*
        await CECDataParser.exportExpandedCECMajorDataFromFile(DATA_EXPORT_BASE_URL + "CEC/econ.json", function(headers, data) {
            ExportUtils.exportJSONArrayToCSV(DATA_EXPORT_BASE_URL, "econCECData.csv", headers, data);
        });
        */

        browser.close();
    } catch (error) {
        console.log(">> ERROR: ");
        console.log(error);
    }
})();