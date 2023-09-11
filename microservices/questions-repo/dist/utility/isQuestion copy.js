"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isQuestion = void 0;
const _1 = require(".");
/**
 * Checks that the given input is a Question
 * @param unknown item of unknown type.
 * @returns True if the item is a Question, false otherwise.
 */
function isQuestion(unknown) {
    if (!(0, _1.hasKey)(unknown, 'title')
        || typeof unknown['title'] !== 'string') {
        return false;
    }
    else if (!(0, _1.hasKey)(unknown, 'categories')
        || !(0, _1.isArrayOfType)(unknown['categories'], obj => typeof obj === 'string')) {
        return false;
    }
    else if (!(0, _1.hasKey)(unknown, 'difficulty')
        || typeof unknown['difficulty'] !== 'string'
        || !['Easy', 'Medium', 'Hard'].includes(unknown['difficulty'])) {
        return false;
    }
    else if (!(0, _1.hasKey)(unknown, 'description')
        || typeof unknown['description'] !== 'string') {
        return false;
    }
    return true;
}
exports.isQuestion = isQuestion;
