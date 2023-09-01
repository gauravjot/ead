import React from "react";

interface Props {
  children?: React.ReactNode;
  onClick: () => void;
}

export default function Button(props: Props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
