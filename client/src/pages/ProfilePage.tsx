

export interface UserI {
  _id: string;
  email: string;
  password: string;
  role: 'traveller' | 'observer';
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const ProfilePage = () => {
  return (
    <div className="admin-dashboard">
      <h2>Welcome, XXXX</h2>
      <div className="dashboard-options">
        <h3>My Contacts</h3>
        <button></button>

      </div>


    </div>
  );
};

export default ProfilePage;
