import { useEffect, useState } from "react";
import SettingsComponent from "./settingsComponent";
import { useLoginStatus } from "../../hooks/userLogin";
import RegisterComponent from "./RegisterComponent";
import HelpComponent from "./helpComponent";
import ContactsComponent from "./contactsComponent";
import { UserI } from "../../Types/User";


const ProfilePage = () => {
  const [ viewOption, setViewOption] = useState('');
  const [sessionUser, setSessionUser] = useState<null | UserI>(null);
  const { isAuthorized, userData } = useLoginStatus();

useEffect(()=>{
  if (isAuthorized === false) {
    setViewOption('register')
  } else {
  if (userData) {
    const thisUser = userData;
    setSessionUser(thisUser)

  }}


}, [isAuthorized, userData])

  return (
    <>
      <div className="profile-page">
          Welcome{sessionUser? `, ${sessionUser.firstName}`: ''}!
          {viewOption === 'settings' && <SettingsComponent />}
          {viewOption === 'register' && <RegisterComponent/>}
          {viewOption === 'help' && <div><HelpComponent/></div>}
          {viewOption === 'contacts' && <div><ContactsComponent/></div>}
          {!viewOption && <div>Select an option to begin!</div>}


</div>

    </>
  );
};

export default ProfilePage;
