import { AdminContext } from "@/components/Home";
import Spinner from "@/components/ui/Spinner";
import { getAllAdmins } from "@/services/admins/all_admins";
import { AdminEntryType } from "@/types/admin";
import { ErrorType } from "@/types/api";
import { Dispatch, SetStateAction, useContext } from "react";
import { useQuery } from "react-query";

export default function AdminsList({
	activeItem,
	setActiveItem,
}: {
	activeItem: AdminEntryType | undefined;
	setActiveItem: Dispatch<SetStateAction<AdminEntryType | undefined>>;
}) {
	const adminContext = useContext(AdminContext);
	const admins = useQuery(["admin_list"], () =>
		getAllAdmins(adminContext.admin?.token)
	);

	return (
		<>
			<div className="flex flex-col gap-4">
				{admins.isSuccess ? (
					admins.data.data.admins.map((admin: AdminEntryType) => {
						return (
							<button
								key={admin.username}
								className={
									"text-left bg-white rounded-md py-2.5 px-4 focus:outline hover:outline hover:outline-2 focus:outline-dodger-600 hover:outline-gray-300 focus:outline-2" +
									(activeItem && activeItem.username === admin.username
										? " outline outline-2 outline-dodger-600 hover:outline-dodger-600 shadow-lg"
										: " shadow-md")
								}
								onClick={() => {
									setActiveItem(admin);
								}}
							>
								<div className="text-bb font-medium">
									{admin.full_name}
								</div>
								<div className="mt-1 text-sm text-gray-600">
									{admin.title}
								</div>
							</button>
						);
					})
				) : admins.isLoading ? (
					<div className="text-center py-24">
						<Spinner color="gray" size="md" />
					</div>
				) : admins.isError ? (
					<div>{(admins.error as ErrorType).message}</div>
				) : (
					<></>
				)}
			</div>
		</>
	);
}
