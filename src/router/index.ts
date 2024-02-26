import express, { Router } from "express";
import multer from "multer";
import { postSheetProcess } from "../controllers/sheet";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router: Router = express.Router();

router.post("/v1/sheet/process", upload.single("file"), postSheetProcess);

export default router;
