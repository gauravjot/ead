import {getAdminActionLogs, getAdminLogs} from "@/services/admins/get_admin_logs";
import {useQuery} from "react-query";
import {dateTimePretty} from "../../../../utils/datetime";
import {AdminEntryType} from "@/types/admin";
import {parseLogString} from "@/utils/parseLogDetail";

export function LogsTab({admin}: {admin: AdminEntryType}) {
	const logsForQuery = useQuery(["admin_logs_for", admin.username], () =>
		getAdminLogs(admin.username)
	);
	const logsByQuery = useQuery(["admin_logs_by", admin.username], () =>
		getAdminActionLogs(admin.username)
	);

	return (
		<div className="mx-8 max-w-[1400px]">
			{/* change password */}
			<div className="my-8">
				<h3 className="text-md font-medium text-gray-800 my-4">Actioned on</h3>
				<table className="w-full my-6">
					<thead>
						<tr>
							<th className="px-2 align-top text-left text-bb font-medium pb-2 w-1/4">Time</th>
							<th className="px-2 align-top text-left text-bb font-medium pb-2 w-1/5">By</th>
							<th className="px-2 align-top text-left text-bb font-medium pb-2">Details</th>
						</tr>
					</thead>
					<tbody>
						{logsForQuery.isSuccess ? (
							logsForQuery.data.length > 0 ? (
								logsForQuery.data.map((log) => {
									return (
										<tr
											key={log.id}
											className="border-b last:border-none text-bb text-gray-500 hover:bg-gray-50"
										>
											<td className="px-2 py-2 align-top">{dateTimePretty(log.actioned_at)}</td>
											<td className="px-2 py-2 align-top">{log.actioned_by}</td>
											<td className="px-2 py-2 align-top">
												{parseLogString(log.action)["Changes"]}
											</td>
										</tr>
									);
								})
							) : (
								<tr className="text-bb text-gray-500">
									<td className="px-2 py-2 align-top">-</td>
									<td className="px-2 py-2 align-top">-</td>
									<td className="px-2 py-2 align-top">-</td>
								</tr>
							)
						) : (
							<></>
						)}
					</tbody>
				</table>
				<div className="border-t my-8"></div>
				<h3 className="text-md font-medium text-gray-800 my-4">Actioned by this account</h3>
				<table className="w-full my-6">
					<thead>
						<tr>
							<th className="px-2 align-top text-left text-bb font-medium pb-2 w-1/4">Time</th>
							<th className="px-2 align-top text-left text-bb font-medium pb-2 w-1/5">Resource</th>
							<th className="px-2 align-top text-left text-bb font-medium pb-2">Action taken</th>
						</tr>
					</thead>
					<tbody>
						{logsByQuery.isSuccess ? (
							logsByQuery.data.length > 0 ? (
								logsByQuery.data.map((log) => {
									return (
										<tr
											key={log.id}
											className="border-b last:border-none text-bb text-gray-500 hover:bg-gray-50"
										>
											<td className="px-2 py-2 align-top">{dateTimePretty(log.actioned_at)}</td>
											<td className="px-2 py-2 align-top">
												{log.action.split("] [")[0].substring(1)}
											</td>
											<td className="px-2 py-2 align-top">
												{parseLogString(log.action)["Changes"]}
											</td>
										</tr>
									);
								})
							) : (
								<tr className="text-bb text-gray-500">
									<td className="px-2 py-2 align-top">-</td>
									<td className="px-2 py-2 align-top">-</td>
									<td className="px-2 py-2 align-top">-</td>
								</tr>
							)
						) : (
							<></>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
