import { AdminContext } from "@/components/Home";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { AddItemType, addItem } from "@/services/item/add_item";
import { ErrorType } from "@/types/api";
import { ItemTypeType } from "@/types/item";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

export default function AddNewItem({setShowAddItemBox, itemType} : {setShowAddItemBox: Dispatch<SetStateAction<boolean>>, itemType: ItemTypeType}) {
  const adminContext = useContext(AdminContext);
	const queryClient = useQueryClient();
	const [reqError, setReqError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
  const mutation = useMutation({
		mutationFn: (payload: AddItemType) => {
			return addItem(adminContext.admin?.token, payload);
		},
		onSuccess: () => {
			setReqError(null);
			reset();
      setShowAddItemBox(false);
			queryClient.resetQueries(["items_" + itemType.id]);
		},
		onError: (error: AxiosError) => {
			if (error.response?.data["message"]) {
				const res = error.response.data as ErrorType;
				setReqError(res.message);
			} else {
        setReqError(error.message);
      }
		},
	});

  return (
		<div className="fixed inset-0 bg-black/10 z-10 flex place-items-center justify-center">   
      <div className="bg-white max-w-[60rem] w-full px-8 py-6 rounded-md shadow-md">
			  <div className="flex flex-row">
          <h1 className="text-2xl flex-1 font-bold tracking-tight">Add new item</h1>
          <div>
            <button
		  				className="ic-xl pt-1 border rounded-md hover:outline hover:outline-gray-200 hover:border-gray-400"
			  			onClick={() => {
				  			setShowAddItemBox(false);
					  	}}
						  title="Close"
				  	>
				  		<span className="ic ic-close"></span>
				  	</button>
          </div>
        </div>
        <form onSubmit={handleSubmit((d) => {
					let v = JSON.parse(JSON.stringify(d));
          let r = Object.create(null);
          r["name"] = v["name"];
          r["description"] = v["description"];
          delete v["name"];
          delete v["description"];
          let f: {n: string, v: string}[] = []
          for (const [key, value] of Object.entries(v)) {
            f.push({n: key as string, v: value as string})
          }
          r["value"] = f;
          r["item_type"] = itemType.id;
          mutation.mutate(r);
					})}>
          <fieldset>
            {reqError && <p className="text-red-700 my-4">{reqError.toString()}</p>}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-md font-medium text-gray-800">General Information</h2>
                <InputField 
                  inputType="text"
                  id="name"
                  label="Name"
                  register={register}
                  errors={errors}
                  isRequired={true}
                  maxLength={48}
                  width="full"
                />
                <InputField 
                  inputType="text"
                  id="description"
                  label="Description"
                  isRequired={true}
                  register={register}
                  errors={errors}
                  isTextarea={true}
                  textareaSize={6}
                  width="full"
                />
              </div>
              <div>
                <h2 className="text-md font-medium text-gray-800">Fields</h2>
                {itemType.template?.map((field) => {
                  return field.t !== "boolean" ? <InputField
                    key={field.n}
                    inputType={field.t as "number" | "text"}
                    id={field.n.replace(" ", "_")}
                    label={field.n}
                    register={register}
                    errors={errors}
                    isRequired={true}
                    width="full"
                  /> : <label key={field.n} htmlFor={field.n.replace(" ","_")} className="flex place-items-center w-full block mt-6 mb-4 text-bb text-gray-600 group cursor-pointer">
                      <span className="flex-1">{field.n}</span>
                      <input type="checkbox" id={field.n.replace(" ","_")} {...register(field.n.replace(" ","_"))}/>
                    </label>
                })}
              </div>
            </div>
            <div className="mt-6 flex gap-6 justify-center">
							<Button
								state="default"
								styleType="black"
								outline={true}
								size="base"
								children="Reset"
								type="reset"
								onClick={() => {
									reset();
								}}
							/>
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
								children="Add item"
								type="submit"
							/>
						</div>
          </fieldset>
        </form>
      </div>
		</div>
	);
}
