# Dataset Stats

Functions for performing statistics on datasets.

The primary purpose is to run batch predictions. So if you had data like this:

| branch | period | sales |
|:-------|-------:|------:|
| A      |      1 |     2 |
| A      |      2 |     4 |
| A      |      3 |     6 |
| A      |      4 |     8 |
| A      |      5 |    10 |
| A      |      6 |    12 |
| B      |      2 |     3 |
| B      |      4 |     5 |
| B      |      6 |     7 |
| B      |      8 |    12 |
| B      |      9 |    14 |
| B      |     10 |    16 |

And you wanted to predict the `sales` of new `period`s, this library can output
predictions using linear regression that look like this:

| branch | period | sales |
|:-------|-------:|------:|
| A      |      7 |    14 |
| A      |      8 |    16 |
| B      |      7 |     9 |
| B      |      8 |    11 |

## Installation

Clone this repository

```sh
git clone https://github.com/travishorn/dataset-stats
```

Change into the directory

```sh
cd dataset-stats
```

Install dependencies

```sh
npm install
```

## Usage

This library works best when you already have your data in JSON format, like
this:

```javascript
const inputData = [
  { branch: "A", period: 1, sales: 2 },
  { branch: "A", period: 2, sales: 4 },
  { branch: "A", period: 3, sales: 6 },
  { branch: "A", period: 4, sales: 8 },
  { branch: "A", period: 5, sales: 10 },
  { branch: "A", period: 6, sales: 12 },
  { branch: "B", period: 2, sales: 3 },
  { branch: "B", period: 4, sales: 5 },
  { branch: "B", period: 6, sales: 7 },
  { branch: "B", period: 8, sales: 12 },
  { branch: "B", period: 9, sales: 14 },
  { branch: "B", period: 10, sales: 16 }
];
```

If your data is in CSV format instead, try using a parsing library like [Papa
Parse](https://www.papaparse.com/) to transform it into JSON. Here is an
example:

```javascript
import { readFile } from "node:fs/promises";
import Papa from "papaparse";

const csvData = await readFile("./input_data.csv", "utf-8");

const inputData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;
// inputData now looks like the example above
```

Now import the `batchPredict()` function.

```javascript
import { batchPredict } from "./index.js";
```

Set a list of keys to group on. In this example, we are only grouping on one
key: the `branch` property.

```javascript
const groupingKeys = ["branch"];
```

Set which property describes the `x` values. This is the value that we want to
feed into our predictor, in order to have it output a predicted `y` value.

```javascript
const xKey = "period";
```

Set which property describes the `y` values. This is the value that we want to
predict, given a new `x` value.

```javascript
const yKey = "sales";
```

Set a list of new `x` values for which we want to predict `y`.

```javascript
const newXs = [7, 8];
```

Finally, calculate the predictions.

```javascript
const predictions = batchPredict(inputData, groupingKeys, xKey, yKey, newXs);
```

The `predictions` variable now contains the predicted values:

```javascript
[
  { department: "A", period: 7, sales: 14 },
  { department: "A", period: 8, sales: 16 },
  { department: "B", period: 7, sales: 9 },
  { department: "B", period: 8, sales: 11 }
]
```

Notice there is one object per *group* (each department in this case) and *new
x* (each new period in this case).

If you want your new data in CSV format, you can use a parsing library again.

```javascript
import { readFile, writeFile } from "node:fs/promises";
const csv = Papa.unparse(predictions);
await writeFile("predictions.csv", csv);
```

## API Documentation

This repository contains [full API documentation](./documentation.md).

## License

The MIT License

Copyright 2023 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
