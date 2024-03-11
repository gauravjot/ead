export type UserType = {
	id: string;
	name: string;
	role: string;
	email: string;
	phone: string;
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
