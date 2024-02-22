import express, { Router } from "express";
import { postSheetProcess } from "../controllers/sheet";

const router: Router = express.Router();

router.post("/v1/sheet/process", postSheetProcess);

export default router;
