
import React from 'react';
import {Navigate, Redirect} from 'react-router-dom';

const AdminGuard = ({ user , children }) => {
  const adminsList = process.env.REACT_APP_ADMINS_LIST.split(',');
  if (!adminsList.includes(user.user.email)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminGuard;
