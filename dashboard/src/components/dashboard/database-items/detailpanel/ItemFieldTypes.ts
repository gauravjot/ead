export const FIELDS = [
	{
		type: "admin",
		name: "Admin",
		inputMethod: "select",
	},
	{
		type: "boolean",
		name: "Boolean",
		inputMethod: "checkbox",
	},
	{
		type: "client",
		name: "Client",
		inputMethod: "select",
	},
	{
		type: "currency",
		name: "Currency",
		extra: {
			type: "text",
			name: "Symbol (USD$, CAD$ etc.)",
		},
		inputMethod: "decimal",
	},
	{
		type: "db_item_type",
		name: "Database Item Type",
		inputMethod: "select",
		extra: {
			type: "select",
			name: "Choose a database item type",
		},
	},
	{
		type: "date",
		name: "Date",
		inputMethod: "date",
	},
	{
		type: "datetime",
		name: "Date and Time",
		inputMethod: "datetime",
	},
	{
		type: "decimal",
		name: "Decimal",
		inputMethod: "decimal",
	},
	{
		type: "email",
		name: "Email",
		inputMethod: "email",
	},
	{
		type: "multiple",
		name: "Multiple",
		extra: {
			type: "text",
			name: "List options separated by comma",
		},
		inputMethod: "select",
	},
	{
		type: "number",
		name: "Number",
		inputMethod: "number",
	},
	{
		type: "longtext",
		name: "Paragraph",
		inputMethod: "textarea",
	},
	{
		type: "phone",
		name: "Phone",
		inputMethod: "number",
	},
	{
		type: "text",
		name: "Short Text",
		inputMethod: "text",
	},
	{
		type: "time",
		name: "Time",
		inputMethod: "time",
	},
	{
		type: "url",
		name: "URL",
		inputMethod: "text",
	},
];
