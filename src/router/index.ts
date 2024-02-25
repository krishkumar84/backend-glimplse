import express, { Router } from "express";
import multer from "multer";
import { postSheetProcess } from "../controllers/sheet";

const upload = multer({ dest: "uploads/" });
const router: Router = express.Router();

router.post("/v1/sheet/process", upload.single("sheet"), postSheetProcess);

export default router;
