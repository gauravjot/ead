interface Props {
  size: "sm" | "md" | "lg" | "xl";
  color: "white" | "black" | "accent";
}

export default function Spinner(props: Props) {
  let styles = "spinner spinner-" + props.size + " spinner-"+props.color;

  return <span className={styles}></span>
}
