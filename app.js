require("dotenv").config();
const app = require("express")();
const { chats } = require("./data/data.js");

app.get("/api/chat", (req, res) => {
	res.send(chats);
});

app.get("/api/chat/id", (req, res) => {});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`App server started on port:${PORT}`));
