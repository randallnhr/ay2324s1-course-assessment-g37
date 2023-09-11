import { Router } from "express";
import * as userController from "../controllers/user";

const router = Router();

router.post("/", userController.createUser);
router.get("/:username", userController.getUser);
router.put("/", userController.updateUser);
router.delete("/:username", userController.deleteUser);

export default router;
