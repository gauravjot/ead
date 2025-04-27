/* Router */
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
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
	isLoading: boolean;
	setUser: Dispatch<SetStateAction<UserType | null>>;
}>({
	user: null,
	isLoading: true,
	setUser: () => {
		return null;
	},
});

export default function App() {
	const [user, setUser] = React.useState<UserType | null>(null);
	const [isMutating, setIsMutating] = React.useState(true);

	const mutation = useMutation({
		mutationFn: () => getMe(),
		onSuccess: (data) => {
			setUser(data);
			setIsMutating(false);
		},
		onError: () => {
			setIsMutating(false);
		},
	});

	useEffect(() => {
		if (mutation.isIdle) {
			mutation.mutate();
		}
	}, []);

	return (
		<UserContext.Provider value={{user: user, isLoading: isMutating, setUser: setUser}}>
			<Router>
				<Routes>
					<Route path={"/"} element={<HomePage />} />
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
				</Routes>
			</Router>
		</UserContext.Provider>
	);
}

function Loading({msg}: {msg: string}) {
	return <div className="p-4 text-bb text-gray-700">{msg}</div>;
}
