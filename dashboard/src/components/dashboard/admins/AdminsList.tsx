import { AdminContext } from "@/components/Home";
import Spinner from "@/components/ui/Spinner";
import { getAllAdmins } from "@/services/admins/all_admins";
import { AdminEntryType } from "@/types/admin";
import { ErrorType } from "@/types/api";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useQuery } from "react-query";

export default function AdminsList({
	activeItem,
	setActiveItem,
}: {
	activeItem: AdminEntryType | undefined;
	setActiveItem: Dispatch<SetStateAction<AdminEntryType | undefined>>;
}) {
	const [keyword, setKeyword] = useState<string>("");
	const adminContext = useContext(AdminContext);
	const admins = useQuery(["admin_list"], () =>
		getAllAdmins(adminContext.admin?.token)
	);

	return (
		<>
			<div className="relative mt-2">
				<input
					type="text"
					className="pl-8 h-9 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white w-full rounded-md text-sm focus-visible:bg-white"
					placeholder="Search"
					onChange={(e) => {
						setKeyword(e.target.value);
					}}
					value={keyword}
				/>
				<svg
					viewBox="0 0 24 24"
					className="w-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2"
					stroke="currentColor"
					stroke-width="2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</div>
			<div className="flex flex-col gap-4 my-4">
				{admins.isSuccess ? (
					admins.data.data.admins.map((admin: AdminEntryType) => {
						return (
							(admin.title.includes(keyword) ||
								admin.username.includes(keyword) ||
								admin.full_name.includes(keyword)) && (
								<button
									key={admin.username}
									className={
										"text-left rounded-md py-2.5 px-4 focus:outline hover:outline hover:outline-2 focus:outline-dodger-600 hover:outline-dodger-700 focus:outline-2" +
										(activeItem &&
										activeItem.username === admin.username
											? " outline outline-[2.5px] outline-dodger-600 hover:outline-dodger-500 shadow-lg"
											: " shadow-md") +
										(admin.active === false
											? " opacity-70 shadow-none"
											: " bg-white")
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
							)
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
