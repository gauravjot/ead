import InputField from "@/components/ui/InputField";
import Spinner from "@/components/ui/Spinner";
import {getItem} from "@/services/item/get_item";
import {ItemFieldValueType} from "@/types/item";
import {useForm} from "react-hook-form";
import {Dispatch, SetStateAction, useState} from "react";
import {useQuery} from "react-query";
import Button from "@/components/ui/Button";

export default function ViewItem({
	token,
	id,
	setShowItemWithId,
	template,
}: {
	token: string;
	id: number | string;
	setShowItemWithId: Dispatch<SetStateAction<string | number | null>>;
	template: {n: string; t: string}[] | null;
}) {
	const item_query = useQuery(["item_info_" + id.toString()], () => getItem(token, id));
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm();
	const [isReadOnly, setIsReadOnly] = useState<boolean>(true);

	return (
		<div className="fixed inset-0 z-10">
			<div className="absolute bg-black/10 inset-0"></div>
			<div className="overflow-y-auto max-h-screen min-h-[500px] shadow bg-white px-6 py-10 relative z-10">
				<div className="container mx-auto">
					<div className="flex">
						<h1 className="text-2xl flex-1 font-bold tracking-tight">Item Details</h1>
						<Button
							elementType="button"
							elementState="default"
							elementStyle="border_opaque"
							elementIcon="close"
							elementChildren=""
							elementSize="small"
							onClick={() => {
								setShowItemWithId(null);
							}}
						/>
					</div>
					{item_query.isLoading ? (
						<div className="flex justify-center my-24">
							<Spinner size="lg" color="accent" />
						</div>
					) : item_query.isError ? (
						<div className="text-lg flex place-items-center justify-center my-12 text-gray-600 flex-col gap-2">
							<span className="ic-xl ic-close ic-gray-25"></span>
							<span>Unable to fetch item data.</span>
						</div>
					) : item_query.isSuccess && item_query.data ? (
						<div className="grid grid-cols-2 pt-8 gap-24 xl:gap-48">
							<form
								className="col-span-1"
								onSubmit={handleSubmit((d) => {
									console.log(d);
								})}
							>
								<div className="">
									<h2 className="font-medium mb-3">General Information</h2>
									<InputField
										elementId="name"
										elementLabel="Name"
										elementInputType="text"
										elementWidth="full"
										elementIsReadOnly={isReadOnly}
										elementHookFormRegister={register}
										elementHookFormErrors={errors}
										defaultValue={item_query.data.data.name}
									/>
								</div>
								<div className="mt-10">
									<h2 className="font-medium mb-3">Field Information</h2>
									{template?.map((obj) => {
										console.log("Field", obj.n)
										const val = item_query.data.data.value.filter(
											(row: {n: string; v: string}) => row.n === obj.n.replace(" ","_")
										);
										console.log("Field2", item_query.data.data.value)
										return obj.t !== "boolean" ? (
											<InputField
												key={obj.n + "_c"}
												elementId={obj.n + "_c"}
												elementLabel={obj.n}
												elementWidth="full"
												elementIsReadOnly={isReadOnly}
												elementInputType={obj.t as ItemFieldValueType}
												elementHookFormRegister={register}
												elementHookFormErrors={errors}
												defaultValue={val.length > 0 ? val[0].v : ""}
											/>
										) : (
											<span key={obj.n + "_c"}>Boolean field</span>
										);
									})}
								</div>
								<div className="mt-10">
									{!isReadOnly && (
										<Button
											elementState="default"
											elementChildren="Apply Changes"
											elementType="submit"
											elementStyle="black"
										/>
									)}
								</div>
								<div className="flex gap-2 mt-6 text-gray-500">
									<input
										type="checkbox"
										id="enable-edit"
										onChange={(e) => {
											setIsReadOnly(!e.currentTarget.checked);
										}}
									/>
									<label htmlFor="enable-edit">Enable editing</label>
								</div>
							</form>
							{/* allocation current */}
							<div className="col-span-1">
								<h2 className="font-medium mb-4">Allocation</h2>
								<div className="">Peter Parker</div>
								<div className="text-gray-600 text-md">Supervisor</div>
								<div className="flex gap-6 text-gray-600 text-md mb-4">
									<span>Email: abc@example.com</span>
									<span>Phone: +1 (603)-123-4567</span>
								</div>
								<div className="font-medium text-bb mb-1">Done by</div>
								<div className="text-gray-600 text-md">Admino Namegen</div>
								<div className="flex gap-6 text-gray-600 text-md mb-4">May 12, 2023</div>
								<Button
									elementChildren="Move allocation"
									elementStyle="primary"
									elementInvert={true}
									elementState="default"
									elementType="button"
									elementSize="small"
								/>
								{/* allocation history */}
								{/* accordion list */}
								<h2 className="font-medium mt-10 mb-4">History</h2>
								<div className="pb-2 pt-3 px-4 border-b bg-gray-100">
									<div className="font-medium leading-5">
										Peter Parker{" - "}
										<span className="text-gray-600 text-sm leading-5">Supervisor</span>
									</div>

									<div className="text-sm text-gray-600 leading-5">
										July 15, 2021 to February 12, 2023
									</div>
								</div>
							</div>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}
