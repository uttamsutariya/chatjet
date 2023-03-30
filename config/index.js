require("dotenv").config();
module.exports = {
	PORT: process.env.port || 5050,
	DB_URL: process.env.DB_URL,
	CLIENT_URL: process.env.CLIENT_URL,
	COOKIE_EXPIRE_DAYS: process.env.COOKIE_EXPIRE_DAYS,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRY: process.env.JWT_EXPIRY,
	CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
	MULTIAVATAR_APIKEY: process.env.MULTIAVATAR_APIKEY,
};
