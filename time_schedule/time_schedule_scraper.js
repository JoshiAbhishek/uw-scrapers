"use strict";

const ProgressBar = require('progress');
const BrowserUtils = require("../helpers/browser.js");
const CourseCatalogScraper = require("../course_catalog/course_catalog_scraper.js");

const TIME_SCHEDULE_URL = "https://www.washington.edu/students/timeschd/";

// Selector for links to courses offered by a major on its time schedule page
const MAJOR_LINK = "#uw-container-inner > div.container > div.row > ul > li > a";

// Selector for course SLN links from a major's time schedule page
const COURSE_LINK = "table > tbody > tr > td > pre > a:first-of-type";

// Regex for matching a course's credits
const COURSE_CREDITS_REGEX = new RegExp(/\s*(\d+\-\d+|\-\d+|\d+\-|\d+\/\d+|\/\d+|VAR|\d+\-\d+\,\smax\.\s\d+|\d+\/\d+\,\smax\.\s\d+|\*\,\smax\.\s\d+|\.\d+|\d+\.\d+|\d+|\s*)/);

// Regex for matching a course's type
const COURSE_TYPE_REGEX = new RegExp(/\s*(LB|QZ|SM|IS|CK|CL|CO|LC|PR|ST|\s*)/);

// Regex for matching a course's instructor
const COURSE_INSTRUCTOR_REGEX = new RegExp(/([A-Za-z'\.\-\s]+\,[A-Za-z'\.\-]+(\s(?!Open|Closed)[A-Za-z'\.\s\-\,]+?|\s*)|\s*)/);

// Regex for matching a course's meeting time (day and hour) and location (building and room)
const COURSE_TIME_AND_LOCATION_REGEX = new RegExp(/\s*(to\sbe\sarranged|[A-Za-z\.]+\s\d+\-\d+[P]*)\s*([A-Z\d]+\s[A-Z\d\+\-]+|\*\s\*|[\*]+?|\s*)/);

// Regex for matching a course's SLN and section
const COURSE_REGEX_START = new RegExp(/((?<=[A-Za-z>\s]+|\s*)\d+)\s([A-Z\d]+)/);

// Regex for matching a course's status, grading scheme (CR/NC or normal), fee, and other type
const COURSE_REGEX_END = new RegExp(/\s*(Open|Closed|\s*)\s*(\d+\/\s\d+(?:E|\s*))\s*(CR\/NC|\s*)\s*(\$\d+|\s*)(\s*(?<!\d+)[BDEHJORSW%#]|\s*)/);

/*
Course regex array results (by index):

0 - Original string
1 - SLN
2 - Section
3 - Credits
4 - Type
5 - Meeting day and time
6 - Location (building and room)
7 - Instructor
9 - Status
10 - Enrollment and limit
11 - CR/NC grading
12 - Fee
13 - Other
*/
const COURSE_REGEX = new RegExp(COURSE_REGEX_START.source + COURSE_CREDITS_REGEX.source + COURSE_TYPE_REGEX.source + COURSE_TIME_AND_LOCATION_REGEX.source + COURSE_INSTRUCTOR_REGEX.source + COURSE_REGEX_END.source);

// Adds an extend method to the base Array object for adding the contents of another array to the end of the current array
Array.prototype.extend = function (other) {
    other.forEach(function (v) {
        this.push(v)
    }, this);
}

/**
 * Checks a string for being defined and relevant (not equal to "to be arranged" or composed entirely of stars and spaces)
 * @param {String} str - String captured by a course regex
 * @returns {String} - An empty string if the passed string is not valid, or the passed string with no surrounding whitespaces 
 */
function checkRegexGroup(str) {
    return (str === undefined || str == null || str == " " || /[\*\s]+/.test(str.trim()) || str.trim() == "to be arranged" ? "" : str.trim());
}

/**
 * Extracts course details from the passed string representation of it as scraped from the UW Time Schedule
 * @param {String} str - String representation of a course section or lecture as scraped from the UW Time Schedule without formatting 
 * @param {Object} course - A JavaScript object representation of a course section
 * @returns {Object} - The passed course JavaScript Object with filled values for the course section's details 
 */
function extractCourseInfo(str, course) {
    if (checkRegexGroup(str) == "" || course === undefined || course == null) {
        return {};
    }

    if (!("time" in course)) {
        course["time"] = [];
    }

    if (!("location" in course)) {
        course["location"] = [];
    }

    if (!("instructor" in course)) {
        course["instructor"] = [];
    }

    // Split course string by newlines and replace multiple spaces with a single space (** important step for regex to work **)
    var courseInfoGroups = str.split(/\n/).map((i) => { return i.replace(/\s\s+/g, " ").trim() });

    // Execute Course regex
    var courseDetails = COURSE_REGEX.exec(courseInfoGroups[0]);

    if (courseDetails != null && courseDetails != "") {
        course["sln"] = courseDetails[1];
        course["section"] = courseDetails[2];
        course["credits"] = checkRegexGroup(courseDetails[3]);
        course["type"] = checkRegexGroup(courseDetails[4]);

        var meetingTime = checkRegexGroup(courseDetails[5]);
        if (meetingTime != "") {
            course["time"].push(meetingTime);
        }

        var location = checkRegexGroup(courseDetails[6]);
        if (location != "") {
            course["location"].push(location);
        }

        var instructor = checkRegexGroup(courseDetails[7]);
        if (instructor != "") {
            course["instructor"].push(instructor);
        }

        course["status"] = checkRegexGroup(courseDetails[9]);

        if (checkRegexGroup(courseDetails[10]) != "") {
            var enrSplit = courseDetails[10].split("/");

            course["enrollment"] = enrSplit[0].trim();
            course["limit"] = enrSplit[1].trim().replace("E", "");
        }

        course["grades"] = checkRegexGroup(courseDetails[11]);
        course["fee"] = checkRegexGroup(courseDetails[12]);
        course["other"] = checkRegexGroup(courseDetails[13]);
    }
    else {
        console.log(">> Could not read course: ");
        console.log("");
        console.log(str);
        console.log("<<");
        console.log("");
    }

    var notes = "";

    /*
    Other course time, location, and instructor regex array results (by index):

    0 - Original string
    1 - Meeting time and day
    2 - Location (Building and room)
    3 - Instructor
    */
    var courseTimeLocationAndInstructorRegex = new RegExp(COURSE_TIME_AND_LOCATION_REGEX.source + COURSE_INSTRUCTOR_REGEX.source);

    // Extract any other course time / location / instructor details and build notes
    for (let i = 1; i < courseInfoGroups.length; i++) {
        var currNotes = courseInfoGroups[i];

        var courseMeetingAndInstructor = courseTimeLocationAndInstructorRegex.exec(currNotes);

        if (courseMeetingAndInstructor != null) {
            var meetingTime = checkRegexGroup(courseMeetingAndInstructor[1]);
            if (meetingTime != "") {
                course["time"].push(meetingTime);
            }

            var location = checkRegexGroup(courseMeetingAndInstructor[2]);
            if (location != "") {
                course["location"].push(location);
            }

            // Add any remaining content from the regex match to the instructor details 
            var instructor = checkRegexGroup(courseMeetingAndInstructor[3]);
            if (instructor != "") {
                currNotes = currNotes.replace(courseTimeLocationAndInstructorRegex, "");

                if(currNotes.length > 0) {
                    instructor += currNotes;
                }

                course["instructor"].push(instructor);
            }
        }
        else {
            notes += " " + currNotes;
        }
    }

    course["notes"] = notes.trim();

    return course;
}

/**
 * Scrapes a course section's details from its corresponding NetID-only accessible detail page for course sections
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url - The URL of the course section's detail page
 * @returns {Object} - A JavaScript Object representing a course section's details 
 */
async function scrapeCourseSectionInfo(page, url) {
    await BrowserUtils.navigateWithLoginCheck(page, url);

    page.waitForSelector('h1');

    var course = await page.evaluate((sel) => {
        return [...document.querySelectorAll("p > table")[0].querySelectorAll(sel)].reduce(function (result, elem, index) {
            if (index == 0) {
                result["sln"] = elem.textContent.trim();
            } else if (index == 1) {
                result["alias"] = elem.textContent.replace(/\s\s+/g, " ").trim();
            } else if (index == 2) {
                result["section"] = elem.textContent.trim();
            } else if (index == 3) {
                result["type"] = elem.textContent.trim();
            } else if (index == 4) {
                result["credits"] = elem.textContent.trim();
            } else if (index == 5) {
                result["title"] = elem.textContent.trim();
                result["catalogURL"] = elem.querySelector("a").getAttribute("href");
            } else if (index == 6) {
                result["requirements"] = elem.textContent.trim();
            }

            return result;
        }, {});
    }, "tbody > tr:nth-child(2) > td > tt");

    course = await page.evaluate((sel, curr) => {
        return [...document.querySelectorAll("p > table")[1].querySelectorAll(sel)].reduce(function (result, elem, index) {
            if (index == 0) {
                result["enrollment"] = elem.textContent.trim();
            } else if (index == 1) {
                result["limit"] = elem.textContent.trim();
            } else if (index == 2) {
                result["capacity"] = elem.textContent.trim();
            } else if (index == 3) {
                result["space"] = elem.textContent.trim();
            } else if (index == 4) {
                result["status"] = elem.textContent.trim();
            }

            return result;
        }, curr);
    }, "tbody > tr:nth-child(2) > td > tt", course);

    course = await page.evaluate((sel, curr) => {
        return [...document.querySelectorAll("p > table")[2].querySelectorAll(sel)].reduce(function (result, elem, index, arr) {
            if (arr.length == 1) {
                result["days"] = elem.textContent.trim();
                result["time"] = elem.textContent.trim();
                result["location"] = elem.textContent.trim();
                result["instructor"] = elem.textContent.trim();
            } else if (arr.length == 2) {
                if (index == 0) {
                    result["days"] = elem.textContent.trim();
                    result["time"] = elem.textContent.trim();
                    result["location"] = elem.textContent.trim();
                } else {
                    result["instructor"] = elem.textContent.trim();
                }
            } else if (arr.length == 3) {
                if (index == 0) {
                    result["days"] = elem.textContent.trim();
                    result["time"] = elem.textContent.trim();
                } else if (index == 1) {
                    result["location"] = elem.textContent.trim();
                } else {
                    result["instructor"] = elem.textContent.trim();
                }
            } else if (arr.length == 4) {
                if (index == 0) {
                    result["days"] = elem.textContent.trim();
                } else if (index == 1) {
                    result["time"] = elem.textContent.trim();
                } else if (index == 2) {
                    result["location"] = elem.textContent.trim();
                } else {
                    result["instructor"] = elem.textContent.trim();
                }
            } else {
                result["days"] = "";
                result["time"] = "";
                result["location"] = "";
                result["instructor"] = "";
            }

            return result;
        }, curr);
    }, "tbody > tr:nth-child(3) > td > tt", course);

    course["notes"] = await page.evaluate((sel) => {
        return document.querySelectorAll("p > table")[3].querySelector(sel).innerText.replace(/\s+/g, " ").trim();
    }, "tbody > tr:nth-child(2) > td > tt");

    // Retrieve information for the course from the UW Course Catalog
    course = await CourseCatalogScraper.scrapeCatalogInfoForCourse(page, course["catalogURL"], course);

    delete course["catalogURL"];

    return course;
}

/**
 * Scrapes course section information for a major's time schedule using the UW NetID-only accessible detail pages for course sections
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url - The URL for a major's time schedule page to scrape
 * @returns {Object[]} - An array of the scraped course section objects
 */
async function scrapeCoursesForMajorWithDetails(page, url) {
    await page.goto(url);

    var courses = await page.evaluate((sel) => {
        return [...document.querySelectorAll(sel)].map(async function (elem) {
            var href = elem.href;

            if (href != null) {
                return await scrapeCourseSectionInfo(page, href);
            }
        });
    }, COURSE_LINK);

    return courses;
}

/**
 * Scrapes course section information for a major's time schedule
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url - The URL for a major's time schedule page to scrape
 * @param {Object[]} courses - An array of the scraped course section objects
 */
async function scrapeCoursesForMajor(page, url, courses, includeCatalogInfo) {
    if (courses === undefined || courses == null) {
        courses = [];
    }

    await page.goto(url);

    var majorCourses = await page.evaluate(async (sel, courses, includeCatalogInfo) => {
        var tables = [...document.querySelectorAll(sel)];

        var courseTitle = "";
        var courseAlias = "";
        var courseGenEdReqs = "";
        var courseCatalogURL = "";

        for (let i = 3; i < tables.length; i++) {
            var course = {
                "title": courseTitle,
                "alias": courseAlias,
                "sln": "",
                "section": "",
                "credits": "",
                "type": "",
                "time": [],
                "location": [],
                "instructor": [],
                "enrollment": "",
                "limit": "",
                "grades": "",
                "capacity": "",
                "space": "",
                "fee": "",
                "other": "",
                "requirements": courseGenEdReqs,
                "status": "",
                "notes": ""
            };

            if (includeCatalogInfo) {
                course["catalogURL"] = courseCatalogURL;
            }

            var pre = tables[i].querySelector("td > pre");

            // Course section details appear within a <pre> html element
            if (pre != null) {
                course = extractCourseInfo(pre.textContent, course);

                courses.push(course);
            } else {
                // Retrieve course details
                var aTags = tables[i].querySelector("td").querySelectorAll("a");

                courseAlias = aTags[0].textContent.replace(/\s\s+/g, " ").trim();
                courseTitle = aTags[1].textContent.trim();
                courseCatalogURL = aTags[1].href;
                courseGenEdReqs = tables[i].querySelector("td:nth-child(2) b").textContent.trim();
            }
        }

        return Promise.all(courses);
    }, "table", courses, CourseCatalogScraper, includeCatalogInfo);

    // Get Course Catalog information (Course description, prerequisites, and full title)
    if (includeCatalogInfo) {
        for (let i = 0; i < majorCourses.length; i++) {
            majorCourses[i] = await CourseCatalogScraper.scrapeCatalogInfoForCourse(page, majorCourses[i]["catalogURL"], majorCourses[i]);
            delete majorCourses[i]["catalogURL"];
        }
    }

    return majorCourses;
}

/**
 * Scrapes links for major's time schedule pages of a quarter
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} quarter - The desired quarter to scrape
 * @returns {String[]} - The scraped links for majors' time schedule pages
 */
async function scrapeMajorLinksByQuarter(page, quarter) {
    await page.goto(TIME_SCHEDULE_URL + quarter);

    var major_links = await page.evaluate((sel) => {
        return [...document.querySelectorAll(sel)].reduce(function (result, elem) {
            if (elem.href != null && elem.getAttribute("href") != null && elem.getAttribute("href").charAt(0) != "#") {
                result.push(elem.href.trim());
            }

            return result;
        }, []);
    }, MAJOR_LINK);

    return major_links;
}

/**
 * Scrapes course section information of all majors' time schedules for a quarter
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} quarter - The desired quarter to scrape
 * @returns {Object[]} - An array of the scraped course section objects
 */
async function scrapeAllCoursesByQuarter(page, quarter) {
    console.log("> Scraping UW Time Schedule Major Links");

    var major_links = await scrapeMajorLinksByQuarter(page, quarter);

    console.log("> Scraping UW Time Schedule Course Information");

    var bar = new ProgressBar(':bar :current/:total', {
        total: major_links.length
    });

    var courses = [];

    for (let i = 0; i < major_links; i++) {
        bar.tick();

        courses = await scrapeCoursesForMajor(page, major_links[i], courses);
    }

    return courses;
}

/**
 * Scrapes and exports course section information for each major's time schedule in a quarter
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} quarter - The desired quarter to scrape
 * @param {Function} exportFunction - The exportFunction to callback with a file name and data
 */
async function exportCoursesByMajorAndQuarter(page, quarter, exportFunction) {
    console.log("> Scraping UW Time Schedule Major Links");

    var major_links = await scrapeMajorLinksByQuarter(page, quarter);

    console.log("> Scraping UW Time Schedule Course Information");

    var bar = new ProgressBar(':bar :current/:total', {
        total: major_links.length
    });

    for (let i = 0; i < major_links.length; i++) {
        bar.tick();

        var courses = await scrapeCoursesForMajor(page, major_links[i], []);

        var link = major_links[i].match(/.*\/([\w\W]+\.html)/);

        if(link == null || checkRegexGroup(link[1]) == "") {
            console.log(">> Could not parse major link: " + major_links[i]);
        }
        else {
            exportFunction(link[1].replace(".html", "") + ".json", courses);
        }
    }
}

/**
 * Scrapes and exports all course section information for a quarter
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} quarter - The desired quarter to scrape
 * @param {Function} exportFunction - The exportFunction to callback with data
 */
async function exportAllCoursesByQuarter(page, quarter, exportFunction) {
    var courses = await scrapeAllCoursesByQuarter(page, quarter);

    exportFunction(courses);
}

/**
 * Scrapes and exports course section information for a major's quarterly time schedule page
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url - The URL for a major's time schedule page to scrape
 * @param {Function} exportFunction - The exportFunction to callback with data
 */
async function exportCoursesForMajor(page, url, exportFunction) {
    var courses = await scrapeCoursesForMajor(page, url, [], true);

    exportFunction(courses);
}

/**
 * Scrapes and exports links to majors' time schedule pages for a quarter
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} quarter - The desired quarter to scrape
 * @param {Function} exportFunction - The exportFunction to callback with data
 */
async function exportMajorLinksByQuarter(page, quarter, exportFunction) {
    var major_links = await scrapeMajorLinksByQuarter(page, quarter);

    exportFunction(major_links);
}

module.exports = {
    scrapeAllCoursesByQuarter,
    scrapeCoursesForMajor,
    scrapeCoursesForMajorWithDetails,
    scrapeCourseSectionInfo,
    scrapeMajorLinksByQuarter,
    extractCourseInfo,
    exportAllCoursesByQuarter,
    exportCoursesByMajorAndQuarter,
    exportCoursesForMajor,
    exportMajorLinksByQuarter
};