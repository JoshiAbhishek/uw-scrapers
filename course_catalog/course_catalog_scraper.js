"use strict";

const ProgressBar = require('progress');

const COURSE_CATALOG_URL = "http://www.washington.edu/students/crscat";

// Selector for links to courses offered by a major on its course catalog page
const MAJOR_LINK = "#uw-container-inner > div.container > div.row ul > li > a";

//
const COURSE_INFORMATION = "body > p > a[name]";

/*
Course title regex array results (by index):

0 - Original string
1 - Course alias
2 - Course name
3 - Course credits
4 - Course general education requirements
*/
const COURSE_TITLE_REGEX = /([A-Z]+\s\d+)\s([\w\W\s]+)\s(\([\w\W\s]+\))(.*)/;

/**
 * Checks a string for being defined 
 * @param {String} str - String captured by a course regex
 * @returns {String} - An empty string if the passed string is not valid, or the passed string with no surrounding whitespaces 
 */
function checkRegexGroup(str) {
    return (str === undefined || str == null || str == " " ? "" : str.trim());
}

// Adds an extend method to the base Array object for adding the contents of another array to the end of the current array
Array.prototype.extend = function (other) {
    other.forEach(function (v) {
        this.push(v)
    }, this);
}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @returns {String[]}
 */
async function scrapeCourseCatalogMajorLinks(page) {
    await page.goto(COURSE_CATALOG_URL);

    var majorLinks = await page.evaluate((sel) => {
        return [...document.querySelectorAll(sel)].reduce(function (result, elem) {
            if (elem.href != null && elem.getAttribute("href") != null && elem.getAttribute("href").charAt(0) != "#") {
                result.push(elem.href.trim());
            }

            return result;
        }, []);
    }, MAJOR_LINK);

    return majorLinks;
}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @param {Object} course 
 * @returns {Object}
 */
async function scrapeMajorHeaderInfo(page, course) {
    if (course === undefined || course == null) {
        course = {};
    }

    var title = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText.match(/[^\r\n]+/g);
    }, "body > h1");

    if (title.length == 3) {
        course["college"] = title[0];
        course["department"] = title[1];
        course["program"] = title[2];
    }
    else if (title.length == 2) {
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

        if (titleArr.length > 0) {
            course["title"] = titleArr[0].replace(course["alias"] + " ", "").trim();
        }

        var descrArr = elem.innerText.split("\n");
        if (descrArr != null && descrArr.length > 1) {
            course["description"] = descrArr[1].trim();
        }
        else {
            course["description"] = elem.innerText.trim();
        }

        var prereqArr = elem.innerText.match(/Prerequisite:\s*([\w\W\s&\d]+?(?=\.\s|\.$))/);
        if (prereqArr != null && prereqArr.length > 0) {
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
async function scrapeCoursesForMajor(page, url) {
    await page.goto(url);

    var courseBase = await scrapeMajorHeaderInfo(page, {});

    var courses = await page.evaluate((sel, courseBase, regexSource, regexFlags) => {
        /**
         * Checks a string for being defined and relevant (not equal to "to be arranged" or composed entirely of stars and spaces)
         * @param {String} str - String captured by a course regex
         * @returns {String} - An empty string if the passed string is not valid, or the passed string with no surrounding whitespaces 
         */
        var checkRegex = function (str) {
            return (str === undefined || str == null || str == " " ? "" : str.replace(/\s\s+/, " ").trim());
        };

        return [...document.querySelectorAll(sel)].map((elem) => {
            var course = { ...courseBase };

            var courseTitleRegexResult = new RegExp(regexSource, regexFlags).exec(elem.querySelector("b").textContent);

            course["alias"] = checkRegex(courseTitleRegexResult[1]);
            course["title"] = checkRegex(courseTitleRegexResult[2]);
            course["credits"] = checkRegex(courseTitleRegexResult[3]);
            course["requirements"] = checkRegex(courseTitleRegexResult[4]);

            var descrArr = elem.innerText.split("\n");
            if (descrArr != null && descrArr.length > 1) {
                course["description"] = descrArr[1].trim();
            }
            else {
                course["description"] = elem.innerText.trim();
            }
            
            var prereqArr = elem.innerText.match(/Prerequisite:\s*([\w\W\s&\d]+?(?=\.\s|\.$))/);
            if (prereqArr != null && prereqArr.length > 0) {
                course["prerequisites"] = prereqArr[1].replace("and ", "").split("; ");
            }
            else {
                course["prerequisites"] = "";
            }

            return course;
        });
    }, COURSE_INFORMATION, courseBase, COURSE_TITLE_REGEX.source, COURSE_TITLE_REGEX.flags);

    return courses;
}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @returns {Object[]}
 */
async function scrapeCourseCatalog(page) {
    console.log("> Scraping UW Course Catalog Major Links");

    var majorLinks = await scrapeCourseCatalogMajorLinks(page);

    console.log("> Scraping UW Course Catalog Information");

    var bar = new ProgressBar(':bar :current/:total', {
        total: majorLinks.length
    });

    var courses = [];

    for (let i = 0; i < majorLinks.length; i++) {
        bar.tick();

        var majorCourses = await scrapeCoursesForMajor(page, majorLinks[i]);

        courses.extend(majorCourses);
    }

    return courses;
}

/**
 * 
 * @param {Object} page - The current Puppeteer page instance
 * @param {Function} exportFunction - The exportFunction to callback with file name and data
 */
async function exportCourseCatalogByMajor(page, exportFunction) {
    console.log("> Scraping UW Course Catalog Major Links");

    var majorLinks = await scrapeCourseCatalogMajorLinks(page);

    console.log("> Scraping UW Course Catalog Information");

    var bar = new ProgressBar(':bar :current/:total', {
        total: majorLinks.length
    });

    for (let i = 0; i < majorLinks.length; i++) {
        bar.tick();

        var courses = await scrapeCoursesForMajor(page, majorLinks[i]);

        var link = majorLinks[i].match(/.*\/([\w\W]+\.html)/);

        if (checkRegexGroup(link[1]) == "") {
            console.log(">> Could not parse major link: " + majorLinks[i]);
        }
        else {
            exportFunction(link[1].replace(".html", "") + ".json", courses);
        }
    }
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
    var courses = await scrapeCoursesForMajor(page, url, []);

    exportFunction(courses);
}

module.exports = {
    scrapeCourseCatalogMajorLinks,
    scrapeCatalogInfoForCourse,
    scrapeCourseCatalog,
    scrapeCoursesForMajor,
    exportCourseCatalogByMajor,
    exportCourseCatalog,
    exportMajorCourses
};