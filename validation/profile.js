const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
	let errors = {};

	if (!data.handle || Validator.isEmpty(data.handle)) {
		errors.handle = "Handle is required";
	} else if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
		errors.handle = "Handle length must be between 2 and 40 symbols";
	}

	if (!data.status || Validator.isEmpty(data.status)) {
		errors.status = "Status is required";
	}

	if (!data.skills || Validator.isEmpty(data.skills)) {
		errors.skills = "Skills is required";
	}

	if (data.website && !Validator.isEmpty(data.website)) {
		if (!Validator.isURL(data.website)) {
			errors.website = "Not valid URL";
		}
	}

	if (data.twitter && !Validator.isEmpty(data.twitter)) {
		if (!Validator.isURL(data.twitter)) {
			errors.twitter = "Not valid URL";
		}
	}

	if (data.facebook && !Validator.isEmpty(data.facebook)) {
		if (!Validator.isURL(data.facebook)) {
			errors.facebook = "Not valid URL";
		}
	}

	if (data.youtube && !Validator.isEmpty(data.youtube)) {
		if (!Validator.isURL(data.youtube)) {
			errors.youtube = "Not valid URL";
		}
	}

	if (data.linkedin && !Validator.isEmpty(data.linkedin)) {
		if (!Validator.isURL(data.linkedin)) {
			errors.linkedin = "Not valid URL";
		}
	}

	if (data.instagram && !Validator.isEmpty(data.instagram)) {
		if (!Validator.isURL(data.instagram)) {
			errors.instagram = "Not valid URL";
		}
	}

	if (data.twitter && !Validator.isEmpty(data.twitter)) {
		if (!Validator.isURL(data.twitter)) {
			errors.twitter = "Twitter is invalid";
		}
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
