export type UserType = {
	id: string;
	password: string;
	email: string;
	first_name: string;
	last_name: string;
	timezone: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
};

export type UserLoggedInType = {
	last_session: any;
	last_token_session: any;
	user: UserType;
};
