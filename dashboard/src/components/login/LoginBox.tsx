import { doLogin } from "@/services/auth/login";
import React from "react";
import { useMutation } from "react-query";
import {AxiosError} from "axios";
import {ErrorType} from "@/types/api";
import Spinner from "@/components/utils/Spinner";

export default function LoginBox() {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const mutation = useMutation({
    mutationFn: () => {
      return doLogin(username, password)
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

  function login() {
    mutation.mutate();
  }

  return <div className="bg-white rounded-md p-6 shadow-lg max-w-[26rem]">
    <h1 className="text-3xl font-bold tracking-tighter">Login</h1>
    {error.length > 0 && <p className="mt-4 text-red-700">{error}</p>}
    <form onSubmit={(e: React.FormEvent)=>{
      e.preventDefault();
      if (username.length < 1 || password.length < 1) {
        setError("One or more fields are empty.")
      } else {
        login();
      }
    }}>
    <fieldset disabled={mutation.isLoading || mutation.isSuccess}>
      <label className="block text-gray-600 text-sm py-1.5 mt-2" htmlFor="username">Username</label>
      <input className={"block w-full border px-3 py-1.5 rounded focus-visible:outline-3 focus-visible:outline-gray-200 focus-visible:outline focus-visible:border-gray-300" + (error.length > 0 && username.length < 1 ? " border-red-500/70": "")} type="text" id="username" name="username" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setUsername(e.target.value)}}/>
      <label className="block text-gray-600 text-sm py-1.5 mt-2" htmlFor="password">Password</label> 
      <input className={"block w-full border px-3 py-1.5 rounded focus-visible:outline-3 focus-visible:outline-gray-200 focus-visible:outline focus-visible:border-gray-300" + (error.length > 0 && password.length < 1 ? " border-red-500/70": "")} type="password" id="password" name="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPassword(e.target.value)}}/>
      <button className="block w-full leading-[1] bg-gray-900 text-white font-bold mt-5 py-2 rounded focus:outline focus:outline-3 focus:outline-gray-300 disabled:bg-gray-700">{mutation.isLoading ? <Spinner /> : <span className="inline-block py-[0.36rem]">Continue</span>}</button>
    </fieldset>
    </form>
    <p className="mt-5 text-gray-700 text-[0.875rem]">If you forgot your credentials, please contact your administrator.</p>
  </div>
}
