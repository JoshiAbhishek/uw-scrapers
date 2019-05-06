# uw-scrapers

## Overview



**Building Information**
//

**Course Catalog**
//

**Time Schedule**
//

**Course Evaluations Catalog**
//

**Majors Information**
//

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
```

## Usage, Issues, and Future Development



- [x] Building Info Scraper
- [x] Course Catalog Scraper
- [x] Time Schedule Scraper
- [ ] Export to CSV, Export data as property maps
- [ ] Course Evaluations Catalog Scraper
- [ ] Major Information Scraper

## Terms

