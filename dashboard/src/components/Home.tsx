import {AdminType} from "@/types/admin";
import {QuickLinkBar} from "./dashboard/QuickLinkBar";
import Sidebar from "./dashboard/Sidebar";
import LoginBox from "./login/LoginBox";
import React, {Dispatch, SetStateAction} from "react";
import Admins from "./dashboard/admins/Admins";
import Invoices from "./dashboard/invoices/Invoices";
import Clients from "./dashboard/invoice-clients/Clients";
import Items from "./dashboard/database-items/Items";

export const AdminContext = React.createContext<{
	admin: AdminType | null;
	setAdmin: Dispatch<SetStateAction<AdminType | null>>;
}>({
	admin: null,
	setAdmin: () => {
		return null;
	},
});

export default function Home() {
	const [admin, setAdmin] = React.useState<AdminType | null>(null);
	const [isSearchActive, setIsSearchActive] = React.useState<boolean>(false);
	console.log(isSearchActive);

	// sidebar
	const [activeMenu, setActiveMenu] = React.useState<"admins" | "clients" | "items" | "invoices">(
		"clients"
	);

	return admin ? (
		<AdminContext.Provider value={{admin, setAdmin}}>
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
					{activeMenu === "clients" ? <Clients /> : <></>}
					{activeMenu === "items" ? <Items /> : <></>}
					{activeMenu === "invoices" ? <Invoices /> : <></>}
				</div>
			</div>
		</AdminContext.Provider>
	) : (
		<div>
			<div className="container max-w-5xl px-4 mx-auto py-6">
				<LoginBox setAdmin={setAdmin} />
			</div>
		</div>
	);
}
