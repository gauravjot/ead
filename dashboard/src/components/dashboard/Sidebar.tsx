import { Dispatch, SetStateAction } from "react";

type menuType = "admins"|"users"|"items";

export default function Sidebar({activeMenu, setActiveMenu, setIsSearchActive} : {activeMenu: menuType, setActiveMenu: Dispatch<SetStateAction<menuType>>, setIsSearchActive: Dispatch<SetStateAction<boolean>>}) {
  return (
<>
          {/* sidebar */}
          <div className="text-center mt-6 mb-12"><span className="ic-lg ic-accent ic-edit"></span></div>
          <div className="flex flex-col gap-4">
            <button className="px-3 py-2.5 leading-[0] hover:outline outline-2 outline-gray-200 rounded-md focus:outline" onClick={()=> {setIsSearchActive(true)}}><span className="ic-lg ic-gray-75 ic-search"></span></button>
          
            <button className={(activeMenu === "admins" ? "bg-dodger-100/80 outline-dodger-500" : "outline-gray-200") + " hover:outline outline-2 px-3 py-2.5 leading-[0] rounded-md"} onClick={()=>{if (activeMenu !== "admins") {setActiveMenu("admins")}}}><span className={(activeMenu === "admins" ? "ic-accent" : "ic-gray-75") + " ic-lg ic-admins"}></span></button>
      <button className={(activeMenu === "users" ? "bg-dodger-100/80 outline-dodger-500" : "outline-gray-200") + " hover:outline outline-2 px-3 py-2.5 leading-[0] rounded-md"} onClick={()=>{if (activeMenu !== "users") {setActiveMenu("users")}}}><span className={(activeMenu === "users" ? "ic-accent" : "ic-gray-75") + " ic-lg ic-users"}></span></button>
      <button className={(activeMenu === "items" ? "bg-dodger-100/80 outline-dodger-500" : "outline-gray-200") + " hover:outline outline-2 px-3 py-2.5 leading-[0] rounded-md"} onClick={()=>{if (activeMenu !== "items") {setActiveMenu("items")}}}><span className={(activeMenu === "items" ? "ic-accent" : "ic-gray-75") + " ic-lg ic-items"}></span></button>  
      </div>
      </>
  );
}
