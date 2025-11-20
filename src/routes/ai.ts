import { Router } from "express";
import { generateContent } from "../controllers/ai.controller";

const aiRouter = Router();

aiRouter.post("/generate", generateContent)

export default aiRouter;