"use strict";

const ProgressBar = require('progress');

const COURSE_CATALOG_URL = "http://www.washington.edu/students/crscat";

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @returns {String[]}
 */
async function scrapeCourseCatalogMajorLinks(page) {

}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @param {Object} course 
 * @returns {Object}
 */
async function scrapeMajorHeaderInfo(page, course) {
    var title = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText.match(/[^\r\n]+/g);
    }, "body > h1");

    if (title.length == 3) {
        course["college"] = title[0];
        course["department"] = title[1];
        course["program"] = title[2];
    } 
    else if(title.length == 2) {
        course["college"] = title[0];
        course["department"] = title[1];
        course["program"] = title[1];
    }
    else {
        course["college"] = "";
        course["department"] = "";
        course["program"] = "";
    }

    return course;
}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url 
 * @param {Object} course 
 * @returns {Object}
 */
async function scrapeCatalogInfoForCourse(page, url, course) {
    await page.goto(url);

    course = await scrapeMajorHeaderInfo(page, course);

    course = await page.evaluate((sel, course) => {
        var elem = document.getElementsByName(sel)[1];

        var titleArr = elem.querySelector("b").textContent.match(/[^(]*/);

        if(titleArr.length > 0) {
            course["title"] = titleArr[0].replace(course["alias"] + " ", "").trim();
        }

        var descrArr = elem.innerText.split("\n");
        if(descrArr != null && descrArr.length > 1) {
            course["description"] = descrArr[1].trim();
        }
        else {
            course["description"] = elem.innerText.trim();
        }

        var prereqArr = elem.innerText.match(/Prerequisite: (.*)(?:[^\.]|\.(?=\d))*/);
        if(prereqArr != null && prereqArr.length > 0) {
            course["prerequisites"] = prereqArr[1].replace("and ", "").split("; ");
        }
        else {
            course["prerequisites"] = "";
        } 

        return course;
    }, url.split("#")[1], course);

    return course;
}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url 
 * @returns {Object[]}
 */
async function scrapeMajorCourses(page, url) {
    await page.goto(url);

}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @returns {Object[]}
 */
async function scrapeCourseCatalog(page) {

}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @param {Function} exportFunction - The exportFunction to callback with file name and data
 */
async function exportCourseCatalogByMajor(page, exportFunction) {

}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @param {Function} exportFunction - The exportFunction to callback with data
 */
async function exportCourseCatalog(page, exportFunction) {
    var courses = await scrapeCourseCatalog(page);

    exportFunction(courses);
}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url 
 * @param {Function} exportFunction - The exportFunction to callback with data
 */
async function exportMajorCourses(page, url, exportFunction) {
    var courses = await scrapeMajorCourses(page, url);

    exportFunction(courses);
}

module.exports = {
    scrapeCatalogInfoForCourse,
    scrapeCourseCatalog,
    scrapeMajorCourses,
    exportCourseCatalog,
    exportMajorCourses
};