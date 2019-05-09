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

## Installation

**Install Node Modules**

```javascript
npm install
```

**Create exported data directory**  
* Create any other exported data directories

**Create creds.js File**  
* Used for UW NetID login, depending on the scraper functions called

```javascript
var username = '';
var password = '';

exports.username = username;
exports.password = password;
```

**Run index.js**  
* Add calls to scrapers 

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
- [ ] Export to CSV, Export data as property maps
- [ ] Major Information Scraper

## Terms & License

This software is provided as is, with no guarantees of functionality. You assume liability for any of your own usage, modification, and / or distribution of any portion of this software. Any such actions relating to this software should comply with relevant laws and policies, including appropriate use of University of Washington services and data, as defined by Washington State and the [University of Washington](https://itconnect.uw.edu/work/appropriate-use/).

Licensed under the [GNU](./LICENSE) license. 
