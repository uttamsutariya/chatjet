require("dotenv").config();
const express = require("express");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const { CLIENT_URL } = require("./config");

// app initialization
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: CLIENT_URL,
		methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
		credentials: true,
		exposedHeaders: ["*", "Authorization"],
	})
);

app.use(cookieParser());

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "./temp",
	})
);

// routes
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/message");

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.use("/api", (req, res) => {
	res.status(200).json({
		message: "Chatjet api, working nice",
	});
});

// middleware for access frontend
const buildPath = path.normalize(path.join(__dirname, "/client/dist"));
app.use(express.static(buildPath));

app.get("*", (req, res) => {
	res.sendFile(path.join(buildPath, "index.html"));
});

// error handling
app.use(globalErrorHandler);

module.exports = app;
