/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const lines = require("./lines");
const { promisify: bluebirdPromisify } = require("bluebird");

const fileContent = [
    "11111111111111111111",
    "22222222222222222222",
    "33333333333333333333",
    "44444444444444444444",
    "55555555555555555555",
    "66666666666666666666",
    "77777777777777777777",
    "88888888888888888888",
    "99999999999999999999",
];

describe("lines async iterator", () => {
    it("should read the file", async () => {
        let lineNumber = 0;
        for await (const line of lines("test_file.txt")) {
            expect(line).toBe(fileContent[lineNumber]);
            lineNumber++;
        }
    });

    it("should work with custom promisification", async () => {
        let lineNumber = 0;
        for await (const line of lines("test_file.txt", bluebirdPromisify)) {
            expect(line).toBe(fileContent[lineNumber]);
            lineNumber++;
        }
    });
});
