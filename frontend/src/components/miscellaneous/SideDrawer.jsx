import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/menu";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { Badge } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModel";
import ChatLoading from "../ChatLoading";
import UserListItem from "../user/UserListItem";

import { useAuthState, useAuthDispatch, useChatState, logout } from "../../context";

import axios from "axios";
import { toast } from "react-toastify";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const { user } = useAuthState();
	const { chats, setChats, setSelectedChat, notification, setNotification } = useChatState();
	const dispatch = useAuthDispatch();
	const navigate = useNavigate();

	const handleSearch = async () => {
		setLoading(true);

		try {
			const { data } = await axios.get(`/api/user?search=${search}`);
			setLoading(false);
			setSearchResult(data?.data?.users);
		} catch (error) {
			toast.error("something went wrong");
		}
	};

	const accessChat = async (id) => {
		try {
			const {
				data: {
					data: { chat },
				},
			} = await axios.post("/api/chat", { userId: id });

			if (!chats.find((c) => c._id == chat._id)) setChats([...chats, chat]);
			setSelectedChat(chat);
			setLoadingChat(false);
			onClose();
			setSearch("");
		} catch (error) {
			toast.error("something went wrong");
		}
	};

	useEffect(() => {
		handleSearch();
	}, [search]);

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px 5px 10px"
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
					<Button variant="ghost" onClick={onOpen}>
						<SearchIcon />
						<Text display={{ base: "none", md: "flex" }} px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize="2xl">ChatJet🚀</Text>
				<div>
					<Menu>
						<MenuButton m={1}>
							<Badge margin="1" colorScheme="">
								<BellIcon fontSize="2xl" m={1} />
								<span style={{ color: "red" }}>{!notification.length ? "" : notification.length}</span>
							</Badge>
						</MenuButton>
						<MenuList>
							{!notification.length && <MenuItem>"No new messages"</MenuItem>}
							{notification.map((noti) => (
								<MenuItem
									onClick={() => {
										setSelectedChat(noti.chat);
										setNotification(notification.filter((n) => n != noti));
									}}
									key={noti._id}
								>
									{noti.chat.isGroupChat
										? `New message in ${noti.chat.chatName}`
										: `New message from ${getSender(user, noti.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar size="sm" cursor="pointer" name={user?.name} src={user?.pic}></Avatar>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem
								onClick={() => {
									logout(dispatch);
									navigate("/");
								}}
							>
								Logout
							</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								name="search"
								onChange={(e) => setSearch(e.target.value)}
							/>
							{/* <Button onClick={handleSearch}>Go</Button> */}
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((user) => (
								<UserListItem
									key={user?._id}
									user={user}
									handleFunction={() => accessChat(user?._id)}
								/>
							))
						)}
						{loadingChat && <Spinner ml="auto" d="flex" />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
