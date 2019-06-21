# course_evaluations_scraper.js

## Functions

<dl>
<dt><a href="#checkRegexGroup">checkRegexGroup(str)</a> ⇒ <code>String</code></dt>
<dd><p>Checks a string for being defined</p>
</dd>
<dt><a href="#scrapeCECTableOfContentsLinks">scrapeCECTableOfContentsLinks(page)</a> ⇒ <code>Array.&lt;String&gt;</code></dt>
<dd><p>Scrapes links for CEC table of contents pages</p>
</dd>
<dt><a href="#scrapeCECCoursePageLinks">scrapeCECCoursePageLinks(page, url)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Scrapes links for CEC course evaluations pages</p>
</dd>
<dt><a href="#scrapeCECCoursePage">scrapeCECCoursePage(page, url, linkText)</a> ⇒ <code>Object</code></dt>
<dd><p>Scrapes a course&#39;s evaluation</p>
</dd>
<dt><a href="#scrapeCourseEvaluationsCatalog">scrapeCourseEvaluationsCatalog(page)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt><dd><p>Scrapes UW course evaluations for the past year</p>
</dd>
<dt><a href="#scrapeCourseEvaluationsCatalogContentsPage">scrapeCourseEvaluationsCatalogContentsPage(page, url)</a> ⇒ <code>Map.&lt;String, Array.&lt;Object&gt;&gt;</code></dt>
<dd><p>Scrapes course evaluations for the current table contents page</p>
</dd>
<dt><a href="#exportCourseEvaluationsCatalogByMajor">exportCourseEvaluationsCatalogByMajor(page, exportFunction)</a></dt>
<dd><p>Scrapes and exports course evaluations by major program</p>
</dd>
<dt><a href="#exportCourseEvaluationsCatalog">exportCourseEvaluationsCatalog(page, exportFunction)</a></dt>
<dd><p>Scrapes and exports course evaluations for all courses</p>
</dd>
</dl>

<a name="checkRegexGroup"></a>

## checkRegexGroup(str) ⇒ <code>String</code>
Checks a string for being defined

**Kind**: global function
**Returns**: <code>String</code> - - An empty string if the passed string is not valid, or the passed string with no surrounding whitespaces

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String captured by a course regex |

<a name="scrapeCECTableOfContentsLinks"></a>

## scrapeCECTableOfContentsLinks(page) ⇒ <code>Array.&lt;String&gt;</code>
Scrapes links for CEC table of contents pages

**Kind**: global function
**Returns**: <code>Array.&lt;String&gt;</code> - - The scraped links for CEC table of contents pages

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |

<a name="scrapeCECCoursePageLinks"></a>

## scrapeCECCoursePageLinks(page, url) ⇒ <code>Array.&lt;Object&gt;</code>
Scrapes links for CEC course evaluations pages

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - The scraped links and their link text for course evaluations pages

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL for a CEC table of contents page to scrape |

<a name="scrapeCECCoursePage"></a>

## scrapeCECCoursePage(page, url, linkText) ⇒ <code>Object</code>
Scrapes a course's evaluation

**Kind**: global function
**Returns**: <code>Object</code> - - A JavaScript Object representing a course evaluation

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL of a CEC course evaluations page |
| linkText | <code>String</code> | The CEC table of contents link's text with course information |

<a name="scrapeCourseEvaluationsCatalog"></a>

## scrapeCourseEvaluationsCatalog(page) ⇒ <code>Array.&lt;Object&gt;</code>
Scrapes UW course evaluations for the past year

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - An array of the scraped course evaluations

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |

<a name="scrapeCourseEvaluationsCatalogContentsPage"></a>

## scrapeCourseEvaluationsCatalogContentsPage(page, url) ⇒ <code>Map.&lt;String, Array.&lt;Object&gt;&gt;</code>
Scrapes course evaluations for the current table contents page

**Kind**: global function
**Returns**: <code>Map.&lt;String, Array.&lt;Object&gt;&gt;</code> - - A map of course alias to an array of course evaluations
objects

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL for a CEC table of contents page to scrape |

<a name="exportCourseEvaluationsCatalogByMajor"></a>

## exportCourseEvaluationsCatalogByMajor(page, exportFunction)
Scrapes and exports course evaluations by major program

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| exportFunction | <code>function</code> | The exportFunction to callback with a file name and data |

<a name="exportCourseEvaluationsCatalog"></a>

## exportCourseEvaluationsCatalog(page, exportFunction)
Scrapes and exports course evaluations for all courses

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| exportFunction | <code>function</code> | The exportFunction to callback with data |

# course_evaluations_data_parser.js

## Functions

