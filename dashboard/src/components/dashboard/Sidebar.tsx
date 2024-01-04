import {Dispatch, SetStateAction} from "react";

type menuType = "admins" | "clients" | "items" | "invoices";

const menu: {icon: string; type: menuType; title: string; divider?: boolean}[] = [
	{
		divider: true,
		icon: "ic-admins",
		title: "Admins",
		type: "admins",
	},
	{
		icon: "ic-database",
		title: "DB",
		type: "items",
	},
	{
		divider: true,
		icon: "ic-users",
		title: "Clients",
		type: "clients",
	},
	{
		icon: "ic-invoice",
		title: "Invoices",
		type: "invoices",
	},
];

export default function Sidebar({
	activeMenu,
	setActiveMenu,
	setIsSearchActive,
}: {
	activeMenu: menuType;
	setActiveMenu: Dispatch<SetStateAction<menuType>>;
	setIsSearchActive: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<>
			{/* sidebar */}
			<div className="text-center mt-6 mb-12">
				<span className="ic-lg ic-accent ic-edit"></span>
			</div>
			<div className="flex flex-col gap-3">
				<button
					className="px-3 py-2.5 leading-[0] hover:outline outline-2 outline-gray-200 rounded-md focus:outline"
					onClick={() => {
						setIsSearchActive(true);
					}}
				>
					<span className="ic-lg ic-gray-50 ic-search"></span>
				</button>
				{menu.map((item) => {
					return (
						<>
							{"divider" in item && <div className="h-[2px] bg-gray-200"></div>}
							<button
								key={item.type}
								className={
									(activeMenu === item.type
										? "bg-dodger-100/80 outline-dodger-500"
										: "outline-gray-200") +
									" hover:outline aspect-square overflow-hidden outline-2 w-14 leading-[0] rounded-md"
								}
								onClick={() => {
									if (activeMenu !== item.type) {
										setActiveMenu(item.type);
									}
								}}
								title={item.title}
							>
								<span
									className={
										(activeMenu === item.type ? "ic-accent" : "ic-gray-50") + " ic-lg " + item.icon
									}
								></span>
								<br />
								<small
									className={
										(activeMenu === item.type ? "text-dodger-700 font-medium" : "text-gray-600") +
										" tracking-tight text-xs pt-0.5 block"
									}
								>
									{item.title}
								</small>
							</button>
						</>
					);
				})}
			</div>
		</>
	);
}
