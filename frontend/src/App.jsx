import { Routes, Route } from "react-router-dom";

// components
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

// stylesheet
import "./App.css";

function App() {
	return (
		<div className="app">
			<Routes>
				<Route path="/" index element={<HomePage />} />
				<Route path="/chat" element={<ChatPage />} />
			</Routes>
		</div>
	);
}

export default App;
