import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import axios from "axios";

// auth & chat provider
import { AuthProvider, ChatProvider } from "./context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthProvider>
			<ChatProvider>
				<BrowserRouter>
					<ChakraProvider>
						<ToastContainer
							autoClose={500}
							hideProgressBar={true}
							newestOnTop={false}
							closeOnClick={true}
							closeButton={false}
							limit={2}
							position="bottom-center"
							theme="dark"
						/>
						<App />
					</ChakraProvider>
				</BrowserRouter>
			</ChatProvider>
		</AuthProvider>
	</React.StrictMode>
);
