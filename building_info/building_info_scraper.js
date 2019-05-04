"use strict";

const ProgressBar = require('progress');
const BrowserUtils = require("../helpers/browser.js");
const BuildingHoursParser = require("./building_hours_parser.js");

// Selector for building information rows on the main UW Facilities Building page
const BUILDING_TABLE_ROW = '#main_content > div.region.region-content > #block-system-main > div.view.view-buildings.view-id-buildings > div.view-content > div.table-responsive > table > tbody > tr';

// Selector for a building's information card on its facilities detail page
const BUILDING_INFO_CARD = '#uw-container-inner > div.container.uw-body > div.row > aside.col-md-4.uw-sidebar > div.region > section.block > div.view > div.view-content > div > div.no-image-card';

/**
 * Scrapes all building information from the UW Facilities Building portal
 * @param {Object} page - The current Puppeteer page instance
 * @param {Boolean} formatHours - States whether the building's hours should be parsed and formated by day of week or not
 * @returns {Object[]} - An array of the scraped building information objects
 */
async function scrapeBuildingInfo(page, formatHours) {
    await BrowserUtils.navigateWithLoginCheck(page, "https://facilities.uw.edu/bldg");

    await page.waitForSelector('#block-system-main', {
        visible: true
    });

    var building_ids = await page.evaluate((sel) => {
        return [...document.querySelectorAll(sel)].map((div) => {
            return div.querySelector('td:nth-child(1)').textContent.trim();
        })
    }, BUILDING_TABLE_ROW);

    let buildings = [];

    var bar = new ProgressBar(':bar :current/:total', {
        total: building_ids.length
    });

    console.log("> Scraping UW Building Information");

    for (let i = 0; i < building_ids.length; i++) {
        bar.tick();

        await page.goto('https://facilities.uw.edu/bldg/' + building_ids[i], {
            waitUntil: 'load',
            timeout: 0
        });

        var building_info = await page.evaluate((sel, formatHours) => {
            let building_card = document.querySelector(sel);

            if (building_card == null) {
                console.log("Error: Null building card");
                return;
            }

            let building_detail_wrappers = [...building_card.querySelectorAll('div.item-wrapper')];

            var address = "";
            var city = "";
            var state = "";
            var zip = "";
            var facNum = "";
            var facCode = "";
            var ownership = "";
            var site = "";
            var custodialHours = "";
            var regularHours = "";
            var holidayHours = "";

            building_detail_wrappers.forEach(building_detail => {
                var spanText = building_detail.querySelector('span').textContent.trim();

                if (spanText != null) {
                    switch (spanText) {
                        case "Street Address":
                            address = building_detail.querySelector('div.street-block > div.thoroughfare')
                            address == null ? address = "" : address = address.textContent.trim();

                            city = building_detail.querySelector('div.addressfield-container-inline > span.locality');
                            city == null ? city = "" : city = city.textContent.trim();

                            state = building_detail.querySelector('div.addressfield-container-inline > span.state');
                            state == null ? state = "" : state = state.textContent.trim();

                            zip = building_detail.querySelector('div.addressfield-container-inline > span.postal-code');
                            zip == null ? zip = "" : zip = zip.textContent.trim();

                            break;
                        case "FacNum":
                            for (var i = 0; i < building_detail.childNodes.length; ++i)
                                if (building_detail.childNodes[i].nodeType === 3)
                                    facNum = building_detail.childNodes[i].textContent.trim();
                            break;
                        case "FacCode":
                            for (var i = 0; i < building_detail.childNodes.length; ++i)
                                if (building_detail.childNodes[i].nodeType === 3)
                                    facCode = building_detail.childNodes[i].textContent;
                            break;
                        case "Ownership":
                            for (var i = 0; i < building_detail.childNodes.length; ++i)
                                if (building_detail.childNodes[i].nodeType === 3)
                                    ownership = building_detail.childNodes[i].textContent;
                            break;
                        case "Site":
                            for (var i = 0; i < building_detail.childNodes.length; ++i)
                                if (building_detail.childNodes[i].nodeType === 3)
                                    site = building_detail.childNodes[i].textContent;
                            break;
                        case "Custodial Service Hours":
                            for (var i = 0; i < building_detail.childNodes.length; ++i)
                                if (building_detail.childNodes[i].nodeType === 3)
                                    custodialHours = building_detail.childNodes[i].textContent;

                            if (formatHours == true)
                                custodialHours = BuildingHoursParser.getBuildingHours(custodialHours);
                            break;
                        case "Regular Hours":
                            for (var i = 0; i < building_detail.childNodes.length; ++i)
                                if (building_detail.childNodes[i].nodeType === 3)
                                    regularHours = building_detail.childNodes[i].textContent;

                            if (formatHours == true)
                                regularHours = BuildingHoursParser.getBuildingHours(regularHours);
                            break;
                        case "Holiday Hours":
                            for (var i = 0; i < building_detail.childNodes.length; ++i)
                                if (building_detail.childNodes[i].nodeType === 3)
                                    holidayHours = building_detail.childNodes[i].textContent;

                            if (formatHours == true)
                                holidayHours = BuildingHoursParser.getBuildingHours(holidayHours);
                            break;
                        default:
                            break;
                    }
                }
            });
            
            return {
                "address": address,
                "city": city,
                "state": state,
                "zip": zip,
                "facNum": facNum,
                "facCode": facCode,
                "ownership": ownership,
                "site": site,
                "custodialHours": custodialHours,
                "regularHours": regularHours,
                "holidayHours": holidayHours
            };

        }, BUILDING_INFO_CARD, formatHours);

        buildings.push(building_info);
    }

    return buildings;
}

/**
 * Scrapes and exports all building information from the UW Facilities Building portal
 * @param {Object} page - The current Puppeteer page instance
 * @param {Boolean} formatHours - States whether the building's hours should be parsed and formated by day of week or not
 * @param {Function} exportFunction - The exportFunction to callback with data
 */
async function exportBuildingInfo(page, formatHours, exportFunction) {
    var building_info_data = await scrapeBuildingInfo(page, formatHours);

    exportFunction(building_info_data);
}

module.exports = {
    scrapeBuildingInfo,
    exportBuildingInfo
};