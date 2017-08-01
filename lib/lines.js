"use strict";

var _asyncGenerator = function () { function AwaitValue(value) { this.value = value; } function AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; if (value instanceof AwaitValue) { Promise.resolve(value.value).then(function (arg) { resume("next", arg); }, function (arg) { resume("throw", arg); }); } else { settle(result.done ? "return" : "normal", result.value); } } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } } if (typeof Symbol === "function" && Symbol.asyncIterator) { AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; } AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); }; AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); }; AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); }; return { wrap: function (fn) { return function () { return new AsyncGenerator(fn.apply(this, arguments)); }; }, await: function (value) { return new AwaitValue(value); } }; }();

/**
 * Returns an async line iterator.
 * @param {string} path: Path of the file
 * @param {*} promisify: Optional custom promisification function.
 * @returns {AsyncIterable<string>}
 * 
 * @example
 * Basic example:
 * ```js
 * for await(const line of lines("file.txt")){
 *   console.log(line);
 * }
 * ```
 * 
 * Custom promise:
 * ```js
 * const Promise = require("bluebird")
 * for await(const line of lines("file.txt", Promise.promisify)){
 *   console.log(line);
 * }
 * ```
 */
let lines = (() => {
    var _ref = _asyncGenerator.wrap(function* (path, promisify = util.promisify) {
        const open = promisify(fs.open);
        const fstat = promisify(fs.fstat);
        const read = promisify(fs.read);
        const close = promisify(fs.close);
        const LF = 10;
        const CR = 13;
        console.log("hey");
        let bufferSize = 128 * 1024;
        let position = 0;
        const fd = yield _asyncGenerator.await(open(path, "r"));
        try {
            const { size: fileSize } = yield _asyncGenerator.await(fstat(fd));

            let lineBuffer;

            while (position < fileSize) {
                const remaining = fileSize - position;
                if (remaining < bufferSize) bufferSize = remaining;

                let readChunk = new Buffer(bufferSize);
                const { bytesRead } = yield _asyncGenerator.await(read(fd, readChunk, 0, bufferSize, position));

                let curpos = 0;
                let startpos = 0;
                let lastbyte = null;
                while (curpos < bytesRead) {
                    const curbyte = readChunk[curpos];
                    if (curbyte === LF && lastbyte !== CR || curbyte === CR && curpos < bytesRead - 1) {
                        yield lineBuffer === undefined ? readChunk.slice(startpos, curpos).toString() : Buffer.concat([lineBuffer, readChunk.slice(startpos, curpos)]).toString();

                        lineBuffer = undefined;
                        startpos = curpos + 1;

                        if (curbyte === CR && readChunk[curpos + 1] === LF) {
                            startpos++;
                            curpos++;
                        }
                    } else if (curbyte === CR && curpos >= bytesRead - 1) {
                        lastbyte = curbyte;
                    }

                    curpos++;
                }

                position += bytesRead;

                if (startpos < bytesRead) {
                    lineBuffer = lineBuffer === undefined ? readChunk.slice(startpos, curpos) : Buffer.concat([lineBuffer, readChunk.slice(startpos, curpos)]);
                }
            }
            if (Buffer.isBuffer(lineBuffer)) yield lineBuffer.toString();
        } finally {
            yield _asyncGenerator.await(close(fd));
        }
    });

    return function lines(_x) {
        return _ref.apply(this, arguments);
    };
})();

/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const util = require("util");
const fs = require("fs");

module.exports = lines;