"use strict";

/**
 * Checks whether a regular expression capture group is defined, not null, and not empty
 * @param {String} captureGroup - A capture group from executing a regular expression
 * @returns {Boolean} - Indicates whether the given capture group is defined, not null, and not empty
 */
function regexCaputureGroupHasContent(captureGroup) {
    return captureGroup != undefined && captureGroup != null && captureGroup != "" && captureGroup != " ";
}

/**
 * Checks whether all capture groups of a regular expression are defined, not null, and not empty
 * @param {String[]} captureGroupsArray - The capture group array from executing a regular expression
 * @param {Number} startIndex - The start index of the range of the given capture group array to check
 * @param {Number} endIndex - The end index of the range of the given capture group array to check
 * @returns {Boolean} - Indicates whether all capture groups of the array are defined, not null, and not empty
 */
function multipleRegexCaptureGroupsHaveContent(captureGroupsArray, startIndex, endIndex) {
    if(startIndex > endIndex || endIndex > captureGroupsArray.length - 1) {
        return false;
    }

    for(let i = 0; i < captureGroupsArray.length; i++) {
        if(!regexCaputureGroupHasContent(captureGroupsArray[i])) {
            return false;
        }
    }

    return true;
}

/**
 * Groups objects by the distinct values of one of their shared properties in to corresponding properties of a single object
 * @param {Object[]} objectArray - The array of objects to be grouped by the distinct values of one of their shared properties
 * @param {Object} finalObject - The final object to add the distinct values of the given objects' shared property as properties
 * @param {String} propertyName - The name of the shared property to group the given array of objects by
 * @param {Function} customValueParser - A custom function to parse the grouped objects
 * @returns {Object} - An object with the given array of objects grouped by properties derived from the distinct values of one of their shared properties
 */
function groupObjectsByAProperty(objectArray, finalObject, propertyName, customValueParser) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1) {
        return objectArray;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    for (let i = 0; i < objectArray.length; i++) {
        var temp = JSON.parse(JSON.stringify(objectArray[i]));

        // pass to custom value parser if defined
        if (customValueParser != undefined && customValueParser != null) {
            temp = customValueParser(temp);
        }

        var property = temp[propertyName];

        if (!finalObject.hasOwnProperty(property)) {
            finalObject[property] = [];
        }

        finalObject[property].push(temp);
    }

    return finalObject;
}

/**
 * Groups objects that have incremental index-linked array property values by the distinct values of one of their shared properties in to corresponding properties of a single object
 * @param {Object[]} objectArray - The array of objects to be grouped by the distinct values of one of their shared properties
 * @param {Object} finalObject - The final object to add the distinct values of the given objects' shared property as properties
 * @param {String} propertyName - The name of the shared property to group the given array of objects by
 * @param {String[]} relatedProperties - The names of the shared array properties of the given objects that have incremental index-linked values
 * @param {Function} customValueParser - A custom function to parse the grouped objects
 * @returns {Object} - An object with the given array of objects grouped by properties derived from the distinct values of one of their shared properties
 */
function groupObjectsWithRelatedArrayPropertiesByAProperty(objectArray, finalObject, propertyName, relatedProperties, customValueParser) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1 || propertyName === undefined || propertyName == null || relatedProperties === undefined || relatedProperties == null) {
        return null;
    }

    if (finalObject === undefined || finalObject == null) {
        finalObject = {};
    }

    for (let i = 0; i < objectArray.length; i++) {
        var relatePropsLength = getMaxRelatedPropertiesLength(objectArray[i], relatedProperties);

        for (let j = 0; j < relatePropsLength; j++) {
            // create a new object for each related properties item
            var temp = JSON.parse(JSON.stringify(objectArray[i]));

            // add all related properties by the current index
            for (let k = 0; k < relatedProperties.length; k++) {
                var currPropArray = objectArray[i][relatedProperties[k]];

                if (currPropArray !== undefined && currPropArray != null) {
                    if (currPropArray.length < relatePropsLength) {
                        temp[relatedProperties[k]] = currPropArray[currPropArray.length - 1];
                    }
                    else {
                        temp[relatedProperties[k]] = currPropArray[j];
                    }
                }
            }

            // pass to custom value parser if defined
            if (customValueParser != undefined && customValueParser != null) {
                temp = customValueParser(temp);
            }

            // add value to final object with the defined property's value
            var property = temp[propertyName];

            if (!finalObject.hasOwnProperty(property)) {
                finalObject[property] = [];
            }

            finalObject[property].push(temp);
        }
    }

    return finalObject;
}

/**
 * Checks whether all related array properties on an object have the same length
 * @param {Object} object - An object of a collection of objects that have shared array properties
 * @param {String[]} relatedProperties - The names of the shared array properties of the given objects that have incremental index-linked values
 * @param {Boolean} ignoreNullAndEmpty - Indicates whether empty or null related array properties should be ignored or not
 * @returns {Boolean} - Indicates whether all related array properties on an object have the same length
 */
