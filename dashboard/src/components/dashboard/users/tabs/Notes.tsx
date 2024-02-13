import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import {handleAxiosError} from "@/components/utils/HandleAxiosError";
import {AdminType} from "@/types/admin";
import {AxiosError} from "axios";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {dateTimePretty} from "@/utils/datetime";
import DropDown from "@/components/ui/DropDown";
import DialogBox from "@/components/ui/Dialog";
import {NoteType, UserType} from "@/types/user";
import {postNote} from "@/services/user/post_note";
import {deleteNote} from "@/services/user/delete_note";
import {updateNote} from "@/services/user/update_note";
import {getUserNotes} from "@/services/user/get_notes";
import Spinner from "@/components/ui/Spinner";

export interface IUserNotesProps {
	user: UserType | null;
	admin: AdminType | null;
}

export default function Notes(props: IUserNotesProps) {
	const [reqError, setReqError] = useState<string | null>(null);
	const [deleteReqError, setDeleteReqError] = useState<string | null>(null);
	const [editNote, setEditNote] = useState<NoteType | null>(null);
	const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
	const notes = useQuery(["notes_" + props.user?.id], () =>
		getUserNotes(props.admin?.token, props.user?.id)
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();

	// Add new note mutation
	const mutation = useMutation({
		mutationFn: (payload: {content: string; uid: string}) => {
			return postNote(props.admin?.token, payload);
		},
		onSuccess: () => {
			setReqError(null);
			reset();
			notes.refetch();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setReqError);
		},
	});

	// Delete note mutation
	const mutationDelete = useMutation({
		mutationFn: (payload: {nid: number; uid: string}) => {
			return deleteNote(props.admin?.token, payload);
		},
		onSuccess: () => {
			setDeleteReqError(null);
			notes.refetch();
			setDeleteDialog(null);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setDeleteReqError);
		},
	});

	console.log("notes", notes);

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
					state={mutationDelete.isLoading ? "loading" : "default"}
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
								elementState={mutation.isLoading ? "loading" : "default"}
								elementStyle="black"
								elementSize="base"
								elementType="submit"
							/>
						</fieldset>
					</form>
				</div>
				<div className="border-t my-4">
					{notes.isSuccess && notes.data && notes.data.length > 0 ? (
						<>
							<h3 className="text-md font-medium text-gray-800 mb-4 mt-8">Posted Notes</h3>
							<div>
								{notes.data.map((note) => {
									return (
										<div
											key={note.id}
											className="rounded-md px-4 py-4 my-4 border hover:border-gray-400"
										>
											<div className="flex place-items-center">
												<div className="flex-1">
													<h4 className="text-bb">@{note.created_by}</h4>
													<div className="text-sm text-gray-500">
														{dateTimePretty(note.created_at)}
													</div>
												</div>
												{props.admin?.username === note.created_by ||
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
																disabled: note.created_by !== props.admin?.username,
																onClick: () => {
																	setEditNote(note);
																},
															},
															{
																icon: "ic-delete",
																title: "Delete",
																disabled: !(
																	props.admin?.username === "root" ||
																	note.created_by === props.admin?.username
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
												{note.note.split("\n").map((str) => (
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
					) : notes.isSuccess && notes.data.length < 1 ? (
						<div className="text-center text-gray-400 my-8">No notes yet for this user</div>
					) : notes.isError ? (
						<div className="text-center text-gray-400 my-8">Error requesting notes</div>
					) : notes.isLoading ? (
						<div className="flex place-items-center justify-center text-gray-400 my-8">
							<Spinner color="gray" size="md" />
						</div>
					) : (
						<></>
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
					{editNote && (
						<div className="container mx-auto">
							<EditNote
								note={editNote}
								closeFn={() => setEditNote(null)}
								token={props.admin?.token}
								uid={props.user?.id}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	) : (
		<></>
	);
}

function EditNote({
	note,
	token,
	uid,
	closeFn,
}: {
	note: NoteType | null;
	token: string;
	uid: string;
	closeFn: () => void;
}) {
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
			return updateNote(token, {
				content: payload.content.trim(),
				nid: payload.nid,
				uid: uid,
			});
		},
		onSuccess: () => {
			setReqError(null);
			mutation.reset();
			reset();
			queryClient.invalidateQueries(["notes_" + uid]);
			closeFn();
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
						defaultValue={note?.note}
						elementIsTextareaExpandable={true}
					/>
					<div className="mt-6 flex gap-6 justify-center">
						<Button
							elementState={mutation.isLoading ? "loading" : "default"}
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
