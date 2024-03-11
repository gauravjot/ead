import {AdminAdminister} from "./tabs/Administer";
import {AdminEntryType} from "@/types/admin";

export default function AdminsDetailPanel({admin}: {admin: AdminEntryType}) {
	return (
		<>
			<div className="border-b sticky top-0 bg-white z-[5]">
				<div className="flex gap-6 px-8 py-6">
					<div className="h-16 w-16 bg-gray-200 rounded-full flex place-items-center justify-center capitalize text-4xl text-gray-400">
						{admin.full_name[0]}
					</div>
					<div>
						<h1 className="text-3xl tracking-tight">
							{admin.full_name} <span className="text-gray-600 text-bb">@{admin.username}</span>
						</h1>
						<div className="text-gray-500">{admin.title}</div>
					</div>
				</div>
				<div className="text-bb px-8 flex gap-6">
					<div className="text-dodger-700 border-b-2 border-dodger-600 p-2">Administer</div>
				</div>
			</div>
			<AdminAdminister admin={admin} />
		</>
	);
}
