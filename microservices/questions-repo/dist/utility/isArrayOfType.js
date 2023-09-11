"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayOfType = void 0;
/**
 * Checks that the input is an array and every element in the array satisfies the given predicate.
 *
 * @param array Possibly an array.
 * @param checkType Predicate to check each element in the array.
 * @returns True if input is an array and each element in the array satisfies the given predicate.
 */
function isArrayOfType(array, checkType) {
    if (!Array.isArray(array)) {
        return false;
    }
    for (let unknown of array) {
        if (!checkType(unknown)) {
            return false;
        }
    }
    return true;
}
exports.isArrayOfType = isArrayOfType;
