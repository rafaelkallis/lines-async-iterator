## lines-async-iterator
[![Build Status](https://travis-ci.org/rafaelkallis/lines-async-iterator.svg?branch=master)](https://travis-ci.org/rafaelkallis/lines-async-iterator)
[![npm version](https://badge.fury.io/js/lines-async-iterator.svg)](https://badge.fury.io/js/lines-async-iterator)
[![GitHub version](https://badge.fury.io/gh/rafaelkallis%2Flines-async-iterator.svg)](https://badge.fury.io/gh/rafaelkallis%2Flines-async-iterator)

Line by line async iterator for `node.js`

- Uses ESNext async iteration
- Use with `--harmony-async-iterator` flag
- Can use with IxJS
- Supports custom promises
- Typescript definitions included

### Usage

#### Installation

```bash
npm install --save lines-async-iterator
# or
yarn add lines-async-iterator
```

#### Example 1 (Basic)
```js
const lines = require("lines-async-iterator");

async function printLines() {
    for await(const line of lines("file.txt")){
        console.log(line);
    }
}

printLines();
```

#### Example 2 (Custom promise)
```js
const lines = require("lines-async-iterator");
const { promisify } = require("bluebird");

async function printLines() {
    for await(const line of lines("file.txt", promisify)){
        console.log(line);
    }
}

printLines();
```

#### Example 3 (IxJS)
```js
const lines = require("lines-async-iterator");
const Ix = require("ix");

async function printEqualLines() {
    const iterator = Ix.AsyncIterator
        .zip(lines("1.txt"), lines("2.txt"))
        .map(([line_1, line_2]) => [
            line_1.toLowerCase(),
            line_2.toLowerCase(),
        ])
        .filter(([line_1, line_2]) => line_1 === line_2);
        
    console.log("These lines are the same:");

    for await(const ([line_1, line_2]) of iterator){
        console.log(`${line_1} === ${line_2}`);
    }
}

printEqualLines();
```