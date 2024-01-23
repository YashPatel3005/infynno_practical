import express from "express";

import user from "./user.routes";
import postcard from "./postcard.routes";

const router = express.Router();

router.use("/api/users", user);
router.use("/api/postcard", postcard);

export default router;
