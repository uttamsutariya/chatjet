import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	FormControl,
	Input,
	Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import UserBadgeItem from "../user/UserBadgeItem";
import UserListItem from "../user/UserListItem";

import { useChatState, useAuthState } from "../../context";
import { toast } from "react-toastify";

const GroupChatModel = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const { chats, setChats } = useChatState();
	const { user } = useAuthState();

	const handleSearch = async (query) => {
		if (!query) {
			setSearchResult([]);
			return;
		}

		try {
			setLoading(true);

			const {
				data: {
					data: { users },
				},
			} = await axios.get(`/api/user?search=${query}`);
			setSearchResult(users);
		} catch (error) {
			toast.error(error?.response?.data?.message);
		} finally {
			setLoading(false);
		}
	};

	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast.warning("User already added");
			return;
		}

		setSelectedUsers([...selectedUsers, userToAdd]);
	};

	const handleDelete = (delUser) => {
		setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
	};

	const handleSubmit = async () => {
		if (!groupChatName || selectedUsers.length == 0) {
			toast.error("Please fill all fields");
			return;
		}

		const dataToBeSubmitted = {
			chatName: groupChatName,
			users: selectedUsers.map((u) => u._id),
		};

		try {
			const {
				data: {
					data: { groupChat },
				},
			} = await axios.post("/api/chat/group", dataToBeSubmitted);

			setChats([groupChat, ...chats]);
			onClose();
			toast.success("Group created succesfully");

			setSearchResult([]);
			setSelectedUsers([]);
			setSearch("");
			setGroupChatName("");
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="35px" display="flex" justifyContent="center">
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" flexDir="column" alignItems="center">
						<FormControl>
							<Input
								placeholder="Chat Name"
								name="chatName"
								value={groupChatName}
								mb={3}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add Users eg: Rock, Jack, Dominic"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						<Box w="100%" d="flex" flexWrap="wrap">
							{selectedUsers.map((u) => (
								<UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
							))}
						</Box>
						{loading ? (
							<div>Loading...</div>
						) : (
							searchResult
								?.slice(0, 6)
								?.map((user) => (
									<UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button onClick={handleSubmit} colorScheme="blue">
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModel;
