# time_schedule_scraper.js

## Functions

<dl>
<dt><a href="#checkRegexGroup">checkRegexGroup(str)</a> ⇒ <code>String</code></dt>
<dd><p>Checks a string for being defined and relevant (not equal to &quot;to be arranged&quot; or composed entirely of stars and spaces)</p>
</dd>
<dt><a href="#extractCourseInfo">extractCourseInfo(str, course)</a> ⇒ <code>Object</code></dt>
<dd><p>Extracts course details from the passed string representation of it as scraped from the UW Time Schedule</p>
</dd>
<dt><a href="#scrapeCourseSectionInfo">scrapeCourseSectionInfo(page, url)</a> ⇒ <code>Object</code></dt>
<dd><p>Scrapes a course section&#39;s details from its corresponding NetID-only accessible detail page for course sections</p>
</dd>
<dt><a href="#scrapeCoursesForMajorWithDetails">scrapeCoursesForMajorWithDetails(page, url)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Scrapes course section information for a major&#39;s time schedule using the UW NetID-only accessible detail pages for course sections</p>
</dd>
<dt><a href="#scrapeCoursesForMajor">scrapeCoursesForMajor(page, url, courses)</a></dt>
<dd><p>Scrapes course section information for a major&#39;s time schedule</p>
</dd>
<dt><a href="#scrapeMajorLinksByQuarter">scrapeMajorLinksByQuarter(page, quarter)</a> ⇒ <code>Array.&lt;String&gt;</code></dt>
<dd><p>Scrapes links for major&#39;s time schedule pages of a quarter</p>
</dd>
<dt><a href="#scrapeAllCoursesByQuarter">scrapeAllCoursesByQuarter(page, quarter)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Scrapes course section information of all majors&#39; time schedules for a quarter</p>
</dd>
<dt><a href="#exportCoursesByMajorAndQuarter">exportCoursesByMajorAndQuarter(page, quarter, exportFunction)</a></dt>
<dd><p>Scrapes and exports course section information for each major&#39;s time schedule in a quarter</p>
</dd>
<dt><a href="#exportAllCoursesByQuarter">exportAllCoursesByQuarter(page, quarter, exportFunction)</a></dt>
<dd><p>Scrapes and exports all course section information for a quarter</p>
</dd>
<dt><a href="#exportCoursesForMajor">exportCoursesForMajor(page, url, exportFunction)</a></dt>
<dd><p>Scrapes and exports course section information for a major&#39;s quarterly time schedule page</p>
</dd>
<dt><a href="#exportMajorLinksByQuarter">exportMajorLinksByQuarter(page, quarter, exportFunction)</a></dt>
<dd><p>Scrapes and exports links to majors&#39; time schedule pages for a quarter</p>
</dd>
</dl>

<a name="checkRegexGroup"></a>

## checkRegexGroup(str) ⇒ <code>String</code>
Checks a string for being defined and relevant (not equal to "to be arranged" or composed entirely of stars and spaces)

**Kind**: global function
**Returns**: <code>String</code> - - An empty string if the passed string is not valid, or the passed string with no surrounding whitespaces

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String captured by a course regex |

<a name="extractCourseInfo"></a>

## extractCourseInfo(str, course) ⇒ <code>Object</code>
Extracts course details from the passed string representation of it as scraped from the UW Time Schedule

**Kind**: global function
**Returns**: <code>Object</code> - - The passed course JavaScript Object with filled values for the course section's details

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String representation of a course section or lecture as scraped from the UW Time Schedule without formatting |
| course | <code>Object</code> | A JavaScript object representation of a course section |

<a name="scrapeCourseSectionInfo"></a>

## scrapeCourseSectionInfo(page, url) ⇒ <code>Object</code>
Scrapes a course section's details from its corresponding NetID-only accessible detail page for course sections

**Kind**: global function
**Returns**: <code>Object</code> - - A JavaScript Object representing a course section's details

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL of the course section's detail page |

<a name="scrapeCoursesForMajorWithDetails"></a>

## scrapeCoursesForMajorWithDetails(page, url) ⇒ <code>Array.&lt;Object&gt;</code>
Scrapes course section information for a major's time schedule using the UW NetID-only accessible detail pages for course sections

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - An array of the scraped course section objects

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL for a major's time schedule page to scrape |

<a name="scrapeCoursesForMajor"></a>

## scrapeCoursesForMajor(page, url, courses)
Scrapes course section information for a major's time schedule

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL for a major's time schedule page to scrape |
| courses | <code>Array.&lt;Object&gt;</code> | An array of the scraped course section objects |

<a name="scrapeMajorLinksByQuarter"></a>

## scrapeMajorLinksByQuarter(page, quarter) ⇒ <code>Array.&lt;String&gt;</code>
Scrapes links for major's time schedule pages of a quarter

**Kind**: global function
**Returns**: <code>Array.&lt;String&gt;</code> - - The scraped links for majors' time schedule pages

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| quarter | <code>String</code> | The desired quarter to scrape |

<a name="scrapeAllCoursesByQuarter"></a>

## scrapeAllCoursesByQuarter(page, quarter) ⇒ <code>Array.&lt;Object&gt;</code>
Scrapes course section information of all majors' time schedules for a quarter

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - An array of the scraped course section objects

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| quarter | <code>String</code> | The desired quarter to scrape |

<a name="exportCoursesByMajorAndQuarter"></a>

## exportCoursesByMajorAndQuarter(page, quarter, exportFunction)
Scrapes and exports course section information for each major's time schedule in a quarter

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| quarter | <code>String</code> | The desired quarter to scrape |
| exportFunction | <code>function</code> | The exportFunction to callback with a file name and data |

