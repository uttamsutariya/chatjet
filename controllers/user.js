const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const CustomError = require("../utils/customError");
const { cookieToken } = require("../utils/cookieToken");
const cloudinary = require("cloudinary").v2;

// models
const User = require("../models/user");

/**
 * controllers
 */

// register (signup)
exports.registerUser = asyncHandler(async (req, res, next) => {
	const { name, email, password, pic } = req.body;

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

	if (req.files) {
		let profilePic = req.files.pic;

		const { secure_url } = await cloudinary.uploader.upload(profilePic.tempFilePath, {
			folder: "users",
		});

		userData = { ...userData, pic: secure_url };
	}

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

	const decode = jwt.verify(token, process.env.JWT_SECRET);

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
