const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");
const CustomError = require("../utils/customError");

// create or access chat (one to one chat)
// /api/chat
exports.accessChat = asyncHandler(async (req, res, next) => {
	const { userId } = req.body;

	if (!userId) return next(new CustomError("Provide userId", 400));

	let isChat = await Chat.find({
		isGroupChat: false,
		$and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }],
	})
		.populate("users")
		.populate("latestMessage");

	isChat = await User.populate(isChat, {
		path: "latestMessage.sender",
		select: "name pic email",
	});

	if (isChat.length > 0) {
		return res.status(200).json({
			status: "success",
			message: "chat aready exist",
			data: {
				chat: isChat[0],
			},
		});
	} else {
		const newChatData = {
			chatName: "sender",
			isGroupChat: false,
			users: [req.user._id, userId],
		};

		const newChat = await Chat.create(newChatData);

		const fullChat = await Chat.findById(newChat._id).populate("users");

		return res.status(200).json({
			status: "success",
			message: "new chat created",
			data: {
				chat: fullChat,
			},
		});
	}
});

// fetch all chat for logged in user
// /api/chat
exports.fetchChat = asyncHandler(async (req, res, next) => {
	let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
		.populate("users")
		.populate("groupAdmin")
		.populate("latestMessage")
		.sort({ updatedAt: -1 });

	chats = await User.populate(chats, {
		path: "latestMessage.sender",
		select: "name email pic",
	});

	return res.status(200).json({
		status: "success",
		message: "chat data fetched",
		data: {
			chats,
		},
	});
});

// create groupchat
// /api/chat/group
exports.createGroupChat = asyncHandler(async (req, res, next) => {
	const { chatName, users } = req.body;

	if (!chatName || !users) return next(new CustomError("Please add users & chatname", 400));

	if (users.length < 2) return next(new CustomError("Al least 3 users are required for group chat", 400));

	//  in group chat => all user added & plus logged in user are part of group chat
	users.push(req.user._id);

	const newChatData = {
		chatName,
		users,
		isGroupChat: true,
		groupAdmin: req.user._id,
	};

	const groupChat = await Chat.create(newChatData);

	const fullGroupChat = await Chat.findById(groupChat._id).populate("users").populate("groupAdmin");

	return res.status(201).json({
		status: "success",
		message: "Group created successfully",
		data: {
			groupChat: fullGroupChat,
		},
	});
});

// rename group
// /api/chat/rename-group
exports.renameGroup = asyncHandler(async (req, res, next) => {
	const { groupChatId, chatName } = req.body;

	if (!chatName || !groupChatId) return next(new CustomError("Please add groupChatId & chatname", 400));

	const updatedChat = await Chat.findByIdAndUpdate(groupChatId, { chatName }, { new: true })
		.populate("users")
		.populate("groupAdmin");

	if (!updatedChat) return next(new CustomError("Chat not found with this id", 400));

	return res.status(200).json({
		status: "success",
		message: "group renamed",
		data: {
			groupChat: updatedChat,
		},
	});
});

// add user to group
// /api/chat/group-add
exports.addToGroup = asyncHandler(async (req, res, next) => {
	const { chatId, userId } = req.body;

	if (!chatId || !userId) return next(new CustomError("Provide chatId & userId", 400));

	const added = await Chat.findByIdAndUpdate(
		chatId,
		{
			$push: { users: userId },
		},
		{ new: true }
	)
		.populate("users")
		.populate("groupAdmin");

	if (!added) return next(new CustomError("GroupChat not found with this id", 400));

	return res.status(200).json({
		status: "success",
		message: "user added to the group",
		data: {
			groupChat: added,
		},
	});
});

// rem,ove user from group
// /api/chat/group-remove
exports.removeFromGroup = asyncHandler(async (req, res, next) => {
	const { chatId, userId } = req.body;

	if (!chatId || !userId) return next(new CustomError("Provide chatId & userId", 400));

	const removed = await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull: { users: userId },
		},
		{ new: true }
	)
		.populate("users")
		.populate("groupAdmin");

	if (!removed) return next(new CustomError("GroupChat not found with this id", 400));

	return res.status(200).json({
		status: "success",
		message: "user remove from the group",
		data: {
			groupChat: removed,
		},
	});
});

exports.deleteGroup = asyncHandler(async (req, res, next) => {
	const { chatId } = req.params;

	if (!chatId) return next(new CustomError("Provide chatId", 400));

	const groupChat = await Chat.findById(chatId);

	if (!groupChat) return next(new CustomError("Chat not found with this id", 400));

	if (groupChat.groupAdmin.toString() != req.user._id.toString())
		return next(new CustomError("Only admin can delete group", 400));

	await Chat.deleteOne({ _id: chatId });

	await Message.deleteMany({ chat: chatId });

	res.status(200).json({
		status: "success",
		message: "group deleted",
		data: { chatId },
	});
});