<a name="exportAllCoursesByQuarter"></a>

## exportAllCoursesByQuarter(page, quarter, exportFunction)
Scrapes and exports all course section information for a quarter

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| quarter | <code>String</code> | The desired quarter to scrape |
| exportFunction | <code>function</code> | The exportFunction to callback with data |

<a name="exportCoursesForMajor"></a>

## exportCoursesForMajor(page, url, exportFunction)
Scrapes and exports course section information for a major's quarterly time schedule page

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL for a major's time schedule page to scrape |
| exportFunction | <code>function</code> | The exportFunction to callback with data |

<a name="exportMajorLinksByQuarter"></a>

## exportMajorLinksByQuarter(page, quarter, exportFunction)
Scrapes and exports links to majors' time schedule pages for a quarter

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| quarter | <code>String</code> | The desired quarter to scrape |
| exportFunction | <code>function</code> | The exportFunction to callback with data |

# time_schedule_data_parser.js

## Functions

<dl>
<dt><a href="#mapTimeScheduleDataToLocationFromFolder">mapTimeScheduleDataToLocationFromFolder(folderPath)</a> ⇒ <code>Object</code></dt>
<dd><p>Maps scraped UW Time Schedule data by building, room, and day of the week</p>
</dd>
<dt><a href="#exportTimeScheduleDataMappedToLocationFromFolder">exportTimeScheduleDataMappedToLocationFromFolder(folderPath, exportFunction)</a></dt>
<dd><p>Exports mapped UW Time Schedule data</p>
</dd>
<dt><a href="#mapTimeScheduleDataToLocationFromFile">mapTimeScheduleDataToLocationFromFile(filePath)</a> ⇒ <code>Object</code></dt>
<dd><p>Maps scraped UW Time Schedule data by building, room, and day of the week</p>
</dd>
<dt><a href="#exportTimeScheduleDataMappedToLocationFromFile">exportTimeScheduleDataMappedToLocationFromFile(filePath, exportFunction)</a></dt>
<dd><p>Exports mapped UW Time Schedule data</p>
</dd>
<dt><a href="#mapTimeScheduleDataToLocation">mapTimeScheduleDataToLocation(timeScheduleData, finalObject)</a> ⇒ <code>Object</code></dt>
<dd><p>Maps scraped UW Time Schedule data by building, room, and day of the week</p>
</dd>
<dt><a href="#formatTimeScheduleCourseForLocationMap">formatTimeScheduleCourseForLocationMap(course)</a> ⇒ <code>Object</code></dt>
<dd><p>Selects UW Time Schedule course properties to add to the mapped data</p>
</dd>
</dl>

<a name="mapTimeScheduleDataToLocationFromFolder"></a>

## mapTimeScheduleDataToLocationFromFolder(folderPath) ⇒ <code>Object</code>
Maps scraped UW Time Schedule data by building, room, and day of the week

**Kind**: global function
**Returns**: <code>Object</code> - - An object mapping UW Time Schedule data by building, room, and day of the week

| Param | Type | Description |
| --- | --- | --- |
| folderPath | <code>String</code> | The file path of the folder with scraped UW Time Schedule data exported to JSON files |

<a name="exportTimeScheduleDataMappedToLocationFromFolder"></a>

## exportTimeScheduleDataMappedToLocationFromFolder(folderPath, exportFunction)
Exports mapped UW Time Schedule data

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| folderPath | <code>String</code> | The file path of the folder with scraped UW Time Schedule data exported to JSON files |
| exportFunction | <code>function</code> | The function to callback with mapped UW Time Schedule data |

<a name="mapTimeScheduleDataToLocationFromFile"></a>

## mapTimeScheduleDataToLocationFromFile(filePath) ⇒ <code>Object</code>
Maps scraped UW Time Schedule data by building, room, and day of the week

**Kind**: global function
**Returns**: <code>Object</code> - - A object mapping UW Time Schedule data by building, room, and day of the week

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | The file path of a JSON file with scraped UW Time Schedule data |

<a name="exportTimeScheduleDataMappedToLocationFromFile"></a>

## exportTimeScheduleDataMappedToLocationFromFile(filePath, exportFunction)
Exports mapped UW Time Schedule data

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | The file path of a JSON file with scraped UW Time Schedule data |
| exportFunction | <code>function</code> | The function to callback with mapped UW Time Schedule data |

<a name="mapTimeScheduleDataToLocation"></a>

## mapTimeScheduleDataToLocation(timeScheduleData, finalObject) ⇒ <code>Object</code>
Maps scraped UW Time Schedule data by building, room, and day of the week

**Kind**: global function
**Returns**: <code>Object</code> - - An object mapping UW Time Schedule data by building, room, and day of the week

| Param | Type | Description |
| --- | --- | --- |
| timeScheduleData | <code>Array.&lt;Object&gt;</code> | Scrapped UW Time Schedule data to map |
| finalObject | <code>Object</code> | The object to add mapped UW Time Schedule data by building alias |

<a name="formatTimeScheduleCourseForLocationMap"></a>

## formatTimeScheduleCourseForLocationMap(course) ⇒ <code>Object</code>
Selects UW Time Schedule course properties to add to the mapped data

**Kind**: global function
**Returns**: <code>Object</code> - - The given UW Time Schedule course with specific properties

| Param | Type | Description |
| --- | --- | --- |
| course | <code>Object</code> | A scrapped UW Time Schedule course |