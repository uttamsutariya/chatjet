import { Box, Container, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";

// components
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";

const HomePage = () => {
	return (
		<Container maxW="xl" centerContent>
			<Box
				d="flex"
				justifyContent="center"
				p={3}
				bg="white"
				w="100%"
				m="40px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
			>
				<Text fontSize="3xl" fontWeight="bold" align="center" color="black">
					ChatJet🚀
				</Text>
			</Box>
			<Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
				<Tabs isFitted variant="soft-rounded">
					<TabList mb="1em">
						<Tab>Login</Tab>
						<Tab>Sign Up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<Signup />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default HomePage;
