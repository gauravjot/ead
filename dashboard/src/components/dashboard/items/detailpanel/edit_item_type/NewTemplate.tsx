import Button from "@/components/ui/Button"
import InputField from "@/components/ui/InputField"
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewTemplate() {
  const [showNewField, setShowNewField] = useState<boolean>(false);
  const [newFieldType, setNewFieldType] = useState<string>();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
  return (
    <><Button
      type="button"
      styleType="black"
      outline={true}
      state="default"
      children="Add Field"
      aria-expanded={showNewField}
      onClick={()=>{
        setShowNewField(val => !val)
      }}
    />
      <div aria-hidden={!showNewField} className="aria-hidable">
        <form className="my-4"onSubmit={handleSubmit((d) => {
					})}>
          <fieldset>
            <div className="py-1.5 text-sm text-gray-600">Select type</div>
            <div className="flex gap-4 my-1 mb-2.5">
              <div>
                <input 
                  type="radio" 
                  id="text" 
                  name="field-type"
                  value="text"
                  onChange={(e)=>{
                    setNewFieldType(e.target.value);
                  }}
                />
                <label className="pl-2 cursor-pointer" for="text">Text</label>
              </div>
              <div>
                <input 
                  type="radio" 
                  id="number" 
                  name="field-type"
                  value="number"
                  onChange={(e)=>{
                    setNewFieldType(e.target.value);
                  }}
                />
                <label className="pl-2 cursor-pointer" for="number">Number</label>
              </div>
              <div>
                <input 
                  type="radio" 
                  id="boolean"
                  name="field-type"
                  value="boolean"
                  onChange={(e)=>{
                    setNewFieldType(e.target.value);
                  }}
                />
                <label className="pl-2 cursor-pointer" for="boolean">Boolean</label>
              </div>
            </div>
            {newFieldType &&
              <>
                <InputField 
                inputType="text"
                id="field-name"
                label="Field name"
                errors={errors}
                register={register}
                required={true}
                minLength={2}
                maxLength={24}
                />
                <div className="mt-6">
						    	<Button
					    			state={
					    					 "default"
					    			}
					    			styleType="black"
					    			size="base"
					    			children="Add field"
					    			type="submit"
				  			  />
						    </div>
              </>
            }
          </fieldset>
        </form>
      </div>
    </>
  );
}
