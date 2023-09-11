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
exports.ROUTE_QUESTIONS = '/api/questions';
exports.router = express_1.default.Router();
/* GET all questions. */
exports.router.get('/', async function (req, res) {
    question_1.QuestionModel.find()
        .then(res.json)
        .catch((err) => {
        console.error(err);
        res.status(utility_1.CODE_INTERNAL_SERVER_ERROR);
    }).finally(() => {
        res.end();
    });
});
/* GET question. */
exports.router.get('/:id', async function (req, res) {
    const id = req.params.id;
    question_1.QuestionModel.findById(id)
        .then(question => {
        if (!question) {
            res.status(utility_1.CODE_NOT_FOUND);
            return;
        }
        res.json(question);
    }).catch(err => {
        if (!(0, utility_1.hasKey)(err, 'name') || err.name != 'CastError') {
            console.error(err);
            res.status(utility_1.CODE_INTERNAL_SERVER_ERROR);
            return;
        }
        res.status(utility_1.CODE_NOT_FOUND);
    }).finally(() => {
        res.end();
    });
});
/* POST question. */
exports.router.post('/', async function (req, res) {
    const question = req.body;
    if (!(0, utility_1.isQuestion)(question)) {
        res.status(utility_1.CODE_BAD_REQUEST).end();
        return;
    }
    new question_1.QuestionModel(question).save()
        .then(question => {
        res.location(`${exports.ROUTE_QUESTIONS}/${question.id}`);
    }).catch(err => {
        console.error(err);
        res.status(utility_1.CODE_INTERNAL_SERVER_ERROR);
        return;
    }).finally(() => {
        res.end();
    });
});
/* PUT question. */
exports.router.put('/:id', async function (req, res) {
    const question = req.body;
    if (!(0, isPartialQuestion_1.isPartialQuestion)(question)) {
        res.status(utility_1.CODE_BAD_REQUEST).end();
        return;
    }
    const id = req.params.id;
    question_1.QuestionModel.findByIdAndUpdate(id, question)
        .catch(err => {
        if (!(0, utility_1.hasKey)(err, 'name') || err.name != 'CastError') {
            console.error(err);
            res.status(utility_1.CODE_INTERNAL_SERVER_ERROR);
            return;
        }
        res.status(utility_1.CODE_NOT_FOUND);
    }).finally(() => {
        res.end();
    });
});
/* DELETE question */
exports.router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    question_1.QuestionModel.findByIdAndDelete(id)
        .catch(err => {
        if (!(0, utility_1.hasKey)(err, 'name') || err.name != 'CastError') {
            console.error(err);
            res.status(utility_1.CODE_INTERNAL_SERVER_ERROR);
            return;
        }
    }).finally(() => {
        res.end();
    });
});
