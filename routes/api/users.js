const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route GET /api/users/test
// @desc Test for users
// @access public
router.get("/test", (req, res) => res.json({ msg: "Users is OK" }));

// @route POST /api/users/register
// @desc Test for users
// @access public
router.post("/register", (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			errors.email = "Email already exists";
			return res.status(400).json(errors);
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: "200",
				r: "pg",
				d: "mm"
			});

			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				avatar
			});

			bcrypt.genSalt(10, (err, salt) => {
				if (err) throw err;
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
		}
	});
});

// @route POST /api/users/login
// @desc Login for users
// @access public
router.post("/login", (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then(user => {
		if (!user) {
			errors.email = "User not found";
			return res.status(404).json(errors);
		}
		bcrypt.compare(req.body.password, user.password).then(isMatch => {
			if (isMatch) {
				const payload = { id: user.id, name: user.name, avatar: user.avatar };
				jwt.sign(
					payload,
					keys.secretOrKey,
					{ expiresIn: 3600 },
					(err, token) => {
						if (err) throw err;
						res.json({
							success: true,
							token: "Bearer " + token
						});
					}
				);
			} else {
				errors.email = "Incorrect password";
				return res.status(400).json(errors);
			}
		});
	});
});

// @route POST /api/users/current
// @desc Current user
// @access private
router.get(
	"/current",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.json({
			id: req.user.id,
			name: req.user.name,
			email: req.user.email
		});
	}
);

// @route DELETE /api/users
// @desc Current user
// @access private
router.delete(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		User.findByIdAndDelete(req.user.id).then(() => {
			Profile.findOneAndRemove({ user: req.user.id }).then(() => {
				return res.status(204).json({ success: true });
			});
		});
	}
);

// @route GET /api/users/:user_id/profile
// @desc Get user profile by user_id
// @access public
router.get("/:user_id/profile", (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.params.user_id })
		.populate("user", ["name", "avatar"])
		.then(profile => {
			if (!profile) {
				errors.noprofile = "There is no profile for this user";
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => {
			errors.noprofile = "There is no profile for this user";
			res.status(400).json(errors);
		});
});

module.exports = router;
