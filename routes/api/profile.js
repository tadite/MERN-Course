const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

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
			.populate("user", ["name", "avatar"])
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

// @route POST /api/profile
// @desc Create user profile
// @access private
router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateProfileInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		const profileFields = {};
		profileFields.user = req.user.id;
		if (req.body.handle) profileFields.handle = req.body.handle;
		if (req.body.company) profileFields.company = req.body.company;
		if (req.body.website) profileFields.website = req.body.website;
		if (req.body.location) profileFields.location = req.body.location;
		if (req.body.bio) profileFields.bio = req.body.bio;
		if (req.body.status) profileFields.status = req.body.status;
		if (req.body.githubusername)
			profileFields.githubusername = req.body.githubusername;

		if (typeof req.body.skills !== "undefined") {
			profileFields.skills = req.body.skills.split(",");
		}

		profileFields.social = {};
		if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
		if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
		if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
		if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
		if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

		Profile.findOne({ user: req.user.id }).then(profile => {
			if (profile) {
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				).then(profile => res.json(profile));
			} else {
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = "That handle is already exist";
						return res.status(400).json(errors);
					}

					new Profile(profileFields).save().then(profile => res.json(profile));
				});
			}
		});
	}
);

// @route GET /api/profile/handle/:handle
// @desc Get user profile by handle
// @access public
router.get("/handle/:handle", (req, res) => {
	const errors = {};
	Profile.findOne({ handle: req.params.handle })
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

// @route GET /api/profile/user/:user_id
// @desc Get user profile by user_id
// @access public
router.get("/user/:user_id", (req, res) => {
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

// @route GET /api/profile/all
// @desc Get all profiles
// @access public
router.get("/all", (req, res) => {
	const errors = {};
	Profile.find()
		.populate("user", ["name", "avatar"])
		.then(profile => {
			if (!profile) {
				errors.noprofile = "There are no profiles yet";
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => {
			errors.noprofile = "There are no profiles yet";
			res.status(400).json(errors);
		});
});

// @route POST /api/profile/experience
// @desc Add experience to profile
// @access private
router.post(
	"/experience",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateExperienceInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id })
			.then(profile => {
				if (!profile) {
					errors.noprofile = "There in no profile";
					return res.status(404).json(errors);
				}

				const newExp = {
					title: req.body.title,
					company: req.body.company,
					location: req.body.location,
					from: req.body.from,
					to: req.body.to,
					current: req.body.current,
					description: req.body.description
				};

				profile.experience.unshift(newExp);

				profile.save().then(profile => res.json(profile));
			})
			.catch(err => {
				return res.status(400).json(err);
			});
	}
);

// @route POST /api/profile/education
// @desc Add education to profile
// @access private
router.post(
	"/education",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateEducationInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		Profile.findOne({ user: req.user.id })
			.then(profile => {
				if (!profile) {
					errors.noprofile = "There in no profile";
					return res.status(404).json(errors);
				}

				const newEdu = {
					school: req.body.school,
					degree: req.body.degree,
					fieldofstudy: req.body.fieldofstudy,
					from: req.body.from,
					to: req.body.to,
					current: req.body.current,
					description: req.body.description
				};

				profile.education.unshift(newEdu);

				profile.save().then(profile => res.json(profile));
			})
			.catch(err => {
				return res.status(400).json(err);
			});
	}
);

// @route DELETE /api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access private
router.delete(
	"/experience/:exp_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				if (!profile) {
					errors.noprofile = "There in no profile";
					return res.status(404).json(errors);
				}

				profile.experience.remove(req.params.exp_id);

				profile.save().then(profile => res.json(profile));
			})
			.catch(err => {
				return res.status(400).json(err);
			});
	}
);

// @route DELETE /api/profile/education/:exp_id
// @desc Delete education from profile
// @access private
router.delete(
	"/education/:edu_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				if (!profile) {
					errors.noprofile = "There in no profile";
					return res.status(404).json(errors);
				}

				profile.education.remove(req.params.edu_id);

				profile.save().then(profile => res.json(profile));
			})
			.catch(err => {
				return res.status(400).json(err);
			});
	}
);

module.exports = router;
