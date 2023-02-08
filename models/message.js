const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
		},
		content: {
			type: String,
			trim: true,
		},
		chat: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Chat",
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = mongoose.model("Message", messageSchema);
