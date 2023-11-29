import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {postNoteToUser} from "@/services/user/post_note";
import {AdminType} from "@/types/admin";
import {NoteType, UserType} from "@/types/user";
import {AxiosError} from "axios";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {dateTimePretty} from "../../../../utils/datetime";
import DropDown from "@/components/ui/DropDown";
import {deleteUserNote} from "@/services/user/delete_note";
import {updateUserNote} from "@/services/user/update_note";
import DialogBox from "@/components/ui/Dialog";

export interface IUserNotesProps {
	user: UserType | null;
	admin: AdminType | null;
}

export default function UserNotes(props: IUserNotesProps) {
	const [reqError, setReqError] = useState<string | null>(null);
	const [deleteReqError, setDeleteReqError] = useState<string | null>(null);
	const [editNote, setEditNote] = useState<NoteType | null>(null);
	const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();

	// Add new note mutation
	const mutation = useMutation({
		mutationFn: (payload: {content: string; uid: string}) => {
			return postNoteToUser(props.admin?.token, payload);
		},
		onSuccess: () => {
			setReqError(null);
			reset();
			queryClient.resetQueries(["user_" + props.user?.id]);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setReqError);
		},
	});

	// Delete note mutation
	const mutationDelete = useMutation({
		mutationFn: (payload: {nid: number; uid: string}) => {
			return deleteUserNote(props.admin?.token, payload);
		},
		onSuccess: () => {
			setDeleteReqError(null);
			queryClient.resetQueries(["user_" + props.user?.id]);
			setDeleteDialog(null);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setDeleteReqError);
		},
	});

	return props.user && props.admin ? (
		<>
			{/* Delete note dialog */}
			{deleteDialog && (
				<DialogBox
					title="Delete note"
					message="Are you sure to delete this note? This action cannot be undone."
					onClose={() => setDeleteDialog(null)}
					error={deleteReqError}
					isDanger={true}
					onConfirm={() => {
						mutationDelete.mutate({
							nid: deleteDialog,
							uid: props.user?.id as string,
						});
					}}
					state={
						mutationDelete.isLoading ? "loading" : mutationDelete.isSuccess ? "done" : "default"
					}
				/>
			)}

			<div className="mx-8 my-4 max-w-[1400px]">
				{reqError && <p className="text-red-700 my-2">{reqError}</p>}
				<div className="my-8">
					<h3 className="text-md font-medium text-gray-800 mt-8">Post note</h3>
					<form
						onSubmit={handleSubmit((d) => {
							// Add new item
							const values = JSON.parse(JSON.stringify(d).replaceAll("an_", ""));
							if (props.user) mutation.mutate({content: values.content.trim(), uid: props.user.id});
						})}
					>
						<fieldset disabled={mutation.isLoading}>
							<InputField
								elementId="an_content"
								elementLabel="Content"
								elementInputType="text"
								elementIsTextarea={true}
								elementHookFormRegister={register}
								elementHookFormErrors={errors}
								elementWidth="full"
								elementIsRequired={true}
								elementTextareaRows={3}
								elementIsTextareaExpandable={true}
							/>
							<Button
								elementChildren="Add note"
								elementState={
									mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"
								}
								elementStyle="black"
								elementSize="base"
								elementType="submit"
							/>
						</fieldset>
					</form>
				</div>
				<div className="border-t my-4">
					{props.user && props.user.notes && props.user.notes?.length > 0 ? (
						<>
							<h3 className="text-md font-medium text-gray-800 mb-4 mt-8">Posted Notes</h3>
							<div>
								{props.user.notes
									.sort((a, b) => b.id - a.id)
									.map((note) => {
										return (
											<div key={note.id} className="rounded-md px-4 py-4 my-4 border">
												<div className="flex place-items-center">
													<div className="flex-1">
														<h4 className="text-bb">@{note.author}</h4>
														<div className="text-sm text-gray-500">{dateTimePretty(note.date)}</div>
													</div>
													{props.admin?.username === note.author ||
													props.admin?.username === "root" ? (
														<DropDown
															showExpandIcon={false}
															buttonStyle="icon_only"
															iconOnly={true}
															buttonIcon="ic-options-vertical"
															items={[
																{
																	icon: "ic-edit",
																	title: "Edit",
																	disabled: note.author !== props.admin?.username,
																	onClick: () => {
																		setEditNote(note);
																	},
																},
																{
																	icon: "ic-delete",
																	title: "Delete",
																	disabled: !(
																		props.admin?.username === "root" ||
																		note.author === props.admin?.username
																	),
																	onClick: () => {
																		setDeleteDialog(note.id);
																	},
																},
															]}
														/>
													) : (
														<></>
													)}
												</div>
												<p className="mt-2 text-bb text-gray-700">
													{note.content.split("\n").map((str) => (
														<>
															{str ? (
																<p className="mb-3 last:mb-0">{str}</p>
															) : (
																<div className="py-3" />
															)}
														</>
													))}
												</p>
											</div>
										);
									})}
							</div>
							<div className="text-center text-gray-400 my-8">End of notes</div>
						</>
					) : (
						<div className="text-center text-gray-400 my-8">No notes yet for this user</div>
					)}
				</div>
			</div>
			{/* Edit Note Dialog */}
			<div aria-hidden={editNote === null} className="aria-hidable absolute inset-0 z-50">
				{/* clicking empty space closes the box */}
				<div
					className="absolute inset-0 bg-black/10"
					onClick={() => {
						setEditNote(null);
					}}
				></div>
				{/* dialog box content */}
				<div className="bg-white shadow-xl px-4 py-6 sm:px-8 sm:py-12 relative z-20">
					<div className="flex container mx-auto">
						<h1 className="text-2xl flex-1 font-bold tracking-tight mb-3 xl:min-w-[45rem]">
							Update note
						</h1>
						<div>
							<button
								className="ic-xl pt-1 border rounded-md hover:outline hover:outline-gray-200 hover:border-gray-400"
								onClick={() => {
									setEditNote(null);
								}}
								title="Close"
							>
								<span className="ic ic-close"></span>
							</button>
						</div>
					</div>
					<div className="container mx-auto">
						<EditNote note={editNote} token={props.admin?.token} uid={props.user?.id} />
					</div>
				</div>
			</div>
		</>
	) : (
		<></>
	);
}

