const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
	let errors = {};

	if (!data.text || Validator.isEmpty(data.text)) {
		errors.text = "Text is required";
	} else if (!Validator.isLength(data.text, { min: 2, max: 300 })) {
		errors.text = "Text length must be between 2 and 300 symbols";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
