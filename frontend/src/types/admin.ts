import {UserType} from "./user";

// username=row[0],
// active=row[1],
// created_at=row[2],
// updated_at=row[3],
// created_by=row[4],
// updated_by=row[5],
// user_id=row[6],
// user_name=row[7],
// user_email=row[8],
// user_phone=row[9],
// user_created_at=row[10],
// user_updated_at=row[11],
// user_created_by=row[12],
// user_updated_by=row[13],
// user_title=row[14],

export type AdminEntryType = {
	username: string;
	active: boolean;
	created_at: string;
	updated_at: string;
	created_by: string | null;
	updated_by: string | null;
	user_id: string | null;
	user_name: string | null;
	user_email: string | null;
	user_phone: string | null;
	user_created_at: string | null;
	user_updated_at: string | null;
	user_created_by: string | null;
	user_updated_by: string | null;
	user_title: string | null;
};

export type LoggedInAdminType = {
	admin: {
		username: string;
		active: boolean;
		created_at: string;
		updated_at: string;
		created_by: string | null;
		updated_by: string | null;
		quick_links: string[];
	};
	user: UserType | null;
	session_id: string | number;
};
