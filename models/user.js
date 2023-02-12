const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Username is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
		},
		pic: {
			type: String,
			required: [true, "Profile picture is required"],
			default: null,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

// Encrypt password before save
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 8);
});

// check for password validation in login
userSchema.methods.isValidatedPassword = async function (userSendPassword) {
	return await bcrypt.compare(userSendPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
