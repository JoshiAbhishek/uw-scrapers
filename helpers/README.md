# export.js

## Functions

<dl>
<dt><a href="#exportFoundation">exportFoundation(dataDirectory, fileName, data)</a> ⇒ <code>String</code></dt>
<dd><p>Forms the final URL to export data to</p>
</dd>
<dt><a href="#exportJSONObject">exportJSONObject(dataDirectory, fileName, data)</a></dt>
<dd><p>Exports an object to the file system as a JSON file</p>
</dd>
<dt><a href="#exportJSONArray">exportJSONArray(dataDirectory, fileName, propertyName, data)</a></dt>
<dd><p>Exports an array of objects to the file system as a JSON file</p>
</dd>
<dt><a href="#exportJSONArrayToCSV">exportJSONArrayToCSV(dataDirectory, fileName, headersArray, data)</a></dt>
<dd><p>Exports an array to the file system as a CSV file</p>
</dd>
</dl>

<a name="exportFoundation"></a>

## exportFoundation(dataDirectory, fileName, data) ⇒ <code>String</code>
Forms the final URL to export data to

**Kind**: global function
**Returns**: <code>String</code> - - The local url of the file to be exported

| Param | Type | Description |
| --- | --- | --- |
| dataDirectory | <code>String</code> | The file directory to export data to |
| fileName | <code>String</code> | The name of the file to be exported |
| data | <code>Object</code> | The data to be exported |

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

<a name="exportJSONArrayToCSV"></a>

## exportJSONArrayToCSV(dataDirectory, fileName, headersArray, data)
Exports an array to the file system as a CSV file

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| dataDirectory | <code>String</code> | The file directory to export data to |
| fileName | <code>String</code> | The name of the file to be exported |
| headersArray | <code>Array.&lt;String&gt;</code> | The headers corresponding to the data's properties |
| data | <code>Array.&lt;Object&gt;</code> | The data to be exported |

# import.js

## Functions

<dl>
<dt><a href="#getFileNamesInFolder">getFileNamesInFolder(folderPath)</a> ⇒ <code>Array.&lt;String&gt;</code></dt>
<dd><p>Returns an array of file paths to JSON files in a given folder</p>
</dd>
<dt><a href="#getJSONPropertyContentsFromFile">getJSONPropertyContentsFromFile(filePath, propertyName)</a> ⇒ <code>*</code></dt>
<dd><p>Returns the value of a property in a JSON file</p>
</dd>
</dl>

<a name="getFileNamesInFolder"></a>

## getFileNamesInFolder(folderPath) ⇒ <code>Array.&lt;String&gt;</code>
Returns an array of file paths to JSON files in a given folder

**Kind**: global function
**Returns**: <code>Array.&lt;String&gt;</code> - - A String array of the file paths to JSON files in the given folder

| Param | Type | Description |
| --- | --- | --- |
| folderPath | <code>String</code> | The file path of the folder with JSON files to import |

<a name="getJSONPropertyContentsFromFile"></a>

## getJSONPropertyContentsFromFile(filePath, propertyName) ⇒ <code>\*</code>
Returns the value of a property in a JSON file

**Kind**: global function
**Returns**: <code>\*</code> - - Returns the Object or Array (of any type) that is the value of the given property in the JSON file

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | The file path of the JSON file to import |
| propertyName | <code>String</code> | The name of the property the data to import is assigned to |

# browser.js

<a name="navigateWithLoginCheck"></a>

## navigateWithLoginCheck(page, url)
Navigates to a url after logging in with stored UW NetID credentials if required

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The url to navigate to with a check for a UW NetID login requirement |

# parser.js

## Functions