function EditNote({note, token, uid}: {note: NoteType | null; token: string; uid: string}) {
	const [reqError, setReqError] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();

	// Edit note mutation
	const mutation = useMutation({
		mutationFn: (payload: {content: string; nid: number}) => {
			return updateUserNote(token, {
				content: payload.content.trim(),
				nid: payload.nid,
				uid: uid,
			});
		},
		onSuccess: () => {
			setReqError(null);
			mutation.reset();
			reset();
			queryClient.resetQueries(["user_" + uid]);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setReqError);
		},
	});

	return (
		<>
			<form
				onSubmit={handleSubmit((d) => {
					const values = JSON.parse(JSON.stringify(d).replaceAll("un_", ""));
					if (note)
						mutation.mutate({
							content: values.content,
							nid: note.id,
						});
				})}
			>
				{reqError && <p className="text-red-700 my-2">{reqError}</p>}
				<fieldset disabled={mutation.isLoading}>
					<InputField
						elementHookFormRegister={register}
						elementId="un_content"
						elementLabel="Content"
						elementInputType="text"
						elementIsTextarea={true}
						elementHookFormErrors={errors}
						elementWidth="full"
						elementIsRequired={true}
						elementTextareaRows={3}
						defaultValue={note?.content}
						elementIsTextareaExpandable={true}
					/>
					<div className="mt-6 flex gap-6 justify-center">
						<Button
							elementState={
								mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"
							}
							elementStyle="black"
							elementSize="base"
							elementChildren="Update Note"
							elementType="submit"
						/>
					</div>
				</fieldset>
			</form>
		</>
	);
}
