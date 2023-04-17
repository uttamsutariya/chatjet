import { Routes, Route } from "react-router-dom";

// components
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import PersistLogin from "./components/auth/PersistLogin";
import PrivateRoute from "./components/auth/PrivateRoute";

// stylesheet
import "./App.css";

function App() {
	return (
		<div className="app">
			<Routes>
				<Route path="/" index element={<HomePage />} />
				<Route element={<PersistLogin />}>
					{/* private route */}
					<Route element={<PrivateRoute />}>
						<Route path="/chat" element={<ChatPage />} />
					</Route>
				</Route>
			</Routes>
		</div>
	);
}

export default App;
