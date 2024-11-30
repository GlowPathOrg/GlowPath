import { useEffect, useState } from "react";
import SettingsComponent from "./settingsComponent";
import { useLoginStatus } from "../../hooks/userLogin";
import RegisterComponent from "./RegisterComponent";
import HelpComponent from "./helpComponent";
import ContactsComponent from "./contactsComponent";

import LoginComponent from "./LoginComponent";


const ProfilePage = () => {
  const [ viewOption, setViewOption] = useState('');
  const { isAuthorized, userData } = useLoginStatus();

useEffect(()=>{
  if (isAuthorized === true) {
    setViewOption('settings');
  }

}, [isAuthorized, userData]);

  const handleLogout = () => {

    setViewOption('login')
  };

  console.log('userdata', userData)
  return (
    <>
      <div className="profile-page">
        {isAuthorized===true ? (<button onClick={handleLogout}>Log Out</button>): <div></div>}
    Welcome! {userData?.firstName}
          {viewOption === 'settings' && <SettingsComponent />}
          {!viewOption && <RegisterComponent setViewOption={setViewOption} />}
        {viewOption === 'login' && <div><LoginComponent setViewOption={setViewOption} /></div>}
          {viewOption === 'contacts' && <div><ContactsComponent/></div>}
          {viewOption === 'help' && <div><HelpComponent/></div>}



</div>

    </>
  );
};

export default ProfilePage;
