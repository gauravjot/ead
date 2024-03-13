import {useState} from "react";
import ClientAdminister from "./tabs/Administer";
import Notes from "./tabs/Notes";
import {UserType} from "@/types/user";

export default function UserDetailPanel({user}: {user: UserType}) {
	const [activeTab, setActiveTab] = useState<"administer" | "notes">("administer");

	return (
		<>
			<div className="border-b sticky top-0 z-[5] bg-white">
				<div className="flex gap-6 px-8 py-6">
					<div className="h-16 w-16 bg-gray-200 rounded-full flex place-items-center justify-center capitalize text-4xl text-gray-400">
						{user.name[0]}
					</div>
					<div>
						<h1 className="text-3xl tracking-tight">{user.name}</h1>
						<div className="text-gray-500">{user.title}</div>
						{user.is_admin && (
							<div className="my-1">
								<span className="text-bb border font-medium bg-gray-100 tracking-normal text-gray-500 rounded px-1.5 py-px">
									ADMIN
								</span>
							</div>
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
							setActiveTab("notes");
						}}
						className={
							(activeTab === "notes"
								? "text-dodger-700 border-dodger-600"
								: "text-gray-600 border-transparent") + " border-b-2 p-2 active:bg-dodger-50"
						}
					>
						Notes
						{/* <span className="text-sm">
							{userQuery.data.notes && userQuery.data.notes.length > 0 ? " (" + userQuery.data.notes.length + ")" : ""}
						</span> */}
					</button>
				</div>
			</div>
			{activeTab === "administer" && <ClientAdminister user={user} />}
			{activeTab === "notes" && <Notes user={user} />}
		</>
	);
}
