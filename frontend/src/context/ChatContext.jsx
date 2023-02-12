import React, { createContext, useContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState();
	const [notification, setNotification] = useState([]);

	return (
		<ChatContext.Provider
			value={{
				selectedChat,
				setSelectedChat,
				notification,
				setNotification,
				chats,
				setChats,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
