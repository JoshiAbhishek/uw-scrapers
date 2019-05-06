# course_catalog_scraper.js

## Functions

<dl>
<dt><a href="#checkRegexGroup">checkRegexGroup(str)</a> ⇒ <code>String</code></dt>
<dd><p>Checks a string for being defined</p>
</dd>
<dt><a href="#scrapeCourseCatalogMajorLinks">scrapeCourseCatalogMajorLinks(page)</a> ⇒ <code>Array.&lt;String&gt;</code></dt>
<dd><p>Scrapes links for major&#39;s course catalog pages of a quarter</p>
</dd>
<dt><a href="#scrapeMajorHeaderInfo">scrapeMajorHeaderInfo(page, course)</a> ⇒ <code>Object</code></dt>
<dd><p>Scrapes college, department, and program information for a major&#39;s course offerings</p>
</dd>
<dt><a href="#scrapeCatalogInfoForCourse">scrapeCatalogInfoForCourse(page, url, course)</a> ⇒ <code>Object</code></dt>
<dd><p>Scrapes UW Course Catalog information for a course</p>
</dd>
<dt><a href="#scrapeCoursesForMajor">scrapeCoursesForMajor(page, url)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Scrapes course catalog information for a major</p>
</dd>
<dt><a href="#scrapeCourseCatalog">scrapeCourseCatalog(page)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Scrapes all course information from the UW Course Catalog</p>
</dd>
<dt><a href="#exportCourseCatalogByMajor">exportCourseCatalogByMajor(page, exportFunction)</a></dt>
<dd><p>Scrapes and exports course catalog information by major</p>
</dd>
<dt><a href="#exportCourseCatalog">exportCourseCatalog(page, exportFunction)</a></dt>
<dd><p>Scrapes and exports all course catalog information</p>
</dd>
<dt><a href="#exportMajorCourses">exportMajorCourses(page, url, exportFunction)</a></dt>
<dd><p>Scrapes and exports course catalog information for a major</p>
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

<a name="scrapeCourseCatalogMajorLinks"></a>

## scrapeCourseCatalogMajorLinks(page) ⇒ <code>Array.&lt;String&gt;</code>
Scrapes links for major's course catalog pages of a quarter

**Kind**: global function
**Returns**: <code>Array.&lt;String&gt;</code> - - The scraped links for majors' course catalog pages

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |

<a name="scrapeMajorHeaderInfo"></a>

## scrapeMajorHeaderInfo(page, course) ⇒ <code>Object</code>
Scrapes college, department, and program information for a major's course offerings

**Kind**: global function
**Returns**: <code>Object</code> - - The course object complete with college, department, and program information

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| course | <code>Object</code> | A scraped course object |

<a name="scrapeCatalogInfoForCourse"></a>

## scrapeCatalogInfoForCourse(page, url, course) ⇒ <code>Object</code>
Scrapes UW Course Catalog information for a course

**Kind**: global function
**Returns**: <code>Object</code> - - The course object complete with course catalog information

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL targeting a course in the UW Course Catalog |
| course | <code>Object</code> | A scraped course object |

<a name="scrapeCoursesForMajor"></a>

## scrapeCoursesForMajor(page, url) ⇒ <code>Array.&lt;Object&gt;</code>
Scrapes course catalog information for a major

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - An array of scraped course objects

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL for a major's course catalog page |

<a name="scrapeCourseCatalog"></a>

## scrapeCourseCatalog(page) ⇒ <code>Array.&lt;Object&gt;</code>
Scrapes all course information from the UW Course Catalog

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - An array of scraped course objects

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |

<a name="exportCourseCatalogByMajor"></a>

## exportCourseCatalogByMajor(page, exportFunction)
Scrapes and exports course catalog information by major

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| exportFunction | <code>function</code> | The exportFunction to callback with file name and data |

<a name="exportCourseCatalog"></a>

## exportCourseCatalog(page, exportFunction)
Scrapes and exports all course catalog information

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| exportFunction | <code>function</code> | The exportFunction to callback with data |

<a name="exportMajorCourses"></a>

## exportMajorCourses(page, url, exportFunction)
Scrapes and exports course catalog information for a major

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The URL of a major's course catalog page |
| exportFunction | <code>function</code> | The exportFunction to callback with data |