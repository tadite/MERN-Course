const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
	let errors = {};

	if (!data.school || Validator.isEmpty(data.school)) {
		errors.school = "School is required";
	}

	if (!data.degree || Validator.isEmpty(data.degree)) {
		errors.degree = "Degree is required";
	}

	if (!data.from || Validator.isEmpty(data.from)) {
		errors.from = "From date is required";
	}

	if (!data.fieldofstudy || Validator.isEmpty(data.fieldofstudy)) {
		errors.fieldofstudy = "Field of study is required";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
