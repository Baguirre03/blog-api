const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Article = require("../models/post.js");
const Comment = require("../models/comment.js");
const createResponse = require("./response.js");
const { DateTime } = require("luxon");

exports.article_list = asyncHandler(async (req, res, next) => {
  const allArticles = await Article.find()
    .populate("user")
    .sort({ name: 1 })
    .exec();
  res.json({ allArticles });
});

exports.article_detail = asyncHandler(async (req, res, next) => {
  const [article, allArticleComments] = await Promise.all([
    Article.findById(req.params.id).populate("user").exec(),
    Comment.find({ article: req.params.id }).populate("user").exec(),
  ]);
  if (article === null) {
    const err = new Error("Article not found");
    err.status = 404;
    return res.json(err);
  }
  return res.json({
    article,
    allArticleComments,
  });
});

exports.article_comment_post = [
  body("text").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    let rsp = createResponse();

    jwt.verify(req.token, process.env.key, async (err, authData) => {
      if (err) {
        rsp.error = err;
        return res.sendStatus(403).json(rsp);
      } else {
        const errors = validationResult(req);
        const comment = new Comment({
          user: authData.user,
          date: new Date(),
          text: req.body.text,
          article: req.params.id,
        });
        if (!errors.isEmpty()) {
          rsp.error = err;
          return res.json(rsp);
        } else {
          await comment.save();
          const allComments = await Comment.find({ article: req.params.id })
            .populate("user")
            .exec();
          rsp.created = true;
          return res.json({
            comment,
            authData,
            rsp,
            allComments,
          });
        }
      }
    });
  }),
];

exports.article_create_post = [
  body("text").trim().isLength({ min: 1 }).escape(),
  body("title").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    let rsp = createResponse();

    jwt.verify(req.token, process.env.key, async (err, authData) => {
      if (err) {
        rsp.error = err;
        return res.sendStatus(403).json({ article, authData, rsp });
      } else {
        const errors = validationResult(req);
        const article = new Article({
          user: authData.user,
          title: req.body.title,
          text: req.body.text,
          date: new Date(),
        });

        if (!errors.isEmpty()) {
          rsp.error = err;
          return res.json({ article, authData, rsp });
        } else {
          await article.save();

          rsp.created = true;
          return res.json({
            article,
            authData,
            rsp,
          });
        }
      }
    });
  }),
];

exports.article_update_post = [
  body("text").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json("error found");
      return;
    }
    const articleFound = await Article.findById(req.params.id).populate("user");

    jwt.verify(req.token, process.env.key, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const article = new Article({
          user: authData.user,
          title: req.body.title,
          text: req.body.text,
          _id: req.params.id,
        });
        if (authData.user._id.toString() === article.user._id.toString()) {
          const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            article,
            {}
          );
          return res.json({
            updated: true,
            article,
            authData,
          });
        } else {
          return res.json("user is not the creator");
        }
      }
    });
  }),
];
