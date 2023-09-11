"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.ROUTE_QUESTIONS = void 0;
const express_1 = __importDefault(require("express"));
const utility_1 = require("../utility");
const question_1 = require("../models/question");
const isPartialQuestion_1 = require("../utility/isPartialQuestion");
exports.ROUTE_QUESTIONS = '/api/v1/questions';
exports.router = express_1.default.Router();
/* GET all questions. */
exports.router.get('/', function (req, res) {
    res.json((0, question_1.getQuestions)().body);
});
/* GET question. */
exports.router.get('/:id', function (req, res) {
    const id = req.params.id;
    const { code, body } = (0, question_1.getQuestion)(id);
    if (code !== utility_1.CODE_OK) {
        res.status(code).end();
        return;
    }
    res.json(body);
});
/* POST question. */
exports.router.post('/', async function (req, res) {
    const question = req.body;
    if (!(0, utility_1.isQuestion)(question)) {
        res.status(utility_1.CODE_BAD_REQUEST).end();
        return;
    }
    const id = (await (0, question_1.addQuestion)(question)).body;
    res.location(`${exports.ROUTE_QUESTIONS}/${id}`).end();
});
/* PUT question. */
exports.router.put('/:id', function (req, res) {
    const question = req.body;
    if (!(0, isPartialQuestion_1.isPartialQuestion)(question)) {
        res.status(utility_1.CODE_BAD_REQUEST).end();
        return;
    }
    const id = req.params.id;
    const code = (0, question_1.updateQuestion)(id, question).code;
    res.status(code).end();
});
/* DELETE question */
exports.router.delete('/:id', function (req, res) {
    const id = req.params.id;
    const code = (0, question_1.deleteQuestion)(id).code;
    res.status(code).end();
});
