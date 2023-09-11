import { Router, Request, Response } from "express";
import * as userController from "../controllers/user";

const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getUser);
router.put("/", userController.updateUser);
router.delete("/", userController.deleteUser);

export default router;
