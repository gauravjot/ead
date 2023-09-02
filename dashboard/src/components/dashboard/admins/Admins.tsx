import { AdminEntryType } from "@/types/admin";
import AdminsList from "./AdminsList";
import { useState } from "react";
import AdminsDetailPanel from "./AdminsDetailPanel";

export default function Admins() {
	const [activeItem, setActiveItem] = useState<AdminEntryType>();

	return (
		<div className="flex flex-grow overflow-x-hidden">
			<div className="w-64 p-4 flex-shrink-0 border-r overflow-y-auto h-full">
				<AdminsList activeItem={activeItem} setActiveItem={setActiveItem} />
			</div>
			<div className="overflow-y-auto bg-white w-full">
				<AdminsDetailPanel admin={activeItem} />
			</div>
		</div>
	);
}
