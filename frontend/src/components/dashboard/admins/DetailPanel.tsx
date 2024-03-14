import {useState} from "react";
import {AdminAdminister} from "./tabs/Administer";
import {AdminEntryType} from "@/types/admin";
import {LogsTab} from "./tabs/Logs";

export default function AdminsDetailPanel({admin}: {admin: AdminEntryType}) {
	const [activeTab, setActiveTab] = useState<"administer" | "logs">("administer");

	return (
		<>
			<div className="border-b sticky top-0 bg-white z-[5]">
				<div className="flex gap-6 px-8 py-6">
					<div className="h-16 w-16 bg-gray-200 rounded-full flex place-items-center justify-center capitalize text-4xl text-gray-400">
						{admin.user_name?.toUpperCase()[0] || admin.username.toUpperCase()[0]}
					</div>
					<div>
						<h1 className="text-3xl tracking-tight">
							{admin.user_name || admin.username}{" "}
							<span className="text-gray-600 text-bb">@{admin.username}</span>
						</h1>
						{admin.user_title ? (
							<div className="text-gray-500">{admin.user_title}</div>
						) : admin.user_id ? (
							<div className="text-gray-500">User ID: {admin.user_id}</div>
						) : (
							<div className="text-gray-500">Not connected to user profile</div>
						)}
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
							setActiveTab("logs");
						}}
						className={
							(activeTab === "logs"
								? "text-dodger-700 border-dodger-600"
								: "text-gray-600 border-transparent") + " border-b-2 p-2 active:bg-dodger-50"
						}
					>
						Logs
					</button>
				</div>
			</div>
			{activeTab === "administer" && <AdminAdminister admin={admin} />}
			{activeTab === "logs" && <LogsTab admin={admin} />}
		</>
	);
}
