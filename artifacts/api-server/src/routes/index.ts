import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiRouter from "./openai";
import mysticismRouter from "./mysticism";
import configRouter from "./config";

const router: IRouter = Router();

router.use(healthRouter);
router.use(openaiRouter);
router.use(mysticismRouter);
router.use(configRouter);

export default router;
