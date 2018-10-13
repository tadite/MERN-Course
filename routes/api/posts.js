const express = require("express");
const router = express.Router();
const passport = require("passport");

const validatePostInput = require("../../validation/post");
const validateCommentInput = require("../../validation/comment");

const Post = require("../../models/Post");
const User = require("../../models/User");

// @route GET /api/posts/test
// @desc Test for posts
// @access public
router.get("/test", (req, res) => res.json({ msg: "Posts is OK" }));

// @route GET /api/posts/:post_id
// @desc Get post by id
// @access public
router.get("/:post_id", (req, res) => {
	Post.findById(req.params.post_id)
		.then(post => res.json(post))
		.catch(err =>
			res.status(404).json({ nopostfound: "No post found with that id" })
		);
});

// @route GET /api/posts
// @desc Get all posts
// @access public
router.get("/", (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route POST /api/posts
// @desc Create post
// @access private
router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		const newPost = new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.user.avatar,
			user: req.user.id
		});

		newPost.save().then(post => res.json(post));
	}
);

// @route DELETE /api/posts/:post_id
// @desc Delete post
// @access private
router.delete(
	"/:post_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id)
			.then(post => {
				if (post.user.toString() !== req.user.id) {
					return res
						.status(401)
						.json({ notauthorized: "User can't delete other users posts" });
				}
				Post.findByIdAndRemove(req.params.post_id)
					.then(post => {
						return res.status(204).json(post);
					})
					.catch(err =>
						res
							.status(404)
							.json({ postnotfound: "There is no post with that id" })
					);
			})
			.catch(err =>
				res.status(404).json({ postnotfound: "There is no post with that id" })
			);
	}
);

// @route POST /api/posts/:post_id/like
// @desc Like post
// @access private
router.post(
	"/:post_id/like",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id)
			.then(post => {
				if (
					post.likes.filter(like => like.user.toString() === req.user.id)
						.length > 0
				) {
					return res
						.status(400)
						.json({ alreadyliked: "User already liked this post" });
				}

				post.likes.unshift({ user: req.user.id });

				post.save().then(post => res.json(post));
			})
			.catch(err => {
				console.log(err);
				res.status(404).json({ postnotfound: "There is no post with that id" });
			});
	}
);

// @route POST /api/posts/:post_id/unlike
// @desc Unlike post
// @access private
router.post(
	"/:post_id/unlike",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id)
			.then(post => {
				if (
					post.likes.filter(like => like.user.toString() === req.user.id)
						.length === 0
				) {
					return res
						.status(400)
						.json({ notliked: "User have not liked this post" });
				}

				console.log(req.user.id);
				const likeIndexToRemove = post.likes
					.map(like => like.user.toString())
					.indexOf(req.user.id);

				post.likes.splice(likeIndexToRemove, 1);

				post.save().then(post => res.json(post));
			})
			.catch(err => {
				console.log(err);
				res.status(404).json({ postnotfound: "There is no post with that id" });
			});
	}
);

// @route POST /api/posts/:post_id/comment
// @desc Comment post
// @access private
router.post(
	"/:post_id/comment",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id)
			.then(post => {
				const { errors, isValid } = validateCommentInput(req.body);

				if (!isValid) {
					return res.status(400).json(errors);
				}

				const newComment = {
					text: req.body.text,
					name: req.body.name,
					avatar: req.body.avatar,
					user: req.user.id
				};

				post.comments.unshift(newComment);

				post.save().then(post => res.json(post));
			})
			.catch(err => {
				console.log(err);
				res.status(404).json({ postnotfound: "There is no post with that id" });
			});
	}
);

// @route DELETE /api/posts/:post_id/comment/:comment_id
// @desc Delete comment
// @access private
router.delete(
	"/:post_id/comment/:comment_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id)
			.then(post => {
				const commentRemoveIndex = post.comments
					.map(item => item._id.toString())
					.indexOf(req.params.comment_id);

				if (commentRemoveIndex < 0) {
					return res
						.status(404)
						.json({ commentnotfound: "There is no comment with that id" });
				}

				post.comments.splice(commentRemoveIndex, 1);

				post.save().then(post => res.json(post));
			})
			.catch(err => {
				console.log(err);
				res.status(404).json({ postnotfound: "There is no post with that id" });
			});
	}
);

// @route POST /api/posts/:post_id/comment/:comment_id/like
// @desc Comment like
// @access private
router.post(
	"/:post_id/comment/:comment_id/like",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id)
			.then(post => {
				const commentIndexToLike = post.comments
					.map(comment => comment._id.toString())
					.indexOf(req.params.comment_id);

				if (commentIndexToLike < 0) {
					return res
						.status(400)
						.json({ commentnotfound: "There is no comment with that id" });
				}

				const commentToLike = post.comments[commentIndexToLike];
				if (
					commentToLike.likes.filter(
						like => like.user.toString() === req.user.id
					).length > 0
				) {
					return res.json({ alreadyliked: "User already liked this comment" });
				}

				commentToLike.likes.unshift({ user: req.user.id });

				post.comments.set(commentIndexToLike, commentToLike);
				post.save().then(post => res.json(post));
			})
			.catch(err => {
				console.log(err);
				res.status(404).json({ postnotfound: "There is no post with that id" });
			});
	}
);

// @route POST /api/posts/:post_id/comment/:comment_id/unlike
// @desc Comment like
// @access private
router.post(
	"/:post_id/comment/:comment_id/unlike",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.post_id)
			.then(post => {
				const commentIndexToUnlike = post.comments
					.map(comment => comment._id.toString())
					.indexOf(req.params.comment_id);

				if (commentIndexToUnlike < 0) {
					return res
						.status(400)
						.json({ commentnotfound: "There is no comment with that id" });
				}

				const commentToUnlike = post.comments[commentIndexToUnlike];
				if (
					commentToUnlike.likes.filter(
						like => like.user.toString() === req.user.id
					).length == 0
				) {
					return res.json({ alreadyliked: "User have not liked this comment" });
				}

				const likeIndexToRemove = commentToUnlike.likes
					.map(like => like.user.toString())
					.indexOf(req.user.id);

				commentToUnlike.likes.splice(likeIndexToRemove, 1);

				post.comments.set(commentIndexToUnlike, commentToUnlike);
				post.save().then(post => res.json(post));
			})
			.catch(err => {
				console.log(err);
				res.status(404).json({ postnotfound: "There is no post with that id" });
			});
	}
);

module.exports = router;
