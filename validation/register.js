const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
	let errors = {};

	if (!data.name || Validator.isEmpty(data.name)) {
		errors.name = "Name is required'";
	} else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = "Name must me between 2 and 30 characters";
	}

	if (!data.password || Validator.isEmpty(data.password)) {
		errors.password = "Password is required'";
	} else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = "Password length must be between 6 and 30 symbols";
	}

	if (!data.password2 || Validator.isEmpty(data.password2)) {
		errors.password2 = "Password confirmation is required'";
	} else if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = "Passwords must match";
	} else if (!Validator.isLength(data.password2, { min: 6, max: 30 })) {
		errors.password2 = "Password length must be between 6 and 30 symbols";
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
