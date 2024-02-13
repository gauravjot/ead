import {AdminContext} from "@/components/Home";
import Spinner from "@/components/ui/Spinner";
import {getAllUsers} from "@/services/user/all_users";
import {ErrorType} from "@/types/api";
import {UserType} from "@/types/user";
import {Dispatch, SetStateAction, useContext, useState} from "react";
import {useQuery} from "react-query";

export default function UsersList({
	activeItem,
	setActiveItem,
}: {
	activeItem: UserType | undefined;
	setActiveItem: Dispatch<SetStateAction<UserType | undefined>>;
}) {
	const [keyword, setKeyword] = useState<string>("");
	const adminContext = useContext(AdminContext);
	const users = useQuery(["user_list"], () => getAllUsers(adminContext.admin?.token));

	return (
		<>
			<div className="flex">
				<div className="relative flex-1" title="Filter with name, email and title">
					<input
						type="text"
						className="pl-8 h-9 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white w-full rounded-md text-sm focus-visible:bg-white"
						placeholder="Filter"
						onChange={(e) => {
							setKeyword(e.target.value);
						}}
						value={keyword}
					/>
					<svg
						viewBox="0 0 24 24"
						className="w-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2"
						stroke="currentColor"
						strokeWidth={2}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</div>
				<div className="ml-2 flex place-items-center">
					<button
						title="Refresh"
						onClick={() => {
							users.refetch();
						}}
						className="h-9 w-9 hover:bg-gray-300 rounded flex place-items-center justify-center"
					>
						{users.isFetching ? (
							<Spinner size="sm" color="black" />
						) : (
							<span className="ic ic-sync"></span>
						)}
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-3 my-4">
				{users.isSuccess ? (
					users.data.data.map((user: UserType) => {
						return (
							(user.email.toLowerCase().includes(keyword.toLowerCase()) ||
								user.role.toLowerCase().includes(keyword.toLowerCase()) ||
								user.name.toLowerCase().includes(keyword.toLowerCase())) && (
								<button
									key={user.id + user.name}
									className={
										"text-left bg-white rounded-md py-2.5 px-4 focus:outline hover:outline hover:outline-2 focus:outline-dodger-600 hover:outline-dodger-700 focus:outline-2" +
										(activeItem && activeItem.id === user.id
											? " outline outline-[2.5px] outline-dodger-600 hover:outline-dodger-500 shadow-md"
											: " shadow")
									}
									onClick={() => {
										setActiveItem(user);
									}}
								>
									<div title={user.name} className="text-bb font-medium">
										{user.name}
									</div>
									<div title={user.email} className="mt-1 text-sm text-gray-600 truncate">
										{user.email.length > 0 ? user.email : user.role}
									</div>
								</button>
							)
						);
					})
				) : users.isLoading ? (
					<div className="text-center py-24">
						<Spinner color="gray" size="md" />
					</div>
				) : users.isError ? (
					<div>{(users.error as ErrorType).message}</div>
				) : (
					<></>
				)}
			</div>
		</>
	);
}
