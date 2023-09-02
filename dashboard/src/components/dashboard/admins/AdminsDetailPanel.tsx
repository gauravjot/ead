import { AdminEntryType } from "@/types/admin";
import { dateTimePretty } from "../../../utils/datetime";
import Button from "@/components/ui/Button";
import { useContext } from "react";
import { AdminContext } from "@/components/Home";

export default function AdminsDetailPanel({
	admin,
}: {
	admin: AdminEntryType | undefined;
}) {
	const adminContext = useContext(AdminContext);

	return admin ? (
		<div className="px-8 py-8">
			<div className="flex p-4 gap-6 place-items-center">
				<div className="h-24 w-24 bg-gray-200 rounded-full flex place-items-center justify-center">
					{admin.full_name[0]}
				</div>
				<div>
					<h1 className="text-3xl tracking-tight">{admin.full_name}</h1>
					<div className="text-gray-600 mt-1">{admin.title}</div>
					<div className="text-gray-600 text-bb mt-px">
						Joined on {dateTimePretty(admin.created_at)}
					</div>
				</div>
			</div>
			<div className="mt-10">
				<h2 className="text-xl font-medium my-5 border-b pb-2">Administer</h2>
				<h3 className="text-md font-medium text-gray-800 mb-3">
					Change Password
				</h3>
				<Button
					state="default"
					styleType="black"
					size="base"
					outline={true}
					type="button"
					children="CHANGE PASSWORD"
					onClick={() => {
						return;
					}}
					disabled={
						adminContext &&
						adminContext.admin?.username !== "root" &&
						admin.username === "root"
					}
				/>
				<br />
				{adminContext &&
					adminContext.admin?.username !== "root" &&
					admin.username === "root" && (
						<p className="my-2 text-gray-700">
							You cannot change root password. Use root account instead.
						</p>
					)}
				<h3 className="text-md font-medium text-gray-800 mt-7">
					Disable Account
				</h3>
				<p className="mt-2 mb-4 text-gray-700 text-bb">
					Account can be enabled at a later date if required. Accounts cannot be
					deleted.
				</p>
				<Button
					state="default"
					styleType="danger"
					size="base"
					outline={true}
					type="button"
					children="DISABLE ACCOUNT"
					onClick={() => {
						return;
					}}
					disabled={admin.username === "root"}
				/>
				{admin.username === "root" && (
					<p className="my-2 text-gray-700 text-bb">
						Root account cannot be disabled.
					</p>
				)}
			</div>
			<div className="mt-10">
				<h2 className="text-xl font-medium border-b pb-2">Make changes</h2>
			</div>
		</div>
	) : (
		<></>
	);
}
