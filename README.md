## lines-async-iterator
[![Build Status](https://travis-ci.org/rafaelkallis/lines-async-iterator.svg?branch=master)](https://travis-ci.org/rafaelkallis/lines-async-iterator)

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

## License

MIT License

Copyright (c) 2017 Rafael Kallis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.