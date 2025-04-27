import {UserContext} from "@/App";
import {ArrowRight} from "lucide-react";
import {useContext} from "react";
import {useDocTheme} from "use-doc-theme";
import logo from "@/assets/full_logo.svg";
import Spinner from "@/components/custom-ui/Spinner";

export function TopBar() {
	const theme = useDocTheme();
	const userContext = useContext(UserContext);

	return (
		<nav className="z-50 w-full sticky flex flex-row h-16 place-items-center gap-6">
			<div className="h-8">
				<img src={logo} alt="Logo" className="h-full" />
			</div>
			<div className="flex-1"></div>
			<div className="flex place-items-center gap-6">
				<div
					className="darkmode-toggle"
					onClick={() => {
						theme.toggle();
					}}
				>
					<button></button>
				</div>
				<div className="w-px h-8 bg-foreground/10"></div>
				{userContext.isLoading ? (
					<Spinner size="sm" color="accent" />
				) : userContext.user ? (
					<a href="/dashboard" className="leading-4 hover:no-underline text-foreground group flex gap-2 place-items-center">
						<span>
							<b>Go to Dashboard</b>
							<br />
							<small className="text-secondary-foreground">Welcome, {userContext.user.first_name}</small>
						</span>
						<ArrowRight
							size={24}
							color={theme.isDarkMode ? "#fff" : "#000"}
							className="group-hover:ms-1 group-hover:me-0 me-1 transition-all ease-in-out"
						/>
					</a>
				) : (
					<a
						href="http://localhost:8000/auth/?redirect=http://localhost:5173"
						className="px-2 py-1 font-semibold bg-accent text-white rounded-lg hover:no-underline inline-block"
					>
						Sign In
					</a>
				)}
			</div>
		</nav>
	);
}
