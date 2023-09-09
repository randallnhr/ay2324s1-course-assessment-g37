import express, { Request, Response } from "express";
import { CODE_BAD_REQUEST, CODE_OK, isQuestion } from "../utility";
import { addQuestion, deleteQuestion, getQuestion, getQuestions, updateQuestion } from "../models/question";
import { isPartialQuestion } from "../utility/isPartialQuestion";

export const ROUTE_QUESTIONS = '/api/v1/questions';

export const router = express.Router();

/* GET all questions. */
router.get('/', function(req: Request, res: Response) {
  res.json(getQuestions().body);
});

/* GET question. */
router.get('/:id', function(req: Request, res: Response) {
  const id = req.params.id;
  const { code, body } = getQuestion(id);
  if (code !== CODE_OK) {
    res.status(code).end();
    return;
  }
  res.json(body);
});

/* POST question. */
router.post('/', function(req: Request, res: Response) {
  const question = req.body;
  if (!isQuestion(question)) {
    res.status(CODE_BAD_REQUEST).end();
    return;
  }
  const id = addQuestion(question).body;
  res.location(`${ROUTE_QUESTIONS}/${id}`).end();
});

/* PUT question. */
router.put('/:id', function(req: Request, res: Response) {
  const question = req.body;
  if (!isPartialQuestion(question)) {
    res.status(CODE_BAD_REQUEST).end();
    return;
  }
  const id = req.params.id;
  const code = updateQuestion(id, question).code;
  res.status(code).end();
});

/* DELETE question */
router.delete('/:id', function(req: Request, res: Response) {
  const id = req.params.id;
  const code = deleteQuestion(id).code;
  res.status(code).end();
});
