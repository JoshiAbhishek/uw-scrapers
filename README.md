# uw-scrapers

**uw-scrapers** is a collection of Node.js scrapers for University of Washington catalogs, including building information, quarterly time schedules, course descriptions, and course evaluations. 

## Scrapers

**Building Information**  
* Scrapes building information from the UW Facilities catalog, including building hours

**Course Catalog**  
* Scrapes course descriptions from UW's Course Catalog

**Time Schedule**  
* Scrapes course section schedules for all majors in a quarter from UW's Time Schedule

**Course Evaluations Catalog**  
* Scrapes course evaluations for the past year from the UW Course Evaluation Catalog (CEC)

**Majors Information**  
* In Development

## Parsers

**Time Schedule Data**
* Groups the scraped UW Time Schedule data by building, room, and day of the week to be used by the [**uw-room-hours**](https://github.com/JoshiAbhishek/uw-room-hours) tool

**Course Evaluations Catalog Data**
* Flattens the scraped Course Evaluations Catalog data to be used for data analysis

## Utilities 

**Parsing**
* Functions for grouping arrays of objects by their properties or expanding objects by related array properties

**Export Data**
* Functions for exporting objects and arrays of objects

**Import Data**
* Functions for reading property values of JSON files

**Browser Navigation**
* Functions for navigating to pages with the puppeteer browser instance

## Installation

**Clone repository**
```git
git clone https://github.com/JoshiAbhishek/uw-scrapers.git
```

**Install Node Modules**
* (You may need to install the puppeteer package separately: `npm install puppeteer`)

```javascript
npm install
```

**Create exported data directory**  
* Add a "data" folder to the repository and create any other exported data directories (as referenced by the scraper and parser functions)

**Create creds.js file (Optional)**  
* Create the creds.js file and add your UW NetID login information which is used depending on the scraper functions called (the default Time Schedule scraper does not use the file)

```javascript
var username = '';
var password = '';

exports.username = username;
exports.password = password;
```

**Add scraper / parser functions**
* Call the scraper and parser functions needed for retrieving and formatting any catalog data

**Run index.js**  

```javascript
node index.js
```

## Examples

```javascript
// Scrape and export UW Facilities building information
await BuildingInfoScraper.exportBuildingInfo(mainPage, false, function(data) {
    ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL, "detailed_building_info.json", "data", data);
});

// Scrape and export UW Time Schedule information by major for a quarter
await TimeScheduleScraper.exportCoursesByMajorAndQuarter(mainPage, "SPR2019", function(file_name, data) {
    ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL + "SPR2019/", file_name, "data", data);
});

// Scrape and export UW Course Catalog information by major
await CourseCatalogScraper.exportCourseCatalogByMajor(mainPage, function(file_name, data) {
    ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL + "Catalog/", file_name, "data", data);
});

// Scrape and export UW Course Evaluations Catalog information by major
await CourseEvaluationsCatalogScraper.exportCourseEvaluationsCatalogByMajor(mainPage, function(file_name, data) {
    ExportUtils.exportJSONArray(DATA_EXPORT_BASE_URL + "CEC/", file_name, "data", data);
});
```

## Usage, Issues, and Future Development

Feel free to submit pull requests and open issues related to any of the catalog scrapers.  

Development Checklist:
- [x] Building Info Scraper
- [x] Course Catalog Scraper
- [x] Time Schedule Scraper
- [x] Course Evaluations Catalog Scraper
- [x] Parsers for mapping object properties
- [x] Time Schedule parser for [uw-room-hours](https://github.com/JoshiAbhishek/uw-room-hours)
- [ ] Course Evaluations Catalog parser for data analysis 
- [ ] Export to CSV
- [ ] Major Information Scraper

## Terms & License

This software is provided as is, with no guarantees of functionality. You assume full liability for any of your own usage, modification, and distribution of any portion of this software. All such actions relating to this software should comply with relevant laws and policies, including appropriate use of University of Washington services and data as defined by Washington State and the [University of Washington](https://itconnect.uw.edu/work/appropriate-use/).

Licensed under the [GNU](./LICENSE) license. 
