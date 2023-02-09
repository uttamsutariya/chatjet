import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { loginUser, useAuthDispatch } from "../../context";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const defaultFormData = {
		email: "",
		password: "",
	};

	const [show, setShow] = useState(false);
	const [formData, setFormData] = useState(defaultFormData);
	const [loading, setLoading] = useState(false);
	const dispatch = useAuthDispatch();
	const navigate = useNavigate();

	const { email, password } = formData;

	const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();

		const { email, password } = formData;

		if (!email || !password) {
			toast.error("Email & password are required");
			setLoading(false);
			return;
		}

		const user = await loginUser(dispatch, { email, password });
		if (user) {
			navigate("/chat");
		}
		setFormData(defaultFormData);
		setLoading(false);
	};

	return (
		<VStack spacing="5px">
			<FormControl isRequired>
				<FormLabel>Email Address</FormLabel>
				<Input
					value={email}
					type="email"
					name="email"
					placeholder="Enter Your Email Address"
					onChange={handleChange}
					autoComplete="off"
				/>
			</FormControl>
			<FormControl isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup size="md">
					<Input
						value={password}
						type={show ? "text" : "password"}
						name="password"
						placeholder="Enter Password"
						onChange={handleChange}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<Button
				isLoading={loading}
				fontWeight="thin"
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={handleSubmit}
			>
				Login
			</Button>
			<Button fontWeight="thin" variant="solid" colorScheme="red" width="100%">
				Forgot Password ?
			</Button>
		</VStack>
	);
};

export default Login;
