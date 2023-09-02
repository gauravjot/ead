import { Dispatch, SetStateAction } from "react";

type menuType = "admins" | "users" | "items";

const menu: { icon: string; type: menuType; title: string }[] = [
	{
		icon: "ic-admins",
		title: "Admins",
		type: "admins",
	},
	{
		icon: "ic-users",
		title: "Users",
		type: "users",
	},
	{
		icon: "ic-items",
		title: "Allocations",
		type: "items",
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
			<div className="flex flex-col gap-4">
				<button
					className="px-3 py-2.5 leading-[0] hover:outline outline-2 outline-gray-200 rounded-md focus:outline"
					onClick={() => {
						setIsSearchActive(true);
					}}
				>
					<span className="ic-lg ic-gray-75 ic-search"></span>
				</button>
				{menu.map((item) => {
					return (
						<button
							key={item.type}
							className={
								(activeMenu === item.type
									? "bg-dodger-100/80 outline-dodger-500"
									: "outline-gray-200") +
								" hover:outline outline-2 px-3 py-2.5 leading-[0] rounded-md"
							}
							onClick={() => {
								if (activeMenu !== item.type) {
									setActiveMenu(item.type);
								}
							}}
						>
							<span
								className={
									(activeMenu === item.type
										? "ic-accent"
										: "ic-gray-75") +
									" ic-lg " +
									item.icon
								}
							></span>
						</button>
					);
				})}
			</div>
		</>
	);
}
