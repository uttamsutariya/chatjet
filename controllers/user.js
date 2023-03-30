const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const { cookieToken } = require("../utils/cookieToken");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

// models
const User = require("../models/user");

const { MULTIAVATAR_APIKEY, JWT_SECRET } = require("../config");

/**
 * controllers
 */

// /api/user?search=xyz
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find({
		$or: [
			{ name: { $regex: req.query.search, $options: "i" } },
			{ email: { $regex: req.query.search, $options: "i" } },
		],
	}).find({ _id: { $ne: req.user._id } });

	return res.status(200).json({
		status: "success",
		data: {
			users,
		},
	});
});

/**
 * 	Auth controllers
 */

// register (signup)
exports.registerUser = asyncHandler(async (req, res, next) => {
	const { name, email, password } = req.body;

	if (!email || !password || !name) {
		return next(new CustomError("Name, email & password are required", 400));
	}

	let user = await User.findOne({ email });

	if (user) {
		return next(new CustomError("User already exist", 400));
	}

	let userData = {
		name,
		email,
		password,
	};

	// let pic;

	if (req.files) {
		let profilePic = req.files.pic;

		const { secure_url } = await cloudinary.uploader.upload(profilePic.tempFilePath, {
			folder: "users",
		});

		pic = secure_url;
	} else {
		pic = `https://api.multiavatar.com/${name}.png?apikey=${MULTIAVATAR_APIKEY}`;
	}

	userData = { ...userData, pic };

	// create user
	user = await User.create(userData);

	// sending token in cookie
	cookieToken(user, res);
});

// login
exports.logIn = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// check if email & password present
	if (!email || !password) return next(new CustomError("Email and password are required", 400));

	// getting user from DB
	const user = await User.findOne({ email }).select("+password");

	// if user not exist
	if (!user) {
		return next(new CustomError("Invalid credentials", 400));
	}

	const isPasswordValidate = await user.isValidatedPassword(password);

	// wrong password
	if (!isPasswordValidate) {
		return next(new CustomError("Invalid credentials", 400));
	}

	// sending token in cookie
	cookieToken(user, res);
});

// load user
exports.loadUser = asyncHandler(async (req, res, next) => {
	const token = req.cookies.token;

	// if token unavailable send null user
	if (!token)
		return res.status(200).json({
			status: "success",
			data: {
				user: null,
			},
		});

	const decode = jwt.verify(token, JWT_SECRET);

	// token invalid or expired
	if (!decode) return next(new CustomError("Login again", 403));

	let user = await User.findOne({ _id: decode.id }).select("+role");

	// sending token in cookie
	cookieToken(user, res);
});

// logout user
exports.logout = asyncHandler(async (req, res, next) => {
	res.clearCookie("token");

	return res.status(200).json({
		status: "success",
		message: "Logout success",
		data: {},
	});
});
