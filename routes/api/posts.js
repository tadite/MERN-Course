const express = require("express");
const router = express.Router();
const passport = require("passport");

const validatePostnInput = require("../../validation/post");

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
		const { errors, isValid } = validatePostnInput(req.body);

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

// @route POST /api/posts/like/:post_id
// @desc Like post
// @access private
router.post(
	"/like/:post_id",
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

// @route POST /api/posts/unlike/:post_id
// @desc Unlike post
// @access private
router.post(
	"/unlike/:post_id",
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

module.exports = router;