<dl>
<dt><a href="#regexCaputureGroupHasContent">regexCaputureGroupHasContent(captureGroup)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Checks whether a regular expression capture group is defined, not null, and not empty</p>
</dd>
<dt><a href="#multipleRegexCaptureGroupsHaveContent">multipleRegexCaptureGroupsHaveContent(captureGroupsArray, startIndex, endIndex)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Checks whether all capture groups of a regular expression are defined, not null, and not empty</p>
</dd>
<dt><a href="#groupObjectsByAProperty">groupObjectsByAProperty(objectArray, finalObject, propertyName, customValueParser)</a> ⇒ <code>Object</code></dt>
<dd><p>Groups objects by the distinct values of one of their shared properties in to corresponding properties of a single object</p>
</dd>
<dt><a href="#groupObjectsWithRelatedArrayPropertiesByAProperty">groupObjectsWithRelatedArrayPropertiesByAProperty(objectArray, finalObject, propertyName, relatedProperties, customValueParser)</a> ⇒ <code>Object</code></dt>
<dd><p>Groups objects that have incremental index-linked array property values by the distinct values of one of their shared properties in to corresponding properties of a single object</p>
</dd>
<dt><a href="#checkRelatedPropertiesLengths">checkRelatedPropertiesLengths(object, relatedProperties, ignoreNullAndEmpty)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Checks whether all related array properties on an object have the same length</p>
</dd>
<dt><a href="#getMaxRelatedPropertiesLength">getMaxRelatedPropertiesLength(object, relatedProperties)</a> ⇒ <code>Number</code></dt>
<dd><p>Returns the maximum length of related array properties of an object</p>
</dd>
<dt><a href="#expandObjectArrayByRelatedArrayProperties">expandObjectArrayByRelatedArrayProperties(objectArray, relatedProperties, customValueParser)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Expands a collection of objects by their shared array properties</p>
</dd>
<dt><a href="#getExpandedObjectsArrayFromRelatedArrayProperties">getExpandedObjectsArrayFromRelatedArrayProperties(object, relatedProperties, customValueParser)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Creates copies of an object by each incremental set of values of the related array properties</p>
</dd>
</dl>

<a name="regexCaputureGroupHasContent"></a>

## regexCaputureGroupHasContent(captureGroup) ⇒ <code>Boolean</code>
Checks whether a regular expression capture group is defined, not null, and not empty

**Kind**: global function
**Returns**: <code>Boolean</code> - - Indicates whether the given capture group is defined, not null, and not empty

| Param | Type | Description |
| --- | --- | --- |
| captureGroup | <code>String</code> | A capture group from executing a regular expression |

<a name="multipleRegexCaptureGroupsHaveContent"></a>

## multipleRegexCaptureGroupsHaveContent(captureGroupsArray, startIndex, endIndex) ⇒ <code>Boolean</code>
Checks whether all capture groups of a regular expression are defined, not null, and not empty

**Kind**: global function
**Returns**: <code>Boolean</code> - - Indicates whether all capture groups of the array are defined, not null, and not empty

| Param | Type | Description |
| --- | --- | --- |
| captureGroupsArray | <code>Array.&lt;String&gt;</code> | The capture group array from executing a regular expression |
| startIndex | <code>Number</code> | The start index of the range of the given capture group array to check |
| endIndex | <code>Number</code> | The end index of the range of the given capture group array to check |

<a name="groupObjectsByAProperty"></a>

## groupObjectsByAProperty(objectArray, finalObject, propertyName, customValueParser) ⇒ <code>Object</code>
Groups objects by the distinct values of one of their shared properties in to corresponding properties of a single object

**Kind**: global function
**Returns**: <code>Object</code> - - An object with the given array of objects grouped by properties derived from the distinct values of one of their shared properties

| Param | Type | Description |
| --- | --- | --- |
| objectArray | <code>Array.&lt;Object&gt;</code> | The array of objects to be grouped by the distinct values of one of their shared properties |
| finalObject | <code>Object</code> | The final object to add the distinct values of the given objects' shared property as properties |
| propertyName | <code>String</code> | The name of the shared property to group the given array of objects by |
| customValueParser | <code>function</code> | A custom function to parse the grouped objects |

<a name="groupObjectsWithRelatedArrayPropertiesByAProperty"></a>

## groupObjectsWithRelatedArrayPropertiesByAProperty(objectArray, finalObject, propertyName, relatedProperties, customValueParser) ⇒ <code>Object</code>
Groups objects that have incremental index-linked array property values by the distinct values of one of their shared properties in to corresponding properties of a single object

**Kind**: global function
**Returns**: <code>Object</code> - - An object with the given array of objects grouped by properties derived from the distinct values of one of their shared properties

| Param | Type | Description |
| --- | --- | --- |
| objectArray | <code>Array.&lt;Object&gt;</code> | The array of objects to be grouped by the distinct values of one of their shared properties |
| finalObject | <code>Object</code> | The final object to add the distinct values of the given objects' shared property as properties |
| propertyName | <code>String</code> | The name of the shared property to group the given array of objects by |
| relatedProperties | <code>Array.&lt;String&gt;</code> | The names of the shared array properties of the given objects that have incremental index-linked values |
| customValueParser | <code>function</code> | A custom function to parse the grouped objects |

