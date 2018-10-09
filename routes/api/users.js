const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("../../models/User");

// @route GET /api/users/test
// @desc Test for users
// @access public
router.get("/test", (req, res) => res.json({ msg: "Users is OK" }));

// @route POST /api/users/register
// @desc Test for users
// @access public
router.post("/register", (req, res) => {
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res.status(400).json({ email: "Email already exists" });
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
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email }).then(user => {
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}
		bcrypt.compare(password, user.password).then(isMatch => {
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
				return res.status(400).json({ msg: "Incorrect password" });
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

module.exports = router;
