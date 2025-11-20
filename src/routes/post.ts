import {
  createPost,
  getAllPost,
  getMyPost,
} from "../controllers/post.controller";
import Router from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../models/user.model";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/", getAllPost);

router.get("/getMyPost", authenticate, requireRole(Role.AUTHOR), getMyPost);

router.post(
  "/createPost",
  authenticate,
  requireRole(Role.AUTHOR),
  upload.single("image"),
  createPost
);

export default router;
