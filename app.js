const express = require("express");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// app initialization
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

app.get("/", (req, res) => {
	res.send("<h1>ChatJet🚀 API is awesome</h1>");
});

// error handling
app.use(globalErrorHandler);

module.exports = app;
