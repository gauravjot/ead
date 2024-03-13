export type UserType = {
	id: string;
	name: string;
	title: string | null;
	email: string | null;
	phone: string | null;
	is_admin: string | null;
	created_at: string;
	created_by: string;
	updated_at: string;
	updated_by: string;
};

export type NoteType = {
	id: number;
	user: string;
	note: string;
	created_at: string;
	created_by: string;
	updated_at: string;
	updated_by: string;
};
