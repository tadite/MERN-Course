const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
	let errors = {};

	if (!data.password || Validator.isEmpty(data.password)) {
		errors.password = "Password is required'";
	} else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = "Password length must be between 6 and 30 symbols";
	}

	if (!data.email || Validator.isEmpty(data.email)) {
		errors.email = "Email is required'";
	} else if (!Validator.isEmail(data.email)) {
		errors.email = "Email is invalid";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
