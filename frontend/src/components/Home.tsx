import React, {Dispatch, SetStateAction, Suspense, lazy} from "react";
import {LoggedInAdminType} from "@/types/admin";
import {useQuery} from "react-query";
import {getLoggedInAdmin} from "@/services/auth/get_me";
import Spinner from "./ui/Spinner";

const Sidebar = lazy(() => import("./dashboard/Sidebar"));
const Admins = lazy(() => import("./dashboard/admins/Admins"));
const Items = lazy(() => import("./dashboard/database-items/Items"));
const Users = lazy(() => import("./dashboard/users/Users"));
const QuickLinkBar = lazy(() => import("./dashboard/QuickLinkBar"));
const LoginBox = lazy(() => import("./login/LoginBox"));

export const AdminContext = React.createContext<{
	admin: LoggedInAdminType | null;
	setAdmin: Dispatch<SetStateAction<LoggedInAdminType | null>>;
}>({
	admin: null,
	setAdmin: () => {
		return null;
	},
});

export default function Home() {
	const [admin, setAdmin] = React.useState<LoggedInAdminType | null>(null);
	const [isSearchActive, setIsSearchActive] = React.useState<boolean>(false);
	console.log(isSearchActive);

	// Get user profile for logged-in admin
	const loggedInAdminQuery = useQuery(["loggedInAdmin"], () => getLoggedInAdmin(), {
		onSuccess: (data) => {
			setAdmin(data);
		},
		refetchOnWindowFocus: false,
		retry: false,
	});

	// sidebar
	const [activeMenu, setActiveMenu] = React.useState<"admins" | "users" | "items">("users");

	return !admin && loggedInAdminQuery.isLoading ? (
		<div className="screen-loader flex flex-col gap-4 justify-center h-screen w-screen fixed z-50 backdrop-blur-md inset-0 place-items-center">
			<Spinner color="gray" size="md" />
			<span className="text-bb text-gray-700 font-medium border border-gray-300 bg-gray-200 rounded-md shadow px-2 py-0.5">
				Authenticating session...
			</span>
		</div>
	) : admin ? (
		<AdminContext.Provider value={{admin, setAdmin}}>
			<Suspense
				fallback={
					<div className="screen-loader flex flex-col gap-4 justify-center h-screen w-screen fixed z-50 backdrop-blur-md inset-0 place-items-center">
						<Spinner color="gray" size="md" />
						<span className="text-bb text-gray-700 font-medium border border-gray-300 bg-gray-200 rounded-md shadow px-2 py-0.5">
							Loading {activeMenu} dashboard...
						</span>
					</div>
				}
			>
				<div className="flex h-screen overflow-hidden">
					<div className="px-3 border-r h-screen bg-white">
						<Sidebar
							activeMenu={activeMenu}
							setActiveMenu={setActiveMenu}
							setIsSearchActive={setIsSearchActive}
						/>
					</div>
					<div className="flex-1 h-full overflow-hidden flex flex-col">
						<QuickLinkBar />
						{activeMenu === "admins" ? <Admins /> : <></>}
						{activeMenu === "users" ? <Users /> : <></>}
						{activeMenu === "items" ? <Items /> : <></>}
					</div>
				</div>
			</Suspense>
		</AdminContext.Provider>
	) : (
		<div>
			<div className="container max-w-5xl px-4 mx-auto py-6">
				<LoginBox setAdmin={setAdmin} />
			</div>
		</div>
	);
}
