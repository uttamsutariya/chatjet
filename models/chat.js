const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
	{
		chatName: {
			type: String,
			trim: true,
		},
		isGroupChat: {
			type: Boolean,
			default: false,
		},
		users: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "User",
			},
		],
		latestMessage: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Message",
		},
		groupAdmin: {
			// if group chat
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = mongoose.model("Chat", chatSchema);
