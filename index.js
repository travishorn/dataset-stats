import { linearRegression, linearRegressionLine } from "simple-statistics";

/**
 * Performs batch prediction using linear regression on a dataset.
 *
 * @param {Array} data - The input dataset with x and y values.
 * @param {Array} groupingKeys - An array of keys used for grouping the dataset.
 * @param {string} xKey - The key representing the independent variable (x values).
 * @param {string} yKey - The key representing the dependent variable (y values).
 * @param {Array} newXs - An array of new x values for prediction.
 * @returns {Array} - An array of objects with predicted y values for the given new x values.
 *
 * @example
 * const inputData = [
 *   { branch: 'A', period: 1, sales: 2 },
 *   { branch: 'A', period: 2, sales: 4 },
 *   { branch: 'A', period: 3, sales: 6 },
 *   { branch: 'A', period: 4, sales: 8 },
 *   { branch: 'A', period: 5, sales: 10 },
 *   { branch: 'A', period: 6, sales: 12 },
 *   { branch: 'B', period: 2, sales: 3 },
 *   { branch: 'B', period: 4, sales: 5 },
 *   { branch: 'B', period: 6, sales: 7 },
 *   { branch: 'B', period: 8, sales: 12 },
 *   { branch: 'B', period: 9, sales: 14 },
 *   { branch: 'B', period: 10, sales: 16 },
 * ];
 *
 * const groupingKeys = ['branch'];
 * const xKey = 'period';
 * const yKey = 'sales';
 * const newXs = [7, 8];
 *
 * const predictions = batchPredict(inputData, groupingKeys, xKey, yKey, newXs);
 *
 * // Output:
 * [
 *   { branch: 'A', period: 7, sales: 14 },
 *   { branch: 'A', period: 8, sales: 16 },
 *   { branch: 'B', period: 7, sales: 9 },
 *   { branch: 'B', period: 8, sales: 11 }
 * ]
 */
export function batchPredict(data, groupingKeys, xKey, yKey, newXs) {
  const allowedKeys = [...groupingKeys, xKey, yKey];

  data = removeExtraProperties(data, allowedKeys);

  const groupedData = group(data, groupingKeys).filter((item) => item[xKey].length > 1);

  const predicted = groupedData.map((item) => {
    const zipped = item[xKey].map((x, i) => [x, item[yKey][i]]);
    const predictor = linearRegressionLine(linearRegression(zipped));
    item[yKey] = newXs.map((y) => predictor(y));
    return item;
  });

  return ungroup(predicted, groupingKeys);
}

/**
 * Groups an array of objects based on specified grouping keys.
 * 
 * @param {Array} array - The input array of objects to be grouped.
 * @param {Array} groupingKeys - An array of keys to use for grouping.
 * @returns {Array} - An array of grouped objects.
 * 
 * @example
 * const inputArray = [
 *   { name: 'John', age: 25, city: 'New York' },
 *   { name: 'Jane', age: 30, city: 'San Francisco' },
 *   { name: 'Bob', age: 25, city: 'New York' },
 *   { name: 'Alice', age: 30, city: 'San Francisco' }
 * ];
 *
 * const groupingKeys = ['city', 'age'];
 * const result = group(inputArray, groupingKeys);
 *
 * // Output:
 * [
 *   { city: 'New York', age: 25, name: ['John', 'Bob'] },
 *   { city: 'San Francisco', age: 30, name: ['Jane', 'Alice'] }
 * ]
 */
export function group(array, groupingKeys) {
  return array.reduce((result, item) => {
    if (!groupingKeys.every(key => item.hasOwnProperty(key))) { return result; }

    const key = groupingKeys.map(key => item[key]).join('-');
    const aggregatedProperties = Object.keys(item).filter(key => !groupingKeys.includes(key));

    const existingEntry = result.find(entry => entry.key === key);

    if (existingEntry) {
      aggregatedProperties.forEach((property) => {
        existingEntry[property].push(item[property]);
      });
    } else {
      const newEntry = {};

      groupingKeys.forEach((key) => {
        newEntry[key] = item[key];
      });

      aggregatedProperties.forEach((property) => {
        newEntry[property] = [item[property]];
      });

      newEntry.key = key;

      result.push(newEntry);
    }

    return result;
  }, [])
  .map((item) => {
    delete item.key;
    return item;
  });
}

/**
 * Removes extra properties from each object in an array based on a specified list of allowed properties.
 *
 * @param {Array} data - An array of objects from which to remove extra properties.
 * @param {Array} allowedProperties - An array of property names to retain in each object.
 * @returns {Array} - An array of objects with only the allowed properties.
 *
 * @example
 * const inputData = [
 *   { id: 1, name: 'John', age: 25, city: 'New York' },
 *   { id: 2, name: 'Jane', age: 30, city: 'San Francisco' },
 *   { id: 3, name: 'Bob', age: 22, city: 'Los Angeles' }
 * ];
 *
 * const allowedProps = ['id', 'name', 'age'];
 * const result = removeExtraProperties(inputData, allowedProps);
 *
 * // Output:
 * [
 *   { id: 1, name: 'John', age: 25 },
 *   { id: 2, name: 'Jane', age: 30 },
 *   { id: 3, name: 'Bob', age: 22 }
 * ]
 */
export function removeExtraProperties(data, allowedProperties) {
  return data.map(item => {
    const filteredObject = Object.keys(item)
      .filter(key => allowedProperties.includes(key))
      .reduce((obj, key) => {
        obj[key] = item[key];
        return obj;
      }, {});
  
    return filteredObject;
  });
}

/**
 * Ungroups an array of objects that were previously grouped based on specified grouping keys.
 *
 * @param {Array} array - The array of grouped objects to be ungrouped.
 * @param {Array} groupingKeys - An array of keys that were used for grouping.
 * @returns {Array} - An array of ungrouped objects.
 *
 * @example
 * const groupedData = [
 *   { city: 'New York', age: 25, name: ['John', 'Bob'] },
 *   { city: 'San Francisco', age: 30, name: ['Jane', 'Alice'] }
 * ];
 *
 * const groupingKeys = ['city', 'age'];
 * const ungroupedData = ungroup(groupedData, groupingKeys);
 *
 * // Output:
 * [
 *   { city: 'New York', age: 25, name: 'John' },
 *   { city: 'New York', age: 25, name: 'Bob' },
 *   { city: 'San Francisco', age: 30, name: 'Jane' },
 *   { city: 'San Francisco', age: 30, name: 'Alice' }
 * ]
 */
export function ungroup(array, groupingKeys) {
  const newArray = [];

  array.forEach((item) => {
    const aggregatedProperties = Object.keys(item).filter(key => !groupingKeys.includes(key));

    for (let i = 0; i < item[aggregatedProperties[0]].length; i++) {
      const newItem = {};

      groupingKeys.forEach((key) => {
        newItem[key] = item[key];
      });

      aggregatedProperties.forEach((property) => {
        newItem[property] = item[property][i];
      });

      newArray.push(newItem);
    }
  });

  return newArray;
}
