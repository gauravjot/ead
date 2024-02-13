export type UserType = {
	id: string;
	name: string;
	role: string;
	email: string;
	phone: string;
	notes: NoteType[] | null;
	created_at: string;
	created_by: string;
	updated_at: string;
	updated_by: string;
};

export type NoteType = {
	id: number;
	content: string;
	date: string;
	author: string;
};
