import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiRouter from "./openai";
import mysticismRouter from "./mysticism";

const router: IRouter = Router();

router.use(healthRouter);
router.use(openaiRouter);
router.use(mysticismRouter);

export default router;
