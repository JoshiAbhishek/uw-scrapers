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

# browser.js

<a name="navigateWithLoginCheck"></a>

## navigateWithLoginCheck(page, url)
Navigates to a url after logging in with stored UW NetID credentials if required

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| page | <code>Object</code> | The current Puppeteer page instance |
| url | <code>String</code> | The url to navigate to with a check for a UW NetID login requirement |