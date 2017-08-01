/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const util = require("util");
const fs = require("fs");

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
async function* lines(path, promisify = util.promisify) {
    const open = promisify(fs.open);
    const fstat = promisify(fs.fstat);
    const read = promisify(fs.read);
    const close = promisify(fs.close);
    const LF = 10;
    const CR = 13;

    let bufferSize = 128 * 1024;
    let position = 0;
    const fd = await open(path, "r");
    try {
        const { size: fileSize } = await fstat(fd);

        let lineBuffer;

        while (position < fileSize) {
            const remaining = fileSize - position;
            if (remaining < bufferSize) bufferSize = remaining;

            let readChunk = new Buffer(bufferSize);
            const { bytesRead } = await read(
                fd,
                readChunk,
                0,
                bufferSize,
                position,
            );

            let curpos = 0;
            let startpos = 0;
            let lastbyte = null;
            while (curpos < bytesRead) {
                const curbyte = readChunk[curpos];
                if (
                    (curbyte === LF && lastbyte !== CR) ||
                    (curbyte === CR && curpos < bytesRead - 1)
                ) {
                    yield lineBuffer === undefined
                        ? readChunk.slice(startpos, curpos).toString()
                        : Buffer.concat([
                              lineBuffer,
                              readChunk.slice(startpos, curpos),
                          ]).toString();

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
                lineBuffer =
                    lineBuffer === undefined
                        ? readChunk.slice(startpos, curpos)
                        : Buffer.concat([
                              lineBuffer,
                              readChunk.slice(startpos, curpos),
                          ]);
            }
        }
        if (Buffer.isBuffer(lineBuffer)) yield lineBuffer.toString();
    } finally {
        await close(fd);
    }
}

module.exports = lines;
