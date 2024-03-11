/**
 * Max sizes -
 * name: 48,
 * description: any
 */
export type ItemTypeType = {
	id: number;
	name: string;
	description: string;
	template: CustomFieldType[] | null;
	created_at: string;
	created_by: string;
};

export type CustomFieldType = { n: string; t: string, dV?: string };

/**
 * Max sizes -
 * name: 48,
 * description: any
 */
export type ItemType = {
	id: number;
	name: string;
	description: string;
	value: { n: string; v: string }[] | null;
	active: boolean;
	item_type?: ItemTypeType;
};

export type AllocationType = {
	id: number;
	item?: ItemType;
	notes: string;
	assigned_at: string;
	assigned_by: string;
	assigned_to: string;
	returned_at: string;
	collected_by: string;
};

export type ItemFieldValueType = "text" | "email" | "password" | "number";
