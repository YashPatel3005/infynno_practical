import express from "express";

import {
  createPostCardHandler,
  postCardListHandler,
  previewPostcardHandler,
} from "../controllers/postcard.controller";

import validateResource from "../middleware/validateResource";
import { authenticateToken } from "../middleware/authentication";

import { createPostCardSchema } from "../schema/postcard.schema";

import { imageUpload } from "../utils/imageUpload";

const router = express.Router();

router.post(
  "/create",
  authenticateToken,
  imageUpload,
  validateResource(createPostCardSchema),
  createPostCardHandler
);

router.get("/lists", authenticateToken, postCardListHandler);

router.get(
  "/previewLink/:previewLinkId",
  authenticateToken,
  previewPostcardHandler
);

export default router;
