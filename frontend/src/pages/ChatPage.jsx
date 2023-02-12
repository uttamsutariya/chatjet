import { useState } from "react";
import { Box } from "@chakra-ui/layout";

// components
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";

const ChatPage = () => {
	const [fetchAgain, setFetchAgain] = useState(false);

	return (
		<div style={{ width: "100%" }}>
			<SideDrawer />
			<Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
				<MyChats fetchAgain={fetchAgain} />
				<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
			</Box>
		</div>
	);
};

export default ChatPage;
