/**
 * Generates a linear regression predictor function based on input arrays of x and y values.
 *
 * @param {Array} xValues - Array of x values (independent variable).
 * @param {Array} yValues - Array of y values (dependent variable).
 * @throws {Error} Throws an error if input arrays are not of the same non-zero length or have less than two values.
 * @returns {Function} - A linear regression predictor function that takes a new x value and returns the predicted y value.
 *
 * @example
 * const xData = [1, 2, 3, 4, 5];
 * const yData = [2, 4, 5, 4, 5];
 *
 * const predictor = linearRegressionPredictor(xData, yData);
 *
 * // Predict the y value for a new x value
 * const predictedY = predictor(6);
 * console.log(predictedY); // Output: 5.2
 */
export function linearRegressionPredictor(xValues, yValues) {
  if (xValues.length !== yValues.length || xValues.length === 0) {
    throw new Error("Input arrays must have the same non-zero length.");
  }

  if (xValues.length === 1) {
    throw new Error("Input arrays must have more than one value");
  }

  const n = xValues.length;

  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

  const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (yValues[i] - yMean), 0);
  const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  return function (newX) {
    return slope * newX + intercept;
  };
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
 *   { department: 'A', x: 1, y: 2 },
 *   { department: 'A', x: 2, y: 4 },
 *   { department: 'A', x: 3, y: 6 },
 *   { department: 'A', x: 4, y: 8 },
 *   { department: 'A', x: 5, y: 10 },
 *   { department: 'A', x: 6, y: 12 },
 *   { department: 'B', x: 2, y: 3 },
 *   { department: 'B', x: 4, y: 5 },
 *   { department: 'B', x: 6, y: 7 },
 *   { department: 'B', x: 8, y: 12 },
 *   { department: 'B', x: 9, y: 14 },
 *   { department: 'B', x: 10, y: 16 },
 * ];
 *
 * const groupingKeys = ['department'];
 * const xKey = 'x';
 * const yKey = 'y';
 * const new_Xs = [7, 8];
 *
 * const predictions = batchPredict(inputData, groupingKeys, xKey, yKey, new_Xs);
 *
 * // Output:
 * [
 *   { department: 'A', x: 7, y: 14 },
 *   { department: 'A', x: 8, y: 16 },
 *   { department: 'B', x: 7, y: 9 },
 *   { department: 'B', x: 8, y: 11 }
 * ]
 */
export function batchPredict(data, groupingKeys, xKey, yKey, newXs) {
  const allowedKeys = [...groupingKeys, xKey, yKey];

  data = removeExtraProperties(data, allowedKeys);

  const groupedData = group(data, groupingKeys).filter((item) => item[xKey].length > 1);

  const predicted = groupedData.map((item) => {
    const predictor = linearRegressionPredictor(item[xKey], item[yKey]);
    item[xKey] = newXs;
    item[yKey] = newXs.map((y) => predictor(y));
    return item;
  });

  return ungroup(predicted, groupingKeys);
}
