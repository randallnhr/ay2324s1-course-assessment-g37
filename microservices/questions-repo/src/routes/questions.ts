import express, { Request, Response } from "express";
import { CODE_BAD_REQUEST, CODE_INTERNAL_SERVER_ERROR, CODE_NOT_FOUND, hasKey, isQuestion } from "../utility";
import { QuestionModel } from "../models/question";
import { isPartialQuestion } from "../utility/isPartialQuestion";

export const ROUTE_QUESTIONS = '/api/questions';

export const router = express.Router();

/* GET all questions. */
router.get('/', async function(req: Request, res: Response) {
  QuestionModel.find()
    .then(res.json)
    .catch((err) => {
      console.error(err);
      res.status(CODE_INTERNAL_SERVER_ERROR);
    }).finally(() => {
      res.end();
    });
});

/* GET question. */
router.get('/:id', async function(req: Request, res: Response) {
  const id = req.params.id;
  QuestionModel.findById(id)
    .then(question => {
      if (!question) {
        res.status(CODE_NOT_FOUND);
        return;
      }
      res.json(question);
    }).catch(err => {
      if (!hasKey(err, 'name') || err.name != 'CastError') {
        console.error(err);
        res.status(CODE_INTERNAL_SERVER_ERROR);
        return;
      }
      res.status(CODE_NOT_FOUND);
    }).finally(() => {
      res.end();
    });
});

/* POST question. */
router.post('/', async function(req: Request, res: Response) {
  const question = req.body;
  if (!isQuestion(question)) {
    res.status(CODE_BAD_REQUEST).end();
    return;
  }
  new QuestionModel(question).save()
    .then(question => {
      res.location(`${ROUTE_QUESTIONS}/${question.id}`);
    }).catch(err => {
      console.error(err);
      res.status(CODE_INTERNAL_SERVER_ERROR);
      return;
    }).finally(() => {
      res.end();
    });
});

/* PUT question. */
router.put('/:id', async function(req: Request, res: Response) {
  const question = req.body;
  if (!isPartialQuestion(question)) {
    res.status(CODE_BAD_REQUEST).end();
    return;
  }
  const id = req.params.id;
  QuestionModel.findByIdAndUpdate(id, question)
    .catch(err => {
      if (!hasKey(err, 'name') || err.name != 'CastError') {
        console.error(err);
        res.status(CODE_INTERNAL_SERVER_ERROR);
        return;
      }
      res.status(CODE_NOT_FOUND);
    }).finally(() => {
      res.end();
    });
});

/* DELETE question */
router.delete('/:id', async function(req: Request, res: Response) {
  const id = req.params.id;
  QuestionModel.findByIdAndDelete(id)
    .catch(err => {
      if (!hasKey(err, 'name') || err.name != 'CastError') {
        console.error(err);
        res.status(CODE_INTERNAL_SERVER_ERROR);
        return;
      }
    }).finally(() => {
      res.end();
    });
});