<dl>
<dt><a href="#exportFoundation">exportFoundation(dataDirectory, fileName, data, fileExtension)</a> ⇒ <code>String</code></dt>
<dd><p>Forms the final URL to export data to</p>
</dd>
<dt><a href="#exportJSONObject">exportJSONObject(dataDirectory, fileName, data)</a></dt>
<dd><p>Exports an object to the file system as a JSON file</p>
</dd>
<dt><a href="#exportJSONArray">exportJSONArray(dataDirectory, fileName, propertyName, data)</a></dt>
<dd><p>Exports an array of objects to the file system as a JSON file</p>
</dd>
<dt><a href="#convertDataToDelimitedString">convertDataToDelimitedString(headersArray, data, delimiter)</a> ⇒ <code>String</code></dt>
<dd><p>Creates a delimited string representation of an array of objects</p>
</dd>
<dt><a href="#exportJSONArrayToCSV">exportJSONArrayToCSV(dataDirectory, fileName, headersArray, data)</a></dt>
<dd><p>Exports an array to the file system as a CSV file</p>
</dd>
<dt><a href="#exportJSONArrayToTSV">exportJSONArrayToTSV(dataDirectory, fileName, headersArray, data)</a></dt>
<dd><p>Exports an array to the file system as a TSV file</p>
</dd>
</dl>

<a name="exportFoundation"></a>

## exportFoundation(dataDirectory, fileName, data, fileExtension) ⇒ <code>String</code>
Forms the final URL to export data to

**Kind**: global function
**Returns**: <code>String</code> - - The local url of the file to be exported

| Param | Type | Description |
| --- | --- | --- |
| dataDirectory | <code>String</code> | The file directory to export data to |
| fileName | <code>String</code> | The name of the file to be exported |
| data | <code>Object</code> | The data to be exported |
| fileExtension | <code>String</code> | The extension of the file to be exported |

<a name="exportJSONObject"></a>

## exportJSONObject(dataDirectory, fileName, data)
Exports an object to the file system as a JSON file

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| dataDirectory | <code>String</code> | The file directory to export data to |
| fileName | <code>String</code> | The name of the file to be exported |
| data | <code>Object</code> | The data to be exported |

<a name="exportJSONArray"></a>

## exportJSONArray(dataDirectory, fileName, propertyName, data)
Exports an array of objects to the file system as a JSON file

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| dataDirectory | <code>String</code> | The file directory to export data to |
| fileName | <code>String</code> | The name of the file to be exported |
| propertyName | <code>String</code> | The name of the property the exported data will be assigned to |
| data | <code>Array.&lt;Object&gt;</code> | The data to be exported |

<a name="convertDataToDelimitedString"></a>

## convertDataToDelimitedString(headersArray, data, delimiter) ⇒ <code>String</code>
Creates a delimited string representation of an array of objects

**Kind**: global function
**Returns**: <code>String</code> - - A delimited string representation of the given data

| Param | Type | Description |
| --- | --- | --- |
| headersArray | <code>\*</code> | The properties of objects in the array to be represented as columns |
| data | <code>\*</code> | The data to be exported |
| delimiter | <code>\*</code> | The delimiter to be used for each row of data values |

<a name="exportJSONArrayToCSV"></a>
PS C:\Users\joshi\Documents\GitHub\uw-scrapers> jsdoc2md .\course_evaluations_catalog\course_evaluations_data_parser.js
## Functions

<dl>
<dt><a href="#expandCECMajorData">expandCECMajorData(data)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Expands evaluations of a major&#39;s courses by evaluation question</p>
</dd>
<dt><a href="#expandCECMajorDataFromFile">expandCECMajorDataFromFile(filePath)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Expands evaluations of a major&#39;s courses by evaluation question from a file</p>
</dd>
<dt><a href="#exportExpandedCECMajorDataFromFile">exportExpandedCECMajorDataFromFile(filePath, exportFunction)</a></dt>
<dd><p>Exports expanded UW CEC Major data</p>
</dd>
</dl>

<a name="expandCECMajorData"></a>

## expandCECMajorData(data) ⇒ <code>Array.&lt;Object&gt;</code>
Expands evaluations of a major's courses by evaluation question

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - The expanded CEC data

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;Object&gt;</code> | The CEC data of a major to be expanded by evaluation questions |

<a name="expandCECMajorDataFromFile"></a>

## expandCECMajorDataFromFile(filePath) ⇒ <code>Array.&lt;Object&gt;</code>
Expands evaluations of a major's courses by evaluation question from a file

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - The expanded CEC data

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | The file path of a JSON file with scraped UW CEC data |

<a name="exportExpandedCECMajorDataFromFile"></a>

## exportExpandedCECMajorDataFromFile(filePath, exportFunction)
Exports expanded UW CEC Major data

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | The file path of a JSON file with scraped UW CEC data |
| exportFunction | <code>function</code> | The function to callback with parsed UW CEC data |