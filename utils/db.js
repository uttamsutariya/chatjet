const mongoose = require("mongoose");

const { DB_URL } = require("../config");

const connect = () => {
	mongoose.set("strictQuery", false);
	mongoose
		.connect(DB_URL)
		.then((res) => console.log(`Db connected on: ${res.connection.host}:${res.connection.port}`))
		.catch((err) => {
			console.log(err);
			process.exit(1);
		});
};

module.exports = connect;
