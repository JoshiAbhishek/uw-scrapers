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