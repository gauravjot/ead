import QuickLinkBar from "@/components/dashboard/QuickLinkBar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
	return (
		<div className="flex h-screen overflow-hidden">
			<div className="px-3 border-r h-screen bg-white">
				<Sidebar activeMenu={"dashboard"} />
			</div>
			<div className="flex-1 h-full overflow-hidden flex flex-col">
				{/* main content starts */}
				<QuickLinkBar />
			</div>
		</div>
	);
}
