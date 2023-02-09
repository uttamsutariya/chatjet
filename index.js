// env var set and db connection
require("dotenv").config();
require("./config/db")();

const app = require("./app");
const PORT = process.env.PORT || 5050;

const cloudinary = require("cloudinary");

// cloudinary config
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => console.log(`App server started on port:${PORT}`));
