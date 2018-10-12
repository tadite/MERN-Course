const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
	let errors = {};

	if (!data.title || Validator.isEmpty(data.title)) {
		errors.title = "Title is required";
	}

	if (!data.company || Validator.isEmpty(data.company)) {
		errors.company = "Сompany is required";
	}

	if (!data.from || Validator.isEmpty(data.from)) {
		errors.from = "From date is required";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
