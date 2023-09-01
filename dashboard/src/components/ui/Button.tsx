import React from "react";
import Spinner from "@/components/ui/Spinner";

interface Props {
  children?: React.ReactNode;
  onClick?: () => void;
  styleType: "primary" | "primary-full-w" | "outline" | "outline-full-w";
  state: "default" | "loading" | "done";
  type: "button" | "submit" | "reset";
}

const style = {
  "primary": "leading-[1] bg-gray-900 text-white font-bold mt-6 py-2 px-5 rounded focus:outline focus:outline-3 focus:outline-gray-300 disabled:bg-gray-700",
  "primary-full-w": "block w-full leading-[1] bg-gray-900 text-white font-bold mt-6 py-2 rounded focus:outline focus:outline-3 focus:outline-gray-300 disabled:bg-gray-700",
  "outline": "leading-[1] bg-transparent border border-gray-600 text-gray-700 font-bold mt-6 py-2 px-5 rounded hover:bg-gray-100 focus:outline focus:outline-3 focus:outline-gray-300 disabled:bg-gray-100",
  "outline-full-w": "block w-full leading-[1] bg-transparent border border-gray-600 text-gray-700 font-bold mt-6 py-2 rounded hover:bg-gray-100 focus:outline focus:outline-3 focus:outline-gray-300 disabled:bg-gray-100"
}

export default function Button(props: Props) {
  return ( 
    <button 
      onClick={props.onClick} 
      className={style[props.styleType]}
    >
      {props.state === "default" ? 
        <span className="inline-block py-[0.36rem]">{props.children}</span> 
        : props.state === "loading" ? 
          <Spinner size="sm" color={props.styleType.includes("outline") ? "black" : "white"}/> 
        : <span className={"ic-lg ic-done " + (props.styleType.includes("outline") ? "ic-black" : "ic-white")}></span>
      }
    </button>);
}
