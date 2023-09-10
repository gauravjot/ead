export interface AdminType extends AdminEntryType {
	token: string;
}

export type AdminEntryType = {
	full_name: string;
	username: string;
	title: string;
	active: boolean;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
};
