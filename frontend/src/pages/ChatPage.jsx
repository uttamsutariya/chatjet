import { useState, useEffect } from "react";
import axios from "axios";

const ChatPage = () => {
	const [chats, setChats] = useState([]);

	const fetchChats = async () => {
		const { data } = await axios.get("/api/chat");
		setChats(data);
		console.log(data);
	};

	useEffect(() => {
		fetchChats();
	}, []);

	return <div>ChatPage</div>;
};

export default ChatPage;
