"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasKey = void 0;
/**
 * Checks that the given obj is an object and has the given key.
 *
 * @param obj Object to check.
 * @param key Key to check for.
 * @returns True if given input is an object and contains the given key.
 */
function hasKey(obj, key) {
    return (!!obj) && typeof obj === 'object' && key in obj;
}
exports.hasKey = hasKey;
