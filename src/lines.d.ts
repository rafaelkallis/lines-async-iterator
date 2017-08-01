/**
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import * as util from "util";

declare function lines(
    path: string,
    promisify?: typeof util.promisify,
): AsyncIterable<string>

export = lines;
