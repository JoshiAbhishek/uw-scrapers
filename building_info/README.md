# building_info_scraper.js

## Functions

<dl>
<dt><a href="#scrapeBuildingInfo">scrapeBuildingInfo(page, formatHours)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Scrapes all building information from the UW Facilities Building portal</p>
</dd>
<dt><a href="#exportBuildingInfo">exportBuildingInfo(page, formatHours, exportFunction)</a></dt>
<dd><p>Scrapes and exports all building information from the UW Facilities Building portal</p>
</dd>
</dl>

<a name="scrapeBuildingInfo"></a>

## scrapeBuildingInfo(page, formatHours) ⇒ <code>Array.&lt;Object&gt;</code>
Scrapes all building information from the UW Facilities Building portal

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - An array of the scraped building information objects

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| formatHours | <code>Boolean</code> | States whether the building's hours should be parsed and formated by day of week or not |
<a name="exportBuildingInfo"></a>

## exportBuildingInfo(page, formatHours, exportFunction)
Scrapes and exports all building information from the UW Facilities Building portal

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| formatHours | <code>Boolean</code> | States whether the building's hours should be parsed and formated by day of week or not || exportFunction | <code>function</code> | The exportFunction to callback with data |
