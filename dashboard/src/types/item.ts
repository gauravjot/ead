/**
 * Max sizes -
 * name: 48,
 * description: any
 */
export type ItemTypeType = {
	id: number;
	name: string;
	description: string;
	template: { n: string; t: string }[] | null;
	created_at: string;
	created_by: string;
};

/**
 * Max sizes -
 * name: 48,
 * description: any
 */
export type ItemType = {
	id: number;
	name: string;
	description: string;
	value: { n: string; t: string; v: string }[] | null;
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
