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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const { user } = useAuthState();
	const { selectedChat, setSelectedChat } = useChatState();

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
								{console.log(user)}
								{console.log(selectedChat)}
								{getSender(user, selectedChat?.users)}
								<ProfileModal user={getFullSender(user, selectedChat?.users)} />
							</>
						) : (
							<>
								{selectedChat?.chatName?.toUpperCase()}
								<UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
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
					></Box>
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
