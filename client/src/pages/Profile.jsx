import React, {useState} from 'react';

const Profile = ({ user }) => {
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
    </div>
  );
};

export default Profile;