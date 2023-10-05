import { useContext } from "react";
import { AdminContext } from "../Home";
import DropDown, { DropDownItemType } from "../ui/DropDown";

const buttonStyle = "p-2.5 mx-2 text-sm text-gray-700 hover:bg-gray-200";

export function QuickLinkBar() {
	const adminContext = useContext(AdminContext);

	const adminDropDownMenu: DropDownItemType[] = [
		{
			title: "Account Settings",
			icon: "ic-settings",
			onClick: () => {
				return;
			},
		},
		{
			title: "Logout",
			icon: "ic-logout",
			onClick: () => {
				adminContext.setAdmin(null);
			},
		},
	];

	return (
		<div className="w-full flex border-b px-6 place-items-center sticky z-50">
			<div className="flex flex-1">
				<button className={buttonStyle}>Quick Tour</button>
				<button className={buttonStyle}>Statistics</button>
				<button className={buttonStyle}>Documentation</button>
			</div>
			<DropDown
				items={adminDropDownMenu}
				showExpandIcon={true}
				buttonIcon="ic-person"
				buttonText={adminContext.admin?.full_name}
			/>
		</div>
	);
}
