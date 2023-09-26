import { AdminEntryType } from "@/types/admin";
import AdminsList from "./AdminsList";
import { useState } from "react";
import AdminsDetailPanel from "./AdminsDetailPanel";
import AddNewAdmin from "./AddNewAdmin";
import Button from "@/components/ui/Button";

export default function Admins() {
	const [activeItem, setActiveItem] = useState<AdminEntryType>();
	const [showAddUserUI, setShowAddUserUI] = useState<boolean>(false);

	return (
		<>
			<div className="flex flex-grow overflow-x-hidden">
				<div className="w-64 p-4 flex-shrink-0 border-r overflow-y-auto h-full">
					<div className="flex place-items-center mb-4">
						<div className="capitalize text-sm mt-2 mb-1 text-gray-800 font-thin tracking-wider flex-1">
							ADMINS
						</div>
						<div>
							<Button
								state="default"
								styleType="primary"
								type="button"
								children="Add"
								size="xsmall"
								outline={true}
								onClick={() => {
									setShowAddUserUI(true);
									window.setTimeout(
										() =>
											document
												?.getElementById("full_name")
												?.focus(),
										0
									);
								}}
								aria-expanded={showAddUserUI}
							/>
						</div>
					</div>
					<AdminsList activeItem={activeItem} setActiveItem={setActiveItem} />
				</div>
				<div className="overflow-y-auto bg-white w-full">
					{activeItem?.username && (
						<AdminsDetailPanel
							key={activeItem.username}
							adminID={activeItem.username}
						/>
					)}
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
				<div className="bg-white shadow-xl px-4 py-6 sm:px-8 sm:py-12 relative z-10">
					<div className="flex container mx-auto">
						<h1 className="text-2xl flex-1 font-bold tracking-tight mb-3 xl:min-w-[45rem]">
							Add new admin
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
						<AddNewAdmin setShowDialog={setShowAddUserUI} />
					</div>
				</div>
			</div>
		</>
	);
}
