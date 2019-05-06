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
const CEC_PAGE_LINK_INFO_REGEX = /([\w\W\s&]+)\s([A-Z]+\s\d+)\s([A-Z\d]+)\s{2,}([A-Za-z\s\,\.\'\-]+)\s{2,}([A-za-z\s\-\.]+)\s{2,}([A-Z]+\d+)/;

//
const CEC_COURSE_TABLE_REGEX = new RegExp(/[A-Za-z\s]+\:([A-Za-z\s]+)\s{2,}\"(\d+)\"[a-z\s]+\"(\d+)\"[a-z\s]+/);

/**
 * Checks a string for being defined 
 * @param {String} str - String captured by a course regex
 * @returns {String} - An empty string if the passed string is not valid, or the passed string with no surrounding whitespaces 
 */
function checkRegexGroup(str) {
    return (str === undefined || str == null || str == " " ? "" : str.trim());
}

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

async function scrapeCECCoursePageLinks(page, url) {
    await BrowserUtils.navigateWithLoginCheck(page, url);

    var pageLinks = await page.evaluate((sel) => {
        return [...document.querySelectorAll(sel)].reduce(function (result, elem) {
            if (elem.href != null && elem.getAttribute("href") != null && !elem.getAttribute("href").startsWith("/cec/")) {
                result.push(elem.href.trim());
            }

            return result;
        }, []);
    }, CEC_PAGE_LINKS);

    return pageLinks;
}

async function scrapeCECCoursePage(page, url, linkText) {
    await BrowserUtils.navigateWithLoginCheck(page, url);

    var course = await page.evaluate((sel, tableRegexSource, tableRegexFlags) => {
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
            var tableCaptionRegexResult = new RegExp(tableRegexSource, tableRegexFlags).exec(tableCaption);

            if (tableCaptionRegexResult != null) {
                course["lectureFormat"] = checkRegex(tableCaptionRegexResult[1]);

                course["surveyed"] = checkRegex(tableCaptionRegexResult[2]);

                course["enrolled"] = checkRegex(tableCaptionRegexResult[3]);
            }
        }

        course["questions"] = [...document.querySelectorAll(sel + " tr")].reduce(function (result, elem, index) {
            if (index > 0) {
                var courseEval = {};

                courseEval["question"] = elem.querySelector("td:nth-child(1)").textContent.trim();

                courseEval["excellent"] = elem.querySelector("td:nth-child(2)").textContent.trim();

                courseEval["very_good"] = elem.querySelector("td:nth-child(3)").textContent.trim();

                courseEval["good"] = elem.querySelector("td:nth-child(4)").textContent.trim();

                courseEval["fair"] = elem.querySelector("td:nth-child(5)").textContent.trim();

                courseEval["poor"] = elem.querySelector("td:nth-child(6)").textContent.trim();

                courseEval["very_poor"] = elem.querySelector("td:nth-child(7)").textContent.trim();

                courseEval["median"] = elem.querySelector("td:nth-child(8)").textContent.trim();

                result.push(courseEval);
            }
        }, []);
    }, CEC_TABLE);

    var pageLinkRegexResult = CEC_PAGE_LINK_INFO_REGEX.exec(linkText);

    if(pageLinkRegexResult != null) {
        course["title"] = checkRegexGroup(pageLinkRegexResult[1]);

        course["alias"] = checkRegexGroup(pageLinkRegexResult[1]);

        course["section"] = checkRegexGroup(pageLinkRegexResult[1]);

        course["instructor"] = checkRegexGroup(pageLinkRegexResult[1]);

        course["role"] = checkRegexGroup(pageLinkRegexResult[1]);

        course["quarter"] = checkRegexGroup(pageLinkRegexResult[1]);
    }

    return course;
}

async function scrapeCourseEvaluationsCatalog(page) {

}

async function exportCourseEvaluationsCatalogByMajor(page, exportFunction) {

}

async function exportCourseEvaluationsCatalog(page, exportFunction) {

}

module.exports = {
    scrapeCECTableOfContentsLinks,
    scrapeCECCoursePageLinks,
    scrapeCECCoursePage,
    scrapeCourseEvaluationsCatalog,
    exportCourseEvaluationsCatalog,
    exportCourseEvaluationsCatalogByMajor
};