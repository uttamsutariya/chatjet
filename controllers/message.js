const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const CustomError = require("../utils/customError");
const { findByIdAndUpdate } = require("../models/user");

// send message
// /api/message (post)
exports.sendMessage = asyncHandler(async (req, res, next) => {
	const { message, chatId } = req.body;

	if (!message || !chatId) return next(new CustomError("Provide message & chatId", 400));

	const chat = await Chat.countDocuments({ _id: chatId });

	if (!chat) return next(new CustomError("Chat doesn't exist", 400));

	const data = {
		content: message,
		chat: chatId,
		sender: req.user._id,
	};

	let newMessage = await Message.create(data);
	newMessage = await newMessage.populate("sender", "name pic");
	newMessage = await newMessage.populate("chat");
	newMessage = await User.populate(newMessage, {
		path: "chat.users",
		select: "name pic email",
	});

	await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

	return res.status(201).json({
		status: "success",
		message: "message added",
		data: {
			message: newMessage,
		},
	});
});

// fetch all messages
// /api/message/:chatId (get)
exports.getChatMessages = asyncHandler(async (req, res, next) => {
	const { chatId } = req.params;

	if (!chatId) return next(new CustomError("Provide chatId in params", 400));

	const messages = await Message.find({ chat: chatId }).populate("sender", "name pic email").populate("chat");

	return res.status(200).json({
		status: "success",
		message: "message fetched",
		data: { messages },
	});
});
