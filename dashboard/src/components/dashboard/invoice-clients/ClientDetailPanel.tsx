import {useQuery} from "react-query";
import {AdminContext} from "@/components/Home";
import {useContext, useState} from "react";
import Spinner from "@/components/ui/Spinner";
import ClientAdminister from "./client-tabs/Administer";
import ClientNotes from "./client-tabs/Notes";
import {ClientType} from "@/types/client";
import {getClient} from "@/services/invoice/client/get_client";

export default function ClientDetailPanel({userID}: {userID: string}) {
	const adminContext = useContext(AdminContext);
	const clientQuery = useQuery(["client_" + userID], () =>
		getClient(adminContext.admin?.token, userID)
	);
	const client: ClientType | null = clientQuery.isSuccess ? clientQuery.data.data : null;
	const [activeTab, setActiveTab] = useState<"administer" | "notes">("administer");

	return clientQuery.isSuccess && client ? (
		<>
			<div className="border-b sticky top-0 z-[5] bg-white">
				<div className="flex gap-6 px-8 py-6">
					<div className="h-16 w-16 bg-gray-200 rounded-full flex place-items-center justify-center capitalize text-4xl text-gray-400">
						{client.name[0]}
					</div>
					<div>
						<h1 className="text-3xl tracking-tight">{client.name} </h1>
						<span className="text-gray-500 text-bb">ID: {client.id}</span>
						<div className="text-gray-500">{client.type}</div>
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
							{client.notes && client.notes.length > 0 ? " (" + client.notes.length + ")" : ""}
						</span>
					</button>
				</div>
			</div>
			{activeTab === "administer" && (
				<ClientAdminister admin={adminContext.admin} client={client} />
			)}
			{activeTab === "notes" && <ClientNotes admin={adminContext.admin} client={client} />}
		</>
	) : clientQuery.isLoading ? (
		<div className="h-full flex place-items-center justify-center">
			<Spinner color="accent" size="xl" />
		</div>
	) : (
		<></>
	);
}
