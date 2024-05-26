const express = require("express");

const router = express.Router();
const postsController = require("../controllers/postsController.js");
const verify = require("../jwt/verify.js");

router.get("/", postsController.article_list);
router.get("/:id", postsController.article_detail);
router.post("/post", verify, postsController.article_create_post);
router.post("/edit/:id", verify, postsController.article_update_post);
router.post(
  "/create/:id/comment",
  verify,
  postsController.article_comment_post
);

module.exports = router;
