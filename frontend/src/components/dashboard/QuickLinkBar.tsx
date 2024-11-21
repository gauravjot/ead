import {useContext} from "react";
import DropDown, {DropDownItemType} from "../ui/DropDown";
import {doLogout} from "@/services/auth/logout";
import {UserContext} from "@/App";
import {useNavigate} from "react-router-dom";

const buttonStyle =
	"inline-block hover:no-underline p-2.5 mx-2 text-sm text-gray-700 hover:bg-gray-200";

export default function QuickLinkBar() {
	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	console.log(userContext.user);

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
				doLogout().then(() => {
					userContext.setUser(null);
					navigate("/");
				});
			},
		},
	];

	return (
		<div className="w-full bg-[#f4f4f5] flex gap-4 border-b px-6 place-items-center sticky z-10">
			<div className="flex flex-1">
				<div className="flex-1 flex place-items-center">
					<span className="text-sm text-gray-500">Quick Pins</span>
				</div>
				<div>
					<a
						rel="noreferrer"
						target="_blank"
						href="https://github.com/gauravjot/employee-access-info"
						className={buttonStyle}
					>
						Github
					</a>
				</div>
			</div>
			<DropDown
				items={adminDropDownMenu}
				showExpandIcon={true}
				buttonIcon="ic-person"
				buttonText={`${userContext.user?.first_name} ${userContext.user?.last_name}`}
			/>
		</div>
	);
}
