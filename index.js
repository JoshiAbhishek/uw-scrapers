"use strict";

const Puppeteer = require('puppeteer');
const ExportUtils = require("./helpers/export.js");

const BuildingInfoScraper = require("./building_info/building_info_scraper.js");
const TimeScheduleScraper = require("./time_schedule/time_schedule_scraper.js");
const CourseCatalogScraper = require("./course_catalog/course_catalog_scraper.js");

const DATA_EXPORT_BASE_URL = "./data/";

(async function main() {
    try {
        const browser = await Puppeteer.launch({
            headless: true
        });

        const mainPage = await browser.newPage();
        mainPage.setDefaultTimeout(1200000);

        // Logs any console output from the Puppeteer page instance
        mainPage.on('console', consoleObj => console.log(consoleObj.text()));

        // Expose the extractCourseInfo function for use in the Puppeteer page instance
        await mainPage.exposeFunction("extractCourseInfo", TimeScheduleScraper.extractCourseInfo);

        // Scrape and export building information
        /*
        await BuildingInfoScraper.exportBuildingInfo(mainPage, false, function(data) {
            ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL, "detailed_building_info.json", "data", data);
        });
        */

        // Scrape and export time schedule information by major for a quarter
        /*
        await TimeScheduleScraper.exportCoursesByMajorAndQuarter(mainPage, "SPR2019", function(file_name, data) {
            ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL + "SPR2019/", file_name, "data", data);
        });
        */

        browser.close();
    } catch (error) {
        console.log(">> ERROR: ");
        console.log(error);
    }
})();