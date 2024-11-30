import { useEffect, useState } from "react";
import SettingsComponent from "./settingsComponent";
import { useLoginStatus } from "../../hooks/userLogin";
import RegisterComponent from "./RegisterComponent";
import HelpComponent from "./helpComponent";
import ContactsComponent from "./contactsComponent";
import { UserI } from "../../Types/User";
import LoginComponent from "./LoginComponent";


const ProfilePage = () => {
  const [ viewOption, setViewOption] = useState('');
  const [sessionUser, setSessionUser] = useState<null | UserI>(null);

  const { isAuthorized, userData } = useLoginStatus();

useEffect(()=>{
  if (isAuthorized === true) {
    setViewOption('settings')
  } else {
  if (isAuthorized) {
    const thisUser = userData;
    setSessionUser(thisUser)

  }}


}, [isAuthorized, userData])

  return (
    <>
      <div className="profile-page">
          My Profile{sessionUser? `, ${sessionUser.firstName}`: ''}!
          {viewOption === 'settings' && <SettingsComponent />}
          {!viewOption && <RegisterComponent setViewOption={setViewOption} />}
        {viewOption === 'login' && <div><LoginComponent setViewOption={setViewOption} /></div>}
          {viewOption === 'contacts' && <div><ContactsComponent/></div>}
          {viewOption === 'contacts' && <div><HelpComponent/></div>}



</div>

    </>
  );
};

export default ProfilePage;