<a name="checkRelatedPropertiesLengths"></a>

## checkRelatedPropertiesLengths(object, relatedProperties, ignoreNullAndEmpty) ⇒ <code>Boolean</code>
Checks whether all related array properties on an object have the same length

**Kind**: global function
**Returns**: <code>Boolean</code> - - Indicates whether all related array properties on an object have the same length

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | An object of a collection of objects that have shared array properties |
| relatedProperties | <code>Array.&lt;String&gt;</code> | The names of the shared array properties of the given objects that have incremental index-linked values |
| ignoreNullAndEmpty | <code>Boolean</code> | Indicates whether empty or null related array properties should be ignored or not |

<a name="getMaxRelatedPropertiesLength"></a>

## getMaxRelatedPropertiesLength(object, relatedProperties) ⇒ <code>Number</code>
Returns the maximum length of related array properties of an object

**Kind**: global function
**Returns**: <code>Number</code> - - Returns the maximum length of related array properties of an object

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | An object of a collection of objects that have shared array properties |
| relatedProperties | <code>Array.&lt;String&gt;</code> | The names of the shared array properties of the given objects that have incremental index-linked values |

<a name="expandObjectArrayByRelatedArrayProperties"></a>

## expandObjectArrayByRelatedArrayProperties(objectArray, relatedProperties, customValueParser) ⇒ <code>Array.&lt;Object&gt;</code>
Expands a collection of objects by their shared array properties

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - The given collection of objects expanded by their shared array properties

| Param | Type | Description |
| --- | --- | --- |
| objectArray | <code>Array.&lt;Object&gt;</code> | The collection of objects to be expanded by their shared array properties |
| relatedProperties | <code>Array.&lt;String&gt;</code> | The names of the shared array properties of the given objects that have incremental index-linked values |
| customValueParser | <code>function</code> | A custom function to parse the given objects |

<a name="getExpandedObjectsArrayFromRelatedArrayProperties"></a>

## getExpandedObjectsArrayFromRelatedArrayProperties(object, relatedProperties, customValueParser) ⇒ <code>Array.&lt;Object&gt;</code>
Creates copies of an object by each incremental set of values of the related array properties

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - Copies of the given object, specified by each incremental set of values of the related array properties

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | An object of a collection of objects with shared array properties to be expanded by each incremental set of values of the related array properties |
| relatedProperties | <code>Array.&lt;String&gt;</code> | The names of the shared array properties of the given objects that have incremental index-linked values |
| customValueParser | <code>function</code> | A custom function to parse the given objects |

# time.js

## Functions

<dl>
<dt><a href="#getFullDayNameFromAbbreviation">getFullDayNameFromAbbreviation(day)</a> ⇒ <code>String</code></dt>
<dd><p>Returns the full name of a day of the week from an abbreviation</p>
</dd>
<dt><a href="#addDayAndTimesToObject">addDayAndTimesToObject(dateTimeRange, finalObject)</a> ⇒ <code>Object</code></dt>
<dd><p>Adds objects with start and end times to days of the week properties of the given object</p>
</dd>
<dt><a href="#createArrayOfDayAndTimeObjectsFromTemplate">createArrayOfDayAndTimeObjectsFromTemplate(dateTimeRange, templateObject)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Creates an array of objects, distinguished by day of the week, with start and end times added to a template object</p>
</dd>
<dt><a href="#convertTimeRangeToMilitaryTimeFormat">convertTimeRangeToMilitaryTimeFormat(timeRange)</a> ⇒ <code>Object</code></dt>
<dd><p>Converts a time range in to an object with 24-hour format start and end times</p>
</dd>
<dt><a href="#timeHourIsNotTwelve">timeHourIsNotTwelve(time)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Checks if a time has the hour of 12, regardless of time of day</p>
</dd>
<dt><a href="#convertTimeAndTimesOfDayToMilitaryTimeFormat">convertTimeAndTimesOfDayToMilitaryTimeFormat(startTime, endTime, startTimeOfDay, endTimeOfDay)</a> ⇒ <code>Object</code></dt>
<dd><p>Creates an object representing the given time range with start and end times in a 24 hour format</p>
</dd>
<dt><a href="#convertTimeToMilitaryTimeNumber">convertTimeToMilitaryTimeNumber(time, isAfterNoon)</a> ⇒ <code>Number</code></dt>
<dd><p>Converts a time to a 24 hour format</p>
</dd>
</dl>

