const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route GET /api/profile/test
// @desc Test for profile
// @access public
router.get("/test", (req, res) => res.json({ msg: "Profile is OK" }));

// @route GET /api/profile
// @desc Get current user profile
// @access private
router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const errors = {};
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				if (!profile) {
					errors.noprofile = "There is no profile for this user";
					return res.status(404).json(errors);
				}
				res.json(profile);
			})
			.catch(err => res.status(400).json(err));
	}
);

module.exports = router;
