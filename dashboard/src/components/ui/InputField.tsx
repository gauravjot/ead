import React, { InputHTMLAttributes } from "react";
import {
  FieldValues,
  UseFormRegister,
  // useForm, // don't need this import
} from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  inputType: "text"|"number"|"password"|"email";
  register: UseFormRegister<FieldValues>; // declare register props
}

export default function InputField({ id, inputType, label, register, ...rest }) {
  //const { register } = useForm(); // don't use a new `register`, use the one from props

  return (
    <div className="my-2 mx-px">
      <label className="block text-gray-600 text-sm py-1.5 mt-4" htmlFor={id}>{label}</label>
      <input className="block border px-3 py-1.5 rounded focus-visible:outline-3 focus-visible:outline-dodger-600 focus-visible:outline focus-visible:border-gray-300 disabled:bg-blue-50 disabled:text-gray-500" type={inputType} id={id} {...register(id)} {...rest} />

      {/* react-hook-form v7 */}
      {/* In v7 the register() function returns all the needed properties */}
      {/* see: https://dev.to/bluebill1049/what-s-coming-in-react-hook-form-version-7-4bfa */}
      {/* <input type="text" id={id} {...register(id)} {...rest} /> */}
    </div>
  );
};
