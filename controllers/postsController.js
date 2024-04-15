const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Article = require('../models/post.js');
const Comment = require('../models/comment.js');

exports.article_list = asyncHandler(async (req, res, next) => {
  const allArticles = await Article.find().sort({ name: 1 }).exec();
  res.json({
    articles: allArticles,
  });
});

exports.article_detail = asyncHandler(async (req, res, next) => {
  const [article, allArticleComments] = await Promise.all([
    Article.findById(req.params.id).exec(),
    Comment.find({ artist: req.params.id }).populate('user date comment').exec(),
  ]);

  if (article === null) {
    const err = new Error('Article not found');
    err.status = 404;
    return res.json(err);
  }

  res.json({
    article,
    allArticleComments,
  });
});

exports.article_post = [
  body('text')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, process.env.key, async (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const errors = validationResult(req);
        const article = new Article({ user: authData.user, text: req.body.text, time: new Date() });

        if (!errors.isEmpty()) {
          res.json('error');
        } else {
          await article.save();
          res.json({
            article,
            authData,
          });
        }
      }
    });
  }),
];
