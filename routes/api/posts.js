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

// @route POST /api/posts
// @desc Create post
// @access public
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

module.exports = router;
