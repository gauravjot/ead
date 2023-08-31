import { doServerSetup } from "@/services/auth/server_setup";
import React from "react";
import { useMutation } from "react-query";
import {AxiosError} from "axios";
import {ErrorType} from "@/types/api";
import Spinner from "@/components/utils/Spinner";

export default function ServerSetup() {
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const mutation = useMutation({
    mutationFn: () => {
      return doServerSetup(password)
    },
    onSuccess: () => {
      console.log("Logged in")
    },
    onError: (error: AxiosError)=> {
      if (error.response) {
        let res = error.response.data as ErrorType;
        setError(`${res.message} Error code ${res.code}.`)
      } else {
        setError("Error getting correct response from server.")
      }
    }
  });

  function setup() {
    mutation.mutate();
  }

  return <div className="bg-white rounded-md px-12 py-24 shadow-lg grid grid-cols-2 gap-12">
    <div className="my-4"><h1 className="text-3xl font-bold tracking-tighter">Welcome</h1>
    <p className="text-gray-700 leading-6 mt-7"><span>Few things to note</span><ul className="ml-4 block mt-3 list-disc"><li>The username for administrative account is <span className="italic">root</span> and cannot be changed.</li><li className="my-2">You can change password of root account later.</li><li>Root account cannot be disabled.</li></ul></p>
    </div>
    <div>{error.length > 0 && <p className="mt-5 text-red-700">{error}</p>}
    <form onSubmit={(e: React.FormEvent)=>{
      e.preventDefault();
      if (password.length < 1) {
        setError("Please enter a strong password.")
      } else if (password.length < 8) {
        setError("Password needs to be atleast 8 characters.")
      }else {
        setup();
      }
    }}>
    <fieldset disabled={mutation.isLoading || mutation.isSuccess}>
      <label className="block text-gray-600 text-sm py-1.5 mt-4" htmlFor="username">Username</label>
      <input className="block w-full border px-3 py-1.5 rounded focus-visible:outline-3 focus-visible:outline-gray-200 focus-visible:outline focus-visible:border-gray-300 disabled:bg-blue-50 disabled:text-gray-500" type="text" id="username" name="username" value="root" disabled={true}/>
      <label className="block text-gray-600 text-sm py-1.5 mt-2" htmlFor="password">Password</label> 
      <input className={"block w-full border px-3 py-1.5 rounded focus-visible:outline-3 focus-visible:outline-gray-200 focus-visible:outline focus-visible:border-gray-300" + (error.length > 0 && password.length < 1 ? " border-red-500/70": "")} type="password" id="password" name="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPassword(e.target.value)}}/>
      <button className="block w-full leading-[1] bg-gray-900 text-white font-bold mt-6 py-2 rounded focus:outline focus:outline-3 focus:outline-gray-300 disabled:bg-gray-700">{mutation.isLoading ? <Spinner /> : <span className="inline-block py-[0.36rem]">Continue</span>}</button>
    </fieldset>
    </form>
  </div>
  </div>
}
