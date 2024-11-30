import { useState } from "react";
import Navbar from "../../components/Navbar";
import '../../styles/ProfilePage.css'
import SettingsComponent from "./settingsComponent";


export interface UserI {
  _id: string;
  email: string;
  password: string;
  role: 'traveller' | 'observer';
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const ProfilePage = () => {
  const [ viewOption, setViewOption] = useState('');

  function handleProfileComponent (event: React.MouseEvent<HTMLButtonElement>) {
    const value = event.currentTarget.value;
    setViewOption(value)
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="side-panel"><ul className="options-list">
          <li><button name='settings' value='settings' onClick={handleProfileComponent} >Settings</button></li>
          <li><button name='activity' value='activity' onClick={handleProfileComponent} >My Activity</button></li>
          <li><button name='contacts' value='contacts' onClick={handleProfileComponent} >Manage Contacts</button></li>
          <li><button name='help' value='help' onClick={handleProfileComponent} >Help</button></li>
          </ul></div>
        <div className="main-panel">
          Welcome, XXX
          {viewOption === 'settings' && <SettingsComponent />}
          {viewOption === 'activity' && <div>My Activity Component</div>}
          {viewOption === 'help' && <div>Help Component</div>}
          {viewOption === 'contacts' && <div>Contacts Component</div>}
          {!viewOption && <div>Select an option to begin!</div>}
        </div>

</div>

    </>
  );
};

export default ProfilePage;
