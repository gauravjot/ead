import {useQuery} from "react-query";
import {AdminContext} from "@/components/Home";
import {useContext, useState} from "react";
import Spinner from "@/components/ui/Spinner";
import ClientAdminister from "./tabs/Administer";
import ClientNotes from "./tabs/Notes";
import {UserType} from "@/types/user";
import {getUser} from "@/services/user/get_user";

export default function UserDetailPanel({userID}: {userID: string}) {
	const adminContext = useContext(AdminContext);
	const userQuery = useQuery(["user_" + userID], () => getUser(adminContext.admin?.token, userID));
	const user: UserType | null = userQuery.isSuccess ? userQuery.data.data : null;
	const [activeTab, setActiveTab] = useState<"administer" | "notes">("administer");

	return userQuery.isSuccess && user ? (
		<>
			<div className="border-b sticky top-0 z-[5] bg-white">
				<div className="flex gap-6 px-8 py-6">
					<div className="h-16 w-16 bg-gray-200 rounded-full flex place-items-center justify-center capitalize text-4xl text-gray-400">
						{user.name[0]}
					</div>
					<div>
						<h1 className="text-3xl tracking-tight">{user.name} </h1>
						<div className="text-gray-500">{user.role}</div>
					</div>
				</div>
				<div className="text-bb px-8 flex gap-6">
					<button
						onClick={() => {
							setActiveTab("administer");
						}}
						className={
							(activeTab === "administer"
								? "text-dodger-700 border-dodger-600"
								: "text-gray-600 border-transparent") + " border-b-2 p-2 active:bg-dodger-50"
						}
					>
						Administer
					</button>
					<button
						onClick={() => {
							setActiveTab("notes");
						}}
						className={
							(activeTab === "notes"
								? "text-dodger-700 border-dodger-600"
								: "text-gray-600 border-transparent") + " border-b-2 p-2 active:bg-dodger-50"
						}
					>
						Notes
						<span className="text-sm">
							{user.notes && user.notes.length > 0 ? " (" + user.notes.length + ")" : ""}
						</span>
					</button>
				</div>
			</div>
			{activeTab === "administer" && <ClientAdminister admin={adminContext.admin} user={user} />}
			{activeTab === "notes" && <ClientNotes admin={adminContext.admin} user={user} />}
		</>
	) : userQuery.isLoading ? (
		<div className="h-full flex place-items-center justify-center">
			<Spinner color="accent" size="xl" />
		</div>
	) : (
		<></>
	);
}
