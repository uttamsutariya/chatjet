import { ViewIcon } from "@chakra-ui/icons";
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
	IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import UserBadgeItem from "../user/UserBadgeItem";
import UserListItem from "../user/UserListItem";
import { useAuthState, useChatState } from "../../context";
import { toast } from "react-toastify";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { selectedChat, setSelectedChat } = useChatState();
	const { user } = useAuthState();

	const [groupChatName, setGroupChatName] = useState();
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameloading, setRenameLoading] = useState(false);

	const handleAddUser = async (userToBeAdded) => {
		if (selectedChat?.users?.find((u) => u._id == userToBeAdded._id)) {
			toast.error("User is already in this group");
			return;
		}

		if (selectedChat?.groupAdmin?._id != user?._id) {
			toast.error("Only admins can add members");
			return;
		}

		try {
			setLoading(true);

			const {
				data: {
					data: { groupChat },
				},
			} = await axios.put(`/api/chat/group-add`, {
				chatId: selectedChat._id,
				userId: userToBeAdded._id,
			});

			setSelectedChat(groupChat);
			setFetchAgain((prev) => !prev);
			setLoading(false);
		} catch (error) {
			toast.error(error?.response?.data?.message);
			setLoading(false);
		}
		setGroupChatName("");
	};

	const handleRemove = async (userTobeRemoved) => {
		if (selectedChat?.groupAdmin?._id != user?._id && userTobeRemoved?._id != user?._id) {
			toast.error("Only admins can remove members!");
			return;
		}

		try {
			setLoading(true);

			const {
				data: {
					data: { groupChat },
				},
			} = await axios.put(`/api/chat/group-remove`, {
				chatId: selectedChat._id,
				userId: userTobeRemoved._id,
			});

			userTobeRemoved._id === user._id ? setSelectedChat() : setSelectedChat(groupChat);
			setFetchAgain((prev) => !prev);
			fetchMessages();
			setLoading(false);
		} catch (error) {
			toast.error(error?.response?.data?.message);
			setLoading(false);
		}
		setGroupChatName("");
	};

	const handleRename = async () => {
		if (!groupChatName) return;

		try {
			setRenameLoading(true);

			const {
				data: {
					data: { groupChat },
				},
			} = await axios.put(`/api/chat/rename-group`, {
				groupChatId: selectedChat._id,
				chatName: groupChatName,
			});

			setSelectedChat(groupChat);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch (error) {
			toast.error(error?.response?.data?.message);
			setRenameLoading(false);
		}
		setGroupChatName("");
	};

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

	return (
		<>
			<IconButton onClick={onOpen} display={{ base: "flex" }} icon={<ViewIcon />} />

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="35px" display="flex" justifyContent="center">
						{selectedChat?.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" flexDir="column" alignItems="center">
						<Box w="100%" display="flex" flexWrap="wrap" pb={3}>
							{selectedChat?.users?.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									admin={selectedChat?.groupAdmin}
									handleFunction={() => handleRemove(u)}
								/>
							))}
						</Box>
						<FormControl display="flex">
							<Input
								placeholder="Chat Name"
								mb={3}
								value={groupChatName}
								name="chatName"
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								variant="solid"
								colorScheme="teal"
								ml={1}
								isLoading={renameloading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add User to group"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						{loading ? (
							<p>loading ...</p>
						) : (
							searchResult?.map((user) => (
								<UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
							))
						)}
					</ModalBody>

					<ModalFooter>
						<Button onClick={() => handleRemove(user)} colorScheme="red">
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModel;
