"use strict";

const ProgressBar = require('progress');
const BrowserUtils = require("../helpers/browser.js");

const COURSE_EVALUATIONS_CATALOG_URL = "https://www.washington.edu/cec/toc.html";

// 
const CEC_TOC_LINKS = "body > a";

//
const CEC_PAGE_LINKS = "body > a";

//
const CEC_TABLE = "body > table";

//
const CEC_PAGE_LINK_INFO_REGEX = /([\w\W\s&]+?(?=\s[A-Z]+\s))\s([A-Z]\s[A-Z]\s\d+|[A-Z]+\s\d+)\s([A-Z\d]+)\s{2,}([A-Za-z\s\,\.\'\-]+)\s{2,}([A-za-z\s\-\.]+)\s{2,}([A-Z]+\d+)/;

//
const CEC_COURSE_TABLE_CAPTION_REGEX = new RegExp(/[A-Za-z\s]+\:([A-Za-z\s\-\/]+)\s{2,}\"(\d+)\"[a-z\s]+\"(\d+)\"[a-z\s]+/);

/**
 * Checks a string for being defined 
 * @param {String} str - String captured by a course regex
 * @returns {String} - An empty string if the passed string is not valid, or the passed string with no surrounding whitespaces 
 */
function checkRegexGroup(str) {
    return (str === undefined || str == null || str == " " ? "" : str.trim());
}

/**
 * 
 * @param {*} page 
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
 * 
 * @param {*} page 
 * @param {*} url 
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
 * 
 * @param {*} page 
 * @param {*} url 
 * @param {*} linkText 
 */
async function scrapeCECCoursePage(page, url, linkText) {
    await BrowserUtils.navigateWithLoginCheck(page, url);

    var course = await page.evaluate((sel, tableCaptionRegexSource, tableCaptionRegexFlags) => {
        /**
         * Checks a string for being defined 
         * @param {String} str - String captured by a course regex
         * @returns {String} - An empty string if the passed string is not valid, or the passed string with no extra whitespaces 
         */
        var checkRegex = function (str) {
            return (str === undefined || str == null || str == " " ? "" : str.replace(/\s\s+/, " ").trim());
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

        return course;
    }, CEC_TABLE, CEC_COURSE_TABLE_CAPTION_REGEX.source, CEC_COURSE_TABLE_CAPTION_REGEX.flags);

    var pageLinkRegexResult = CEC_PAGE_LINK_INFO_REGEX.exec(linkText);

    if (pageLinkRegexResult != null) {
        course["title"] = checkRegexGroup(pageLinkRegexResult[1]);
        course["alias"] = checkRegexGroup(pageLinkRegexResult[2]);
        course["section"] = checkRegexGroup(pageLinkRegexResult[3]);
        course["instructor"] = checkRegexGroup(pageLinkRegexResult[4]);
        course["role"] = checkRegexGroup(pageLinkRegexResult[5]);
        course["quarter"] = checkRegexGroup(pageLinkRegexResult[6]);
    }

    return course;
}

/**
 * 
 * @param {*} page 
 */
async function scrapeCourseEvaluationsCatalog(page) {
    console.log("> Scraping UW Course Catalog Links");

    var cecTOCLinks = await scrapeCECTableOfContentsLinks(page);

    var courses = [];

    console.log("> Scraping UW Course Catalog Information");

    var bar = new ProgressBar(':bar :current/:total', {
        total: cecTOCLinks.length
    });

    for (let i = 0; i < cecTOCLinks.length; i++) {
        bar.tick();

        var coursePageLinks = await scrapeCECCoursePageLinks(page, cecTOCLinks[i]);

        for (let j = 0; j < coursePageLinks.length; j++) {
            var course = await scrapeCECCoursePage(page, coursePageLinks[j]["link"], coursePageLinks[j]["text"]);

            courses.push(course);
        }
    }

    return courses;
}

/**
 * 
 * @param {*} page 
 * @param {*} exportFunction 
 */
async function exportCourseEvaluationsCatalogByMajor(page, exportFunction) {
    console.log("> Scraping UW Course Catalog Links");

    var cecTOCLinks = await scrapeCECTableOfContentsLinks(page);

    console.log("> Scraping UW Course Catalog Information");

    var bar = new ProgressBar(':bar :current/:total', {
        total: cecTOCLinks.length
    });

    for (let i = 0; i < cecTOCLinks.length; i++) {
        bar.tick();

        var coursePageLinks = await scrapeCECCoursePageLinks(page, cecTOCLinks[i]);

        var majorMap = new Map();

        for (let j = 0; j < coursePageLinks.length; j++) {
            var course = await scrapeCECCoursePage(page, coursePageLinks[j]["link"], coursePageLinks[j]["text"]);

            var majorKey = checkRegexGroup(course["alias"].replace(/[0-9]/g, "").toLowerCase().trim());

            //
            if (majorKey != "") {
                var majorValue = majorMap.get(majorKey);

                if (majorValue == undefined) {
                    majorValue = [];
                }

                majorValue.push(course);
                majorMap.set(majorKey, majorValue);
            }
            else {
                console.log(">> Could not read alias for course: ");
                console.log("");
                console.log(course);
                console.log("<<");
                console.log("");
            }
        }

        // Export by major
        for (var key of myMap.keys()) {
            exportFunction(key + ".json", myMap.get(key));
        }
    }
}

/**
 * 
 * @param {*} page 
 * @param {*} exportFunction 
 */
async function exportCourseEvaluationsCatalog(page, exportFunction) {
    var courses = await scrapeCourseEvaluationsCatalog(page);

    exportFunction(courses);
}

module.exports = {
    scrapeCECTableOfContentsLinks,
    scrapeCECCoursePageLinks,
    scrapeCECCoursePage,
    scrapeCourseEvaluationsCatalog,
    exportCourseEvaluationsCatalog,
    exportCourseEvaluationsCatalogByMajor
};