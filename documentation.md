## Functions

<dl>
<dt><a href="#batchPredict">batchPredict(data, groupingKeys, xKey, yKey, newXs)</a> => <code>Array</code></dt>
<dd><p>Performs batch prediction using linear regression on a dataset.</p>
</dd>
<dt><a href="#group">group(array, groupingKeys)</a> => <code>Array</code></dt>
<dd><p>Groups an array of objects based on specified grouping keys.</p>
</dd>
<dt><a href="#removeExtraProperties">removeExtraProperties(data, allowedProperties)</a> => <code>Array</code></dt>
<dd><p>Removes extra properties from each object in an array based on a specified list of allowed properties.</p>
</dd>
<dt><a href="#ungroup">ungroup(array, groupingKeys)</a> => <code>Array</code></dt>
<dd><p>Ungroups an array of objects that were previously grouped based on specified grouping keys.</p>
</dd>
</dl>

<a name="batchPredict"></a>

## batchPredict(data, groupingKeys, xKey, yKey, newXs) => <code>Array</code>
Performs batch prediction using linear regression on a dataset.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of objects with predicted y values for the given new x values.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | The input dataset with x and y values. |
| groupingKeys | <code>Array</code> | An array of keys used for grouping the dataset. |
| xKey | <code>string</code> | The key representing the independent variable (x values). |
| yKey | <code>string</code> | The key representing the dependent variable (y values). |
| newXs | <code>Array</code> | An array of new x values for prediction. |

**Example**  
```js
const inputData = [
  { branch: 'A', period: 1, sales: 2 },
  { branch: 'A', period: 2, sales: 4 },
  { branch: 'A', period: 3, sales: 6 },
  { branch: 'A', period: 4, sales: 8 },
  { branch: 'A', period: 5, sales: 10 },
  { branch: 'A', period: 6, sales: 12 },
  { branch: 'B', period: 2, sales: 3 },
  { branch: 'B', period: 4, sales: 5 },
  { branch: 'B', period: 6, sales: 7 },
  { branch: 'B', period: 8, sales: 12 },
  { branch: 'B', period: 9, sales: 14 },
  { branch: 'B', period: 10, sales: 16 },
];

const groupingKeys = ['branch'];
const xKey = 'period';
const yKey = 'sales';
const newXs = [7, 8];

const predictions = batchPredict(inputData, groupingKeys, xKey, yKey, newXs);

// Output:
[
  { branch: 'A', period: 7, sales: 14 },
  { branch: 'A', period: 8, sales: 16 },
  { branch: 'B', period: 7, sales: 9 },
  { branch: 'B', period: 8, sales: 11 }
]
```
<a name="group"></a>

## group(array, groupingKeys) => <code>Array</code>
Groups an array of objects based on specified grouping keys.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of grouped objects.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The input array of objects to be grouped. |
| groupingKeys | <code>Array</code> | An array of keys to use for grouping. |

**Example**  
```js
const inputArray = [
  { name: 'John', age: 25, city: 'New York' },
  { name: 'Jane', age: 30, city: 'San Francisco' },
  { name: 'Bob', age: 25, city: 'New York' },
  { name: 'Alice', age: 30, city: 'San Francisco' }
];

const groupingKeys = ['city', 'age'];
const result = group(inputArray, groupingKeys);

// Output:
[
  { city: 'New York', age: 25, name: ['John', 'Bob'] },
  { city: 'San Francisco', age: 30, name: ['Jane', 'Alice'] }
]
```
<a name="removeExtraProperties"></a>

## removeExtraProperties(data, allowedProperties) => <code>Array</code>
Removes extra properties from each object in an array based on a specified list of allowed properties.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of objects with only the allowed properties.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | An array of objects from which to remove extra properties. |
| allowedProperties | <code>Array</code> | An array of property names to retain in each object. |

**Example**  
```js
const inputData = [
  { id: 1, name: 'John', age: 25, city: 'New York' },
  { id: 2, name: 'Jane', age: 30, city: 'San Francisco' },
  { id: 3, name: 'Bob', age: 22, city: 'Los Angeles' }
];

const allowedProps = ['id', 'name', 'age'];
const result = removeExtraProperties(inputData, allowedProps);

// Output:
[
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 22 }
]
```
<a name="ungroup"></a>

## ungroup(array, groupingKeys) => <code>Array</code>
Ungroups an array of objects that were previously grouped based on specified grouping keys.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of ungrouped objects.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array of grouped objects to be ungrouped. |
| groupingKeys | <code>Array</code> | An array of keys that were used for grouping. |

**Example**  
```js
const groupedData = [
  { city: 'New York', age: 25, name: ['John', 'Bob'] },
  { city: 'San Francisco', age: 30, name: ['Jane', 'Alice'] }
];

const groupingKeys = ['city', 'age'];
const ungroupedData = ungroup(groupedData, groupingKeys);

// Output:
[
  { city: 'New York', age: 25, name: 'John' },
  { city: 'New York', age: 25, name: 'Bob' },
  { city: 'San Francisco', age: 30, name: 'Jane' },
  { city: 'San Francisco', age: 30, name: 'Alice' }
]
```
