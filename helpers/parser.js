"use strict";

const dayAndTimeOfWeekRegex = new RegExp(/([A-Za-z\.]+)\s(\d+)\-(\d+)([P]*)/);

const dayOfWeekSplitRegex = new RegExp(/(?=[A-Z])/, "g");

/**
 * 
 * @param {*} objectArray 
 * @param {*} propertyName 
 * @param {*} ignoreNullAndEmpty 
 * @param {*} customValueParser 
 * @returns {*} -  
 */
function createMapFromObjectProperty(objectArray, propertyName, ignoreNullAndEmpty, customValueParser) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1) {
        return objectArray;
    }

    var propertyMap = new Map();


}

/**
 * 
 * @param {*} objectArray 
 * @param {*} propertyName 
 * @param {*} relatedProperties 
 * @param {*} ignoreNullAndEmpty 
 * @param {*} customValueParser 
 * @returns {Map<String, Object[]>} -  
 */
function createMapFromObjectPropertyWithRelatedArrayProperties(objectArray, propertyMap, propertyName, relatedProperties, customValueParser) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1 || propertyName === undefined || propertyName == null || relatedProperties === undefined || relatedProperties == null) {
        return null;
    }

    if (propertyMap === undefined || propertyMap == null) {
        propertyMap = new Map();
    }

    for (let i = 0; i < objectArray.length; i++) {
        var relatePropsLength = getMaxRelatedPropertiesLength(objectArray[i], relatedProperties);

        for (let j = 0; j < relatePropsLength; j++) {
            // create a new object for each related properties item
            var temp = JSON.parse(JSON.stringify(objectArray[i]));

            // add all related properties by the current index
            for (let k = 0; k < relatedProperties.length; k++) {
                var currPropArray = objectArray[i][relatedProperties[k]];

                if(currPropArray !== undefined && currPropArray != null) {
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

            // add value to map with the defined property name as the key
            var mapKey = temp[propertyName];
            var mapValue = propertyMap.get(mapKey);
            if (mapValue == undefined) {
                mapValue = [];
            }
            mapValue.push(temp);
            propertyMap.set(mapKey, mapValue);
        }
    }

    return propertyMap;
}

/**
 * 
 * @param {*} object 
 * @param {*} relatedProperties 
 * @param {*} ignoreNullAndEmpty 
 * @returns {Boolean} -
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
 * 
 * @param {*} object 
 * @param {*} relatedProperties 
 * @returns {*} - 
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
 * 
 * @param {*} objectArray 
 * @param {*} relatedProperties 
 * @returns {Object[]} -  
 */
function expandObjectByRelatedArrayProperties(objectArray, relatedProperties) {
    if (objectArray === undefined || objectArray == null || objectArray.length < 1) {
        return objectArray;
    }


}

/**
 * 
 * @param {*} str 
 * @returns {Object} -
 */
function createDayAndTimeOfWeekObjectFromString(str) {

}

/**
 * 
 * @param {*} str 
 * @returns {Object} -
 */
function getTimeOfDayFromRange(str) {
    var timeOfDayArr = str.split(dayOfWeekSplitRegex);

    console.log(timeOfDayArr);
}

module.exports = {
    createMapFromObjectPropertyWithRelatedArrayProperties,
    getTimeOfDayFromRange
};