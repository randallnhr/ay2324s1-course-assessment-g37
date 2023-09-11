"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QuestionSchema = new mongoose_1.default.Schema({
    title: String,
    categories: [String],
    complexity: String,
    description: String
});
exports.QuestionModel = mongoose_1.default.model('Question', QuestionSchema);
