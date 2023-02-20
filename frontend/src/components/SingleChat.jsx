import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { IconButton, Spinner } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useAuthState, useChatState } from "../context";
import { getSender, getFullSender } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ScrollableChat from "./miscellaneous/ScrollableChat";

// socket

import io from "socket.io-client";
const ENDPOINT = "http://43.204.177.160:5050";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const { user } = useAuthState();
	const { selectedChat, setSelectedChat, notification, setNotification } = useChatState();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		socket = io(ENDPOINT);

		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));

		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
	}, []);

	useEffect(() => {
		fetchMessages();

		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	useEffect(() => {
		socket.on("message received", (newMessage) => {
			if (!selectedChatCompare || selectedChatCompare._id != newMessage.chat._id) {
				if (!notification.includes(newMessage)) {
					setNotification([newMessage, ...notification]);
					setFetchAgain((prev) => !prev);
				}
			} else {
				// add to list of messages
				setMessages([...messages, newMessage]);
			}
		});
	});

	const sendMessage = async (e) => {
		if (e.key == "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				setNewMessage("");

				const {
					data: {
						data: { message },
					},
				} = await axios.post("/api/message", {
					message: newMessage,
					chatId: selectedChat._id,
				});

				socket.emit("new message", message);

				setMessages([...messages, message]);
			} catch (error) {
				toast.error(error?.response?.data?.message);
			}
		}
	};

	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			const {
				data: {
					data: { messages },
				},
			} = await axios.get(`/api/message/${selectedChat._id}`);

			setMessages(messages);
			setLoading(false);

			// join new room based on selected chat
			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			toast.error("Failed to load the messages");
		}
	};

	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		// typing indicator logic
		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}

		let lastTypingTime = new Date().getTime();

		setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;

			if (timeDiff >= 3000 && typing) {
				socket.emit("stop typing", selectedChat._id);
				setTyping(false);
			}
		}, 3000);
	};

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w="100%"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat?.isGroupChat ? (
							<>
								{getSender(user, selectedChat?.users)}
								<ProfileModal user={getFullSender(user, selectedChat?.users)} />
							</>
						) : (
							<>
								{selectedChat?.chatName?.toUpperCase()}
								<UpdateGroupChatModel
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>
							</>
						)}
					</Text>

					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#E8E8E8"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						{loading ? (
							<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
						) : (
							<>
								<div className="messages">
									{/* messages */}
									<ScrollableChat messages={messages} />
								</div>
								<FormControl onKeyDown={sendMessage} isRequired mt={3}>
									{isTyping && (
										<span
											style={{
												backgroundColor: "#000",
												color: "#fff",
												marginLeft: "33px",
												marginBottom: "10px",
												borderRadius: "20px",
												padding: "5px 15px",
												display: "inline-block",
											}}
										>
											Typing . . .
										</span>
									)}

									<Input
										variant="filled"
										bg="#e0e0e0"
										placeholder="Enter a message ..."
										onChange={typingHandler}
										value={newMessage}
										name="message"
										autoComplete="off"
									/>
								</FormControl>
							</>
						)}
					</Box>
				</>
			) : (
				<Box display="flex" alignItems="center" justifyContent="center" h="100%">
					<Text fontSize="3xl" pb={3}>
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
