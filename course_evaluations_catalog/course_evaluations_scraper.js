"use strict";

const ProgressBar = require('progress');
const BrowserUtils = require("../helpers/browser.js");

const COURSE_EVALUATIONS_CATALOG_URL = "https://www.washington.edu/cec/toc.html";

// Selector for CEC table of contents page links
const CEC_TOC_LINKS = "body > a";

// Selector for CEC course evaluation page links
const CEC_PAGE_LINKS = "body > a";

// Selector for CEC course evaluation page tables
const CEC_TABLE = "body > table";

/*
CEC page link text regex array results (by index):

0 - Original string
1 - Title
2 - Alias
3 - Section
4 - Instructor
5 - Role
6 - Quarter
*/
const CEC_PAGE_LINK_INFO_REGEX = /([\w\W\s&]+?(?=\s[A-Z]+\s))\s([A-Z]\s[A-Z]\s\d+|[A-Z]+\s\d+)\s([A-Z\d]+)\s{2,}([A-Za-z\s\,\.\'\-]+)\s{2,}([A-za-z\s\-\.]+)\s{2,}([A-Z]+\d+)/;

/*
CEC page header regex array results (by index):

0 - Original string
1 - Department
2 - Major (Part one)
3 - Major (Part two)
4 - Course alias
5 - Course section
*/
const CEC_PAGE_HEADING_ONE_REGEX = /([\w\W\s&]+?)(\s[A-Z]\s|\s)([A-Z\s]+)\s(\d+)(\s[A-Z{1,3}|\s*])/;

/*
CEC page secondary header regex array (by index):

0 - Original string
1 - Instructor
2 - Instructor profession
3 - Quarter
*/
const CEC_PAGE_HEADING_TWO_REGEX = /([A-Za-z\'\-\.\s]+)\s{2,5}([A-Za-z\s]+)\s{2,5}([A-Z]+\d+)/;

// Regex for matching a course's lecture type, surveyed students, and enrolled students
const CEC_COURSE_TABLE_CAPTION_REGEX = new RegExp(/[A-Za-z\s]+\:([A-Za-z\s\-\/]+)\s{2,}\"(\d+)\"[a-z\s]+\"(\d+)\"[a-z\s]+/);

// Adds an extend method to the base Array object for adding the contents of another array to the end of the current array
Array.prototype.extend = function (other) {
    other.forEach(function (v) {
        this.push(v)
    }, this);
}

/**
 * Checks a string for being defined 
 * @param {String} str - String captured by a course regex
 * @returns {String} - An empty string if the passed string is not valid, or the passed string with no surrounding whitespaces 
 */
function checkRegexGroup(str) {
    return (str === undefined || str == null || str == " " ? "" : str.trim());
}

/**
 * Scrapes links for CEC table of contents pages
 * @param {Object} page - The current Puppeteer page instance
 * @returns {String[]} - The scraped links for CEC table of contents pages
 */
async function scrapeCECTableOfContentsLinks(page) {
    await BrowserUtils.navigateWithLoginCheck(page, COURSE_EVALUATIONS_CATALOG_URL);

    var pageLinks = await page.evaluate((sel) => {
        return [...document.querySelectorAll(sel)].reduce(function (result, elem) {
            if (elem.href != null && elem.getAttribute("href") != null && !elem.getAttribute("href").startsWith("/cec/")) {
                result.push(elem.href.trim());
            }

            return result;
        }, []);
    }, CEC_TOC_LINKS);

    return pageLinks;
}

/**
 * Scrapes links for CEC course evaluations pages
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url - The URL for a CEC table of contents page to scrape
 * @returns {Object[]} - The scraped links and their link text for course evaluations pages
 */
async function scrapeCECCoursePageLinks(page, url) {
    await BrowserUtils.navigateWithLoginCheck(page, url);

    var pageLinks = await page.evaluate((sel) => {
        return [...document.querySelectorAll(sel)].reduce(function (result, elem) {
            if (elem.href != null && elem.getAttribute("href") != null && !elem.getAttribute("href").startsWith("/cec/")) {
                result.push({
                    "link": elem.href.trim(),
                    "text": elem.textContent.trim()
                });
            }

            return result;
        }, []);
    }, CEC_PAGE_LINKS);

    return pageLinks;
}

/**
 * Scrapes a course's evaluation
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url - The URL of a CEC course evaluations page
 * @param {String} linkText - The CEC table of contents link's text with course information
 * @returns {Object} - A JavaScript Object representing a course evaluation
 */
async function scrapeCECCoursePage(page, url) {
    await BrowserUtils.navigateWithLoginCheck(page, url);

    var course = await page.evaluate((sel, tableCaptionRegexSource, tableCaptionRegexFlags, cecPageHeaderRegexSource, cecPageHeaderRegexFlags, cecPageHeaderTwoRegexSource, cecPageHeaderTwoRegexFlags) => {
        /**
         * Checks a string for being defined and replaces extra whitespace
         * @param {String} str - String captured by a course regex
         * @returns {String} - An empty string if the passed string is not valid, or the passed string with no extra whitespaces 
         */
        var checkRegex = function (str) {
            return checkRegexSimple(str).replace(/\s\s+/, " ").trim();
        };

        /**
         * Checks a string for being defined, but does not replace extra whitespace
         * @param {String} str - String captured by a course regex
         * @returns {String} - An empty string if the passed string is not valid, or the passed string
         */
        var checkRegexSimple = function (str) {
            return str === undefined || str == null || str == " " ? "" : str;
        };

        var course = {};

        var tableCaption = document.querySelector(sel + " caption").textContent;

        if (tableCaption != null) {
            var tableCaptionRegexResult = new RegExp(tableCaptionRegexSource, tableCaptionRegexFlags).exec(tableCaption);

            if (tableCaptionRegexResult != null) {
                course["lectureFormat"] = checkRegex(tableCaptionRegexResult[1]);
                course["surveyed"] = checkRegex(tableCaptionRegexResult[2]);
                course["enrolled"] = checkRegex(tableCaptionRegexResult[3]);
            }
            else {
                course["lectureFormat"] = "";
                course["surveyed"] = "";
                course["enrolled"] = "";
            }
        }

        course["questions"] = [...document.querySelectorAll(sel + " tr")].reduce(function (result, elem, index) {
            if (index > 0) {
                var courseEval = {};

                courseEval["question"] = elem.querySelector("td:nth-child(1)").textContent.replace(":", "").trim();
                courseEval["excellent"] = elem.querySelector("td:nth-child(2)").textContent.trim();
                courseEval["very_good"] = elem.querySelector("td:nth-child(3)").textContent.trim();
                courseEval["good"] = elem.querySelector("td:nth-child(4)").textContent.trim();
                courseEval["fair"] = elem.querySelector("td:nth-child(5)").textContent.trim();
                courseEval["poor"] = elem.querySelector("td:nth-child(6)").textContent.trim();
                courseEval["very_poor"] = elem.querySelector("td:nth-child(7)").textContent.trim();
                courseEval["median"] = elem.querySelector("td:nth-child(8)").textContent.trim();

                result.push(courseEval);
            }

            return result;
        }, []);

        var cecPageHeader = document.querySelector("h1");
        var cecPageSecondaryHeader = document.querySelector("h2");

        if (cecPageHeader != undefined && cecPageHeader != null) {
            cecPageHeader = cecPageHeader.textContent;

            var cecPageHeaderRegexResult = new RegExp(cecPageHeaderRegexSource, cecPageHeaderRegexFlags).exec(cecPageHeader);

            if (cecPageHeaderRegexResult != null) {
                course["department"] = checkRegexSimple(cecPageHeaderRegexResult[1]);
                course["major"] = (checkRegexSimple(cecPageHeaderRegexResult[2]) + " " + checkRegexSimple(cecPageHeaderRegexResult[3])).trim();

                course["alias"] = checkRegexSimple(cecPageHeaderRegexResult[4]);
                course["section"] = checkRegexSimple(cecPageHeaderRegexResult[5]);
            }
        }

        if (cecPageSecondaryHeader != undefined && cecPageSecondaryHeader != null) {
            cecPageSecondaryHeader = cecPageSecondaryHeader.textContent;

            var cecPageHeaderTwoRegexResult = new RegExp(cecPageHeaderTwoRegexSource, cecPageHeaderTwoRegexFlags).exec(cecPageSecondaryHeader);

            if (cecPageHeaderTwoRegexResult != null) {
                course["instructor"] = checkRegexSimple(cecPageHeaderTwoRegexResult[1]);
                course["instructorType"] = checkRegexSimple(cecPageHeaderTwoRegexResult[2]);
                course["quarter"] = checkRegexSimple(cecPageHeaderTwoRegexResult[3]);
            }
        }

        return course;
    }, CEC_TABLE, CEC_COURSE_TABLE_CAPTION_REGEX.source, CEC_COURSE_TABLE_CAPTION_REGEX.flags, CEC_PAGE_HEADING_ONE_REGEX.source, CEC_PAGE_HEADING_ONE_REGEX.flags, CEC_PAGE_HEADING_TWO_REGEX.source, CEC_PAGE_HEADING_TWO_REGEX.flags);

    return course;
}

/**
 * Scrapes UW course evaluations for the past year
 * @param {Object} page - The current Puppeteer page instance
 * @returns {Object[]} - An array of the scraped course evaluations
 */
async function scrapeCourseEvaluationsCatalog(page) {
    console.log("> Scraping UW Course Catalog Links");

    var cecTOCLinks = await scrapeCECTableOfContentsLinks(page);

    var coursePageLinks = [];

    for (let i = 0; i < cecTOCLinks.length; i++) {
        var links = await scrapeCECCoursePageLinks(page, cecTOCLinks[i]);

        coursePageLinks.extend(links);
    }

    console.log("> Scraping UW Course Catalog Information");

    var courses = [];

    var bar = new ProgressBar(':bar :current/:total', {
        total: coursePageLinks.length
    });

    for (let j = 0; j < coursePageLinks.length; j++) {
        bar.tick();

        var course = await scrapeCECCoursePage(page, coursePageLinks[j]["link"]);

        courses.push(course);
    }

    return courses;
}

/**
 * Scrapes course evaluations for the current table contents page
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url - The URL for a CEC table of contents page to scrape
 * @returns {Map<String, Object[]>} - A map of course alias to an array of course evaluations objects
 */
async function scrapeCourseEvaluationsCatalogContentsPage(page, url) {
    var coursePageLinks = await scrapeCECCoursePageLinks(page, url);

    var majorMap = {};

    var bar = new ProgressBar(':bar :current/:total', {
        total: coursePageLinks.length
    });

    for (let j = 0; j < coursePageLinks.length; j++) {
        bar.tick();

        var course = await scrapeCECCoursePage(page, coursePageLinks[j]["link"]);

        //var majorKey = checkRegexGroup(course["alias"].replace(/[0-9]/g, "").toLowerCase().trim());
        
        var majorKey = course["major"].toLowerCase().replace(/\s+/g, "").trim();

        //
        if (majorKey != "") {
            if (course.hasOwnProperty("instructor") && course["instructor"] != "") {
                if (!majorMap.hasOwnProperty(majorKey)) {
                    majorMap[majorKey] = [];
                }

                majorMap[majorKey].push(course);
            }
        }
        else {
            console.log(">> Could not read alias for course: ");
            console.log("");
            console.log(course);
            console.log("<<");
            console.log("");
        }
    }

    return majorMap;
}

/**
 * Scrapes and exports course evaluations by major program
 * @param {Object} page - The current Puppeteer page instance
 * @param {Function} exportFunction - The exportFunction to callback with a file name and data
 */
async function exportCourseEvaluationsCatalogByMajor(page, exportFunction) {
    console.log("> Scraping UW Course Catalog Links");

    var cecTOCLinks = await scrapeCECTableOfContentsLinks(page);

    console.log("> Scraping UW Course Catalog Information");

    for (let i = 0; i < cecTOCLinks.length; i++) {
        console.log("Scraping CEC Table of Contents Page " + i + 1 + " / " + cecTOCLinks.length);

        var courseEvaluationsMap = await scrapeCourseEvaluationsCatalogContentsPage(page, cecTOCLinks[i]);

        // Export by major
        for (var key of Object.keys(courseEvaluationsMap)) {
            exportFunction(key + ".json", courseEvaluationsMap[key]);
        }
    }
}

/**
 * Scrapes and exports course evaluations for all courses
 * @param {Object} page - The current Puppeteer page instance
 * @param {Function} exportFunction - The exportFunction to callback with data
 */
async function exportCourseEvaluationsCatalog(page, exportFunction) {
    var courses = await scrapeCourseEvaluationsCatalog(page);

    exportFunction(courses);
}

module.exports = {
    scrapeCECTableOfContentsLinks,
    scrapeCECCoursePageLinks,
    scrapeCourseEvaluationsCatalogContentsPage,
    scrapeCECCoursePage,
    scrapeCourseEvaluationsCatalog,
    exportCourseEvaluationsCatalog,
    exportCourseEvaluationsCatalogByMajor
};