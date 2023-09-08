import { AdminContext } from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { AddAdminType, addAdmin } from "@/services/admins/add_admin";
import { ErrorType } from "@/types/api";
import { AxiosError } from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

export default function AddNewAdmin(){
  const adminContext = useContext(AdminContext);
  const {register, handleSubmit} = useForm();
  const onSubmit = (d:any) => {
    mutation.mutate(d)
  }


	const mutation = useMutation({
		mutationFn: (payload: AddAdminType) => {
      return addAdmin(adminContext.admin?.token, payload);
		},
		onSuccess: (data) => {
      console.log(data)
		},
		onError: (error: AxiosError) => {
			if (error.response) {
				const res = error.response.data as ErrorType;
			} else {
			}
		},
	});
  
  return (
  <div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
          <InputField id="full_name" inputType="text" register={register} label="Full Name"/>
        
          <InputField id="title" inputType="text" register={register} label="Job Title"/>     
          <InputField id="username" inputType="text" register={register} label="Username"/>
          <InputField id="password" inputType="password" register={register} label="Password"/> 
          <InputField id="confirm_password" inputType="password" register={register} label="Confirm Password"/>
         	<div className="mt-6">
							<Button
								state={
									mutation.isLoading
										? "loading"
										: mutation.isSuccess
										? "done"
										: "default"
								}
								styleType="black"
								size="base"
								children="Add user"
								type="submit"
							/>
						</div> 
        </fieldset>
      </form>
    </div>
  );
}
