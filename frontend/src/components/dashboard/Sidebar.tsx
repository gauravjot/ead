import {useNavigate} from "react-router-dom";

type menuType = "admins" | "users" | "items";

const menu: {icon: string; type: menuType; title: string; divider?: boolean; path: string}[] = [
	{
		divider: true,
		icon: "ic-admins",
		title: "Admins",
		type: "admins",
		path: "/admins",
	},
	{
		icon: "ic-database",
		title: "DB",
		type: "items",
		path: "/items",
	},
	{
		divider: true,
		icon: "ic-users",
		title: "Users",
		type: "users",
		path: "/users",
	},
];

export default function Sidebar({activeMenu}: {activeMenu: menuType}) {
	const navigate = useNavigate();

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
						// TODO: Implement search
					}}
				>
					<span className="ic-lg ic-gray-50 ic-search"></span>
				</button>
				{menu.map((item) => {
					return (
						<div key={item.title}>
							{"divider" in item && <div className="h-[2px] bg-gray-200 mb-3"></div>}
							<button
								key={item.type}
								className={
									(activeMenu === item.type
										? "bg-dodger-100/80 outline-dodger-500"
										: "outline-gray-200") +
									" hover:outline aspect-square overflow-hidden outline-2 w-14 leading-[0] rounded-md"
								}
								onClick={() => navigate(activeMenu !== item.type ? item.path : "#")}
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
						</div>
					);
				})}
			</div>
		</>
	);
}
