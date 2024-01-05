import {useContext} from "react";
import {AdminContext} from "@/components/Home";
import {useQuery} from "react-query";
import {getAdmin} from "@/services/admins/info_admin";
import Spinner from "@/components/ui/Spinner";
import {AdminAdminister} from "./tabs/Administer";

export default function AdminsDetailPanel({adminID}: {adminID: string}) {
	const adminContext = useContext(AdminContext);
	const adminQuery = useQuery(["admin_" + adminID], () =>
		getAdmin(adminContext.admin?.token, adminID)
	);
	const admin = adminQuery.isSuccess ? adminQuery.data.data : null;

	return admin && adminQuery.isSuccess ? (
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
			{adminContext.admin && (
				<AdminAdminister
					admin={admin}
					token={adminContext.admin?.token}
					currentAdminID={adminContext.admin?.username}
				/>
			)}
		</>
	) : adminQuery.isLoading ? (
		<div className="h-full flex place-items-center justify-center">
			<Spinner color="accent" size="xl" />
		</div>
	) : (
		<></>
	);
}
