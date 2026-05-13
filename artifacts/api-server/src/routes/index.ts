import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(settingsRouter);
router.use(contactRouter);

export default router;
