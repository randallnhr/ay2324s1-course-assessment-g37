"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.addQuestion = exports.getQuestions = exports.getQuestion = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const questions_json_1 = __importDefault(require("../data/questions.json"));
const utility_1 = require("../utility");
const QuestionSchema = new mongoose_1.default.Schema({
    title: String,
    categories: [String],
    complexity: String,
    description: String
});
const QuestionModel = mongoose_1.default.model('Question', QuestionSchema);
function parseJsonQuestions(rawJson) {
    if (!(0, utility_1.hasKey)(rawJson, 'questions') || !Array.isArray(rawJson.questions)) {
        return [];
    }
    return rawJson.questions.filter(utility_1.isQuestion);
}
function populateDatabase(questions) {
    const result = {};
    for (let id = 0; id < questions.length; id++) {
        result[String(id)] = questions[id];
    }
    return result;
}
const questions = populateDatabase(parseJsonQuestions(questions_json_1.default));
function getQuestion(id) {
    const question = questions[id];
    if (!question) {
        return { code: utility_1.CODE_NOT_FOUND };
    }
    return {
        code: utility_1.CODE_OK,
        body: question
    };
}
exports.getQuestion = getQuestion;
function getQuestions() {
    return {
        code: utility_1.CODE_OK,
        body: Object.values(questions)
    };
}
exports.getQuestions = getQuestions;
async function addQuestion(question) {
    const result = await (new QuestionModel(question)).save();
    const id2 = result.id;
    const id = String(getQuestions().body.length);
    questions[id] = question;
    return {
        code: utility_1.CODE_OK,
        body: id
    };
}
exports.addQuestion = addQuestion;
function updateQuestion(id, questionUpdates) {
    const { body: question, code } = getQuestion(id);
    if (code != utility_1.CODE_OK) {
        return { code };
    }
    if (!question) {
        return { code: utility_1.CODE_NOT_FOUND };
    }
    questions[id] = {
        ...question,
        ...questionUpdates
    };
    return { code: utility_1.CODE_OK };
}
exports.updateQuestion = updateQuestion;
function deleteQuestion(id) {
    const { body: question, code } = getQuestion(id);
    if (code != utility_1.CODE_OK) {
        return { code };
    }
    if (!question) {
        return { code: utility_1.CODE_NOT_FOUND };
    }
    delete questions[id];
    return { code: utility_1.CODE_OK };
}
exports.deleteQuestion = deleteQuestion;
