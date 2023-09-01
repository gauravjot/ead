import Sidebar from "./dashboard/Sidebar";
import LoginBox from "./login/LoginBox";
import React from "react";

export default function Home() {
  const AdminContext = React.createContext<AdminType | null>(null)
  const [admin, setAdmin] = React.useState<AdminType | null>(null);
  const [isSearchActive, setIsSearchActive] = React.useState<boolean>(false);

  // sidebar
  const [activeMenu, setActiveMenu] = React.useState<"admins"|"users"|"items">("admins");

	return admin ? (
   <AdminContext.Provider value={admin}>
      <div className="flex">
        <div className="px-3 border-r fixed top-0 left-0 bottom-0">
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} setIsSearchActive={setIsSearchActive}/> 
        </div>
        <div className="flex-1">
        </div>
      </div>
    </AdminContext.Provider>
  ):(
		<div className="container max-w-5xl px-4 mx-auto py-6">
      <LoginBox setAdmin={setAdmin}/>
		</div>
	);
}
