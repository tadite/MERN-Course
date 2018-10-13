const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	text: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: "User"
			},
			text: {
				type: String,
				required: true
			},
			name: {
				type: String
			},
			avatar: {
				type: String
			},
			date: {
				type: Date,
				default: Date.now
			},
			likes: [
				{
					type: Schema.Types.ObjectId,
					ref: "User"
				}
			]
		}
	]
});

module.exports = Post = mongoose.model("Post", PostSchema);