interface Props {
	size: "sm" | "md" | "lg" | "xl";
	color: "white" | "black" | "gray" | "accent" | "danger";
}

export default function Spinner(props: Props) {
	const styles = "spinner spinner-" + props.size + " spinner-" + props.color;

	return <span className={styles}></span>;
}
