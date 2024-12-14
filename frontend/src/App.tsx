/* Router */
import {Route, Routes, BrowserRouter as Router, Navigate} from "react-router-dom";
/* CSS */
import "@/assets/styles/global.css";
import "@/assets/styles/icons.css";
import "@/assets/styles/inputs.css";
/* Components */
import React, {Dispatch, SetStateAction, Suspense, useEffect} from "react";
import {getMe} from "@/services/auth/get_me";
import HomePage from "./pages/Home";
import {UserType} from "./types/user";
import DashboardPage from "./pages/dashboard/Index";
import {useMutation} from "@tanstack/react-query";

const ItemsPage = React.lazy(() => import("@/pages/items/Items"));

export const UserContext = React.createContext<{
	user: UserType | null;
	setUser: Dispatch<SetStateAction<UserType | null>>;
}>({
	user: null,
	setUser: () => {
		return null;
	},
});

export default function App() {
	const [user, setUser] = React.useState<UserType | null>(null);

	const mutation = useMutation({
		mutationFn: () => getMe(),
		onSuccess: (data) => {
			setUser(data);
		},
	});

	useEffect(() => {
		if (mutation.isIdle) {
			mutation.mutate();
		}
	}, []);

	return (mutation.isSuccess && user) || mutation.isError ? (
		<UserContext.Provider value={{user: user, setUser: setUser}}>
			<Router>
				<Routes>
					<Route path={"/"} element={user ? <Navigate to={"/dashboard"} /> : <HomePage />} />
					{/* Redirect to login page if not logged in */}
					{!user && <Route path={"*"} element={<Navigate to={"/"} />} />}
					{/* Auth routes */}
					{user && (
						<>
							<Route path={"/dashboard"} element={<DashboardPage />} />
							<Route
								path={"/items"}
								element={
									<Suspense fallback={<Loading msg="Loading dashboard..." />}>
										<ItemsPage />
									</Suspense>
								}
							/>
							<Route
								path={"/items/:id"}
								element={
									<Suspense fallback={<Loading msg="Loading dashboard..." />}>
										<ItemsPage />
									</Suspense>
								}
							/>
						</>
					)}
				</Routes>
			</Router>
		</UserContext.Provider>
	) : mutation.isSuccess && !user ? (
		<Route path={"*"} element={<Navigate to={"/"} />} />
	) : (
		<Loading msg="Authenticating with server..." />
	);
}

function Loading({msg}: {msg: string}) {
	return <div className="p-4 text-bb text-gray-700">{msg}</div>;
}
