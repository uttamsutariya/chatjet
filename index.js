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

const server = app.listen(PORT, () => console.log(`App server started on port:${PORT}`));

const io = require("socket.io")(server, {
	pingTimeOut: 60000,
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	// for socket setup with loggedin user, (user room)
	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});

	// to join particular room when a single chat is selected by client, room = chat._id
	socket.on("join chat", (room) => {
		socket.join(room);
	});

	// for new message
	socket.on("new message", (newMessage) => {
		let chat = newMessage.chat;

		if (!chat.users) return console.log("chat.users is not defined");

		chat?.users?.forEach((user) => {
			// if msg send by me (loggedin user)
			if (user._id == newMessage.sender._id) return;

			// it means inside that user's room emit 'message received' socket
			socket.in(user._id).emit("message received", newMessage);
		});
	});

	// typing indicator
	socket.on("typing", (room) => {
		socket.in(room).emit("typing");
	});

	socket.on("stop typing", (room) => {
		socket.in(room).emit("stop typing");
	});
});
