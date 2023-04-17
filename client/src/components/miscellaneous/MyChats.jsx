import axios from "axios";
import { useEffect } from "react";
import { useChatState, useAuthState } from "../../context";
import { getSender } from "../../config/ChatLogics";

// ui
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";

import ChatLoading from "../ChatLoading";
import GroupChatModel from "./GroupChatModel";

const MyChats = ({ fetchAgain }) => {
	const { selectedChat, setSelectedChat, chats, setChats } = useChatState();
	const { user } = useAuthState();

	const fetchChats = async () => {
		const {
			data: {
				data: { chats },
			},
		} = await axios.get("/api/chat");

		setChats(chats);
	};

	useEffect(() => {
		fetchChats();
	}, [fetchAgain]);

	return (
		<Box
			display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
			flexDir="column"
			alignItems="center"
			p={3}
			bg="white"
			w={{ base: "100%", md: "31%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: "15px", md: "20px" }}
				display="flex"
				width="100%"
				justifyContent="space-between"
				alignItems="center"
			>
				<p>My chats</p>
				<GroupChatModel>
					<Button display="flex" fontSize={{ base: "15px", md: "10px", lg: "15px" }} rightIcon={<AddIcon />}>
						New Group Chat
					</Button>
				</GroupChatModel>
			</Box>

			<Box
				display="flex"
				flexDir="column"
				p={3}
				bg="#F8F8F8"
				w="100%"
				h="100%"
				borderRadius="lg"
				overflowY="hidden"
			>
				{chats ? (
					<Stack overflowY={scroll}>
						{chats?.map((chat) => (
							<Box
								onClick={() => setSelectedChat(chat)}
								cursor="pointer"
								bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
								color={selectedChat === chat ? "white" : "black"}
								px={3}
								py={2}
								borderRadius="lg"
								key={chat._id}
							>
								<Text>{!chat.isGroupChat ? getSender(user, chat?.users) : chat.chatName}</Text>
							</Box>
						))}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
