/* Router */
import {Route, Routes, BrowserRouter as Router, Navigate} from "react-router-dom";
/* CSS */
import "@/assets/styles/global.css";
import "@/assets/styles/icons.css";
import "@/assets/styles/inputs.css";
/* Components */
import React, {Dispatch, SetStateAction, Suspense} from "react";
import {LoggedInAdminType} from "./types/admin";
import {useQuery} from "react-query";
import {getLoggedInAdmin} from "@/services/auth/get_me";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";

const AdminsPage = React.lazy(() => import("@/pages/admins/Admins"));
const ItemsPage = React.lazy(() => import("@/pages/items/Items"));
const UsersPage = React.lazy(() => import("@/pages/users/Users"));

export const AdminContext = React.createContext<{
	admin: LoggedInAdminType | null;
	setAdmin: Dispatch<SetStateAction<LoggedInAdminType | null>>;
}>({
	admin: null,
	setAdmin: () => {
		return null;
	},
});

export default function App() {
	const [admin, setAdmin] = React.useState<LoggedInAdminType | null>(null);

	// Get user profile for logged-in admin
	const query = useQuery(["loggedInAdmin"], () => getLoggedInAdmin(), {
		onSuccess: (data) => {
			setAdmin(data);
		},
		refetchOnWindowFocus: false,
		retry: false,
	});

	return query.isSuccess || query.isError ? (
		<AdminContext.Provider value={{admin, setAdmin}}>
			<Router>
				<Routes>
					<Route path={"/"} element={<HomePage />} />
					<Route path={"/login"} element={<LoginPage />} />
					{/* Redirect to login page if not logged in */}
					{!admin && <Route path={"*"} element={<Navigate to={"/login"} />} />}
					{/* Auth routes */}
					{admin && (
						<>
							<Route
								path={"/admins"}
								element={
									<Suspense fallback={<Loading msg="Loading dashboard..." />}>
										<AdminsPage />
									</Suspense>
								}
							/>
							<Route
								path={"/admins/:id"}
								element={
									<Suspense fallback={<Loading msg="Loading dashboard..." />}>
										<AdminsPage />
									</Suspense>
								}
							/>
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
							<Route
								path={"/users"}
								element={
									<Suspense fallback={<Loading msg="Loading dashboard..." />}>
										<UsersPage />
									</Suspense>
								}
							/>
							<Route
								path={"/users/:id"}
								element={
									<Suspense fallback={<Loading msg="Loading dashboard..." />}>
										<UsersPage />
									</Suspense>
								}
							/>
						</>
					)}
				</Routes>
			</Router>
		</AdminContext.Provider>
	) : (
		<Loading msg="Authenticating with server..." />
	);
}

function Loading({msg}: {msg: string}) {
	return <div className="p-4 text-bb text-gray-700">{msg}</div>;
}
