import {
  getHistories,
  getResentlyPlayed,
  removeHistory,
  updateHistory,
} from "#/controllers/history";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { UpdateHistoryValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  mustAuth,
  validate(UpdateHistoryValidationSchema),
  updateHistory
);

router.delete("/", mustAuth, removeHistory);
router.get("/", mustAuth, getHistories);
router.get("/recently-played", mustAuth, getResentlyPlayed);

export default router;
