import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { signupUser, useAuthDispatch } from "../../context";

const Signup = () => {
	const defaultFormData = {
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		pic: "",
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const navigate = useNavigate();

	const dispatch = useAuthDispatch();

	const { name, email, password, confirmPassword } = formData;

	const handleChange = (e) => {
		if (e.target.type == "file") {
			setFormData({ ...formData, [e.target.name]: e.target.files[0] });
		} else setFormData({ ...formData, [e.target.name]: e.target.value });

		if (name && email && password && confirmPassword) setDisabled(false);
		else setDisabled(true);
	};

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();

		const { name, email, password, confirmPassword, pic } = formData;

		if (!name || !email || !password || !confirmPassword) {
			toast.error("All fields are required");
			setLoading(false);
			return;
		}

		// check for password matching
		if (password != confirmPassword) {
			toast.error("Password doesn't match");
			setLoading(false);
			return;
		}

		// only jpg & png
		if (pic && pic.type != "image/jpeg" && pic.type != "image/png") {
			toast.error("only .jpg & .png formats are allowed");
			setLoading(false);
			return;
		}

		let uploadData = new FormData();

		for (let key in formData) uploadData.append(key, formData[key]);

		const user = await signupUser(dispatch, uploadData);
		if (user) {
			navigate("/chat");
		}
		setFormData(defaultFormData);
		setLoading(false);
	};

	return (
		<VStack spacing="5px">
			<FormControl isRequired>
				<FormLabel>Name</FormLabel>
				<Input value={name} placeholder="Enter Your Name" name="name" onChange={handleChange} required={true} />
			</FormControl>
			<FormControl isRequired>
				<FormLabel>Email Address</FormLabel>
				<Input
					value={email}
					type="email"
					placeholder="Enter Your Email Address"
					name="email"
					onChange={handleChange}
					required={true}
				/>
			</FormControl>
			<FormControl isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup size="md">
					<Input
						value={password}
						type={show ? "text" : "password"}
						placeholder="Enter Password"
						name="password"
						onChange={handleChange}
						required={true}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup size="md">
					<Input
						value={confirmPassword}
						type={show ? "text" : "password"}
						placeholder="Confirm password"
						name="confirmPassword"
						onChange={handleChange}
						required={true}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl>
				<FormLabel>Upload your Picture</FormLabel>
				<Input type="file" p={1.5} accept="image/*" name="pic" onChange={handleChange} required={true} />
			</FormControl>
			<Button
				fontWeight="thin"
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={handleSubmit}
				isDisabled={disabled}
				isLoading={loading}
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export default Signup;
