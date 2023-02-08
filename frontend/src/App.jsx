import { Routes, Route } from "react-router-dom";

// components
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

function App() {
	return (
		<div className="app">
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/chat" element={<ChatPage />} />
			</Routes>
		</div>
	);
}

export default App;