<a name="getFullDayNameFromAbbreviation"></a>

## getFullDayNameFromAbbreviation(day) ⇒ <code>String</code>
Returns the full name of a day of the week from an abbreviation

**Kind**: global function
**Returns**: <code>String</code> - - The full name of a day of the week

| Param | Type | Description |
| --- | --- | --- |
| day | <code>String</code> | An abbreviation of the name of a day of the week |

<a name="addDayAndTimesToObject"></a>

## addDayAndTimesToObject(dateTimeRange, finalObject) ⇒ <code>Object</code>
Adds objects with start and end times to days of the week properties of the given object

**Kind**: global function
**Returns**: <code>Object</code> - - The given object with days of the week properties added to it, with corresponding arrays of objects containing start and end times

| Param | Type | Description |
| --- | --- | --- |
| dateTimeRange | <code>String</code> | A range or group of days of the week with a time range |
| finalObject | <code>Object</code> | The object to have objects with timings added by days of the week properties |

<a name="createArrayOfDayAndTimeObjectsFromTemplate"></a>

## createArrayOfDayAndTimeObjectsFromTemplate(dateTimeRange, templateObject) ⇒ <code>Array.&lt;Object&gt;</code>
Creates an array of objects, distinguished by day of the week, with start and end times added to a template object

**Kind**: global function
**Returns**: <code>Array.&lt;Object&gt;</code> - - An array of objects, based on the given template, for each day in the given time range with its start and end times

| Param | Type | Description |
| --- | --- | --- |
| dateTimeRange | <code>String</code> | A range or group of days of the week with a time range |
| templateObject | <code>Object</code> | The object to copy and add 24-hour formatted start and end times to from the given time range, for each day in the range |

<a name="convertTimeRangeToMilitaryTimeFormat"></a>

## convertTimeRangeToMilitaryTimeFormat(timeRange) ⇒ <code>Object</code>
Converts a time range in to an object with 24-hour format start and end times

**Kind**: global function
**Returns**: <code>Object</code> - - An object representing the given time range with start and end times in a 24 hour format

| Param | Type | Description |
| --- | --- | --- |
| timeRange | <code>String</code> | A time range with start and end times, and possibly the time of day for both |

<a name="timeHourIsNotTwelve"></a>

## timeHourIsNotTwelve(time) ⇒ <code>Boolean</code>
Checks if a time has the hour of 12, regardless of time of day

**Kind**: global function
**Returns**: <code>Boolean</code> - -  Whether the given time has the hour of 12, regardless of time of day

| Param | Type | Description |
| --- | --- | --- |
| time | <code>String</code> | A time of day, without a separating colon for hour and minutes |

<a name="convertTimeAndTimesOfDayToMilitaryTimeFormat"></a>

## convertTimeAndTimesOfDayToMilitaryTimeFormat(startTime, endTime, startTimeOfDay, endTimeOfDay) ⇒ <code>Object</code>
Creates an object representing the given time range with start and end times in a 24 hour format

**Kind**: global function
**Returns**: <code>Object</code> - - An object representing the given time range with start and end times in a 24 hour format

| Param | Type | Description |
| --- | --- | --- |
| startTime | <code>String</code> | The start time of a time range to be converted to a 24 hour time format |
| endTime | <code>String</code> | The end time of a time range to be converted to a 24 hour time format |
| startTimeOfDay | <code>String</code> | The time of day (pm or am) of the given start time |
| endTimeOfDay | <code>String</code> | The time of day (pm or am) of the given end time |

<a name="convertTimeToMilitaryTimeNumber"></a>

## convertTimeToMilitaryTimeNumber(time, isAfterNoon) ⇒ <code>Number</code>
Converts a time to a 24 hour format

**Kind**: global function
**Returns**: <code>Number</code> - - The 24 hour time format of the given time

| Param | Type | Description |
| --- | --- | --- |
| time | <code>String</code> | The time to be converted to a 24 hour format |
| isAfterNoon | <code>Boolean</code> | Denotes whether the given time is after 12:00pm |