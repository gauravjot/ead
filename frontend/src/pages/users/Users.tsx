import {useState} from "react";
import {UserType} from "@/types/user";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import {getUser} from "@/services/user/get_user";
import Button from "@/components/ui/Button";
import UsersList from "@/components/dashboard/users/List";
import UserDetailPanel from "@/components/dashboard/users/DetailPanel";
import AddNewUser from "@/components/dashboard/users/AddNew";
import Sidebar from "@/components/dashboard/Sidebar";
import QuickLinkBar from "@/components/dashboard/QuickLinkBar";

export default function UsersPage() {
	const {id} = useParams();
	const [activeItem, setActiveItem] = useState<UserType>();
	const [showAddUserUI, setShowAddUserUI] = useState<boolean>(false);

	useQuery(["user_" + id], () => (id ? getUser(id) : Promise.reject("No value is selected.")), {
		enabled: !!id,
		onSuccess: (data) => setActiveItem(data),
		onError: () => setActiveItem(undefined),
	});

	return (
		<div className="flex h-screen overflow-hidden">
			<div className="px-3 border-r h-screen bg-white">
				<Sidebar activeMenu={"users"} />
			</div>
			<div className="flex-1 h-full overflow-hidden flex flex-col">
				<QuickLinkBar />
				<div className="flex flex-grow overflow-x-hidden">
					<div className="w-64 p-4 flex-shrink-0 border-r overflow-y-auto h-full bg-gray-100">
						<div className="flex place-items-center mb-4">
							<div className="capitalize text-sm mt-2 mb-1 text-gray-800 font-thin tracking-wider flex-1">
								USERS
							</div>
							<div>
								<Button
									elementState="default"
									elementStyle="primary"
									elementType="button"
									elementChildren="Add"
									elementSize="xsmall"
									elementInvert={true}
									onClick={() => {
										setShowAddUserUI(true);
										window.setTimeout(() => document?.getElementById("full_name")?.focus(), 0);
									}}
									aria-expanded={showAddUserUI}
								/>
							</div>
						</div>
						<UsersList activeItem={activeItem} />
					</div>
					<div className="overflow-y-auto bg-white w-full">
						{activeItem?.id && <UserDetailPanel key={activeItem.id} user={activeItem} />}
					</div>
				</div>
				<div aria-hidden={!showAddUserUI} className="aria-hidable absolute inset-0">
					{/* clicking empty space closes the box */}
					<div
						className="absolute inset-0 bg-black/10"
						onClick={() => {
							setShowAddUserUI(false);
						}}
					></div>
					{/* dialog box content */}
					<div className="bg-white shadow-xl px-4 py-6 sm:px-8 sm:py-12 relative z-20">
						<div className="flex container mx-auto">
							<h1 className="text-2xl flex-1 font-bold tracking-tight mb-3 xl:min-w-[45rem]">
								Add new user
							</h1>
							<div>
								<button
									className="ic-xl pt-1 border rounded-md hover:outline hover:outline-gray-200 hover:border-gray-400"
									onClick={() => {
										setShowAddUserUI(false);
									}}
									title="Close"
								>
									<span className="ic ic-close"></span>
								</button>
							</div>
						</div>
						<div className="container mx-auto">
							<AddNewUser setShowDialog={setShowAddUserUI} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