function checkRelatedPropertiesLengths(object, relatedProperties, ignoreNullAndEmpty) {
    var length = -1;
    var sameLength = true;

    let i = 0;
    while (i < relatedProperties.length && sameLength) {
        if (object[relatedProperties[i]] === undefined || object[relatedProperties[i]] == null) {
            if (!ignoreNullAndEmpty) {
                sameLength = false;
                length = -1;
            }
        }
        else {
            if (length == -1) {
                length = object[relatedProperties[i]].length;
            }
            else if (object[relatedProperties[i]].length != length) {
                sameLength = false;
                length = -1;
            }
        }

        i += 1;
    }

    return length;
}

/**
 * Returns the maximum length of related array properties of an object
 * @param {Object} object - An object of a collection of objects that have shared array properties
 * @param {String[]} relatedProperties - The names of the shared array properties of the given objects that have incremental index-linked values
 * @returns {Number} - Returns the maximum length of related array properties of an object
 */
function getMaxRelatedPropertiesLength(object, relatedProperties) {
    var length = 0;

    for (let i = 0; i < relatedProperties.length; i++) {
        if (object[relatedProperties[i]] != undefined && object[relatedProperties[i]] != null) {
            if (object[relatedProperties[i]].length > length) {
                length = object[relatedProperties[i]].length;
            }
        }
    }

    return length;
}

/**
 * Expands a collection of objects by their shared array properties
 * @param {Object[]} objectArray - The collection of objects to be expanded by their shared array properties 
 * @param {String[]} relatedProperties - The names of the shared array properties of the given objects that have incremental index-linked values
 * @param {Function} customValueParser - A custom function to parse the given objects
 * @returns {Object[]} - The given collection of objects expanded by their shared array properties
 */
function expandObjectArrayByRelatedArrayProperties(objectArray, relatedProperties, customValueParser) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1 || relatedProperties === undefined || relatedProperties == null) {
        return objectArray;
    }

    var originalArrayLength = Number(objectArray.length);

    for (let i = 0; i < originalArrayLength; i++) {
        var relatePropsLength = getMaxRelatedPropertiesLength(objectArray[i], relatedProperties);

        for (let j = 0; j < relatePropsLength; j++) {
            // create new object for each related properties item
            var temp = JSON.parse(JSON.stringify(objectArray[i]));

            // add all related properties by the current index
            for (let k = 0; k < relatedProperties.length; k++) {
                var currPropArray = objectArray[i][relatedProperties[k]];

                if (currPropArray !== undefined && currPropArray != null) {
                    if (currPropArray.length < relatePropsLength) {
                        temp[relatedProperties[k]] = currPropArray[currPropArray.length - 1];
                    }
                    else {
                        temp[relatedProperties[k]] = currPropArray[j];
                    }
                }
            }

            // pass to custom value parser if defined
            if (customValueParser != undefined && customValueParser != null) {
                temp = customValueParser(temp);
            }

            // replace original object in array and append new objects
            if (j == 0) {
                objectArray[i] = temp;
            }
            else {
                objectArray.push(temp);
            }
        }
    }

    return objectArray;
}

/**
 * Creates copies of an object by each incremental set of values of the related array properties 
 * @param {Object} object - An object of a collection of objects with shared array properties to be expanded by each incremental set of values of the related array properties 
 * @param {String[]} relatedProperties - The names of the shared array properties of the given objects that have incremental index-linked values
 * @param {Function} customValueParser - A custom function to parse the given objects
 * @returns {Object[]} - Copies of the given object, specified by each incremental set of values of the related array properties 
 */
function getExpandedObjectsArrayFromRelatedArrayProperties(currentObject, relatedProperties, customValueParser) {
    if (currentObject === undefined || currentObject == null || relatedProperties === undefined || relatedProperties == null) {
        return currentObject;
    }

    var objectArray = [];

    var relatePropsLength = getMaxRelatedPropertiesLength(currentObject, relatedProperties);

    for (let j = 0; j < relatePropsLength; j++) {
        // create new object for each related properties item
        var temp = JSON.parse(JSON.stringify(currentObject));

        // add all related properties by the current index
        for (let k = 0; k < relatedProperties.length; k++) {
            var currPropArray = currentObject[relatedProperties[k]];

            if (currPropArray !== undefined && currPropArray != null) {
                if (currPropArray.length < relatePropsLength) {
                    temp[relatedProperties[k]] = currPropArray[currPropArray.length - 1];
                }
                else {
                    temp[relatedProperties[k]] = currPropArray[j];
                }
            }
        }

        // pass to custom value parser if defined
        if (customValueParser != undefined && customValueParser != null) {
            temp = customValueParser(temp);
        }

        // replace original object in array and append new objects
        objectArray.push(temp);
    }

    return objectArray;
}

module.exports = {
    regexCaputureGroupHasContent,
    multipleRegexCaptureGroupsHaveContent,
    groupObjectsByAProperty,
    groupObjectsWithRelatedArrayPropertiesByAProperty,
    checkRelatedPropertiesLengths,
    getMaxRelatedPropertiesLength,
    expandObjectArrayByRelatedArrayProperties,
    getExpandedObjectsArrayFromRelatedArrayProperties
};