import React from 'react';

import AlumniNotifications from '../components/notifications/AlumniNotifications';
import CollegeNotifications from '../components/notifications/CollegeNotifications';
import { AuthContext } from '../providers/CustomProvider';

const Notifications = () => {
  const { role } = React.useContext(AuthContext);
  if (role === 'alumni') {
    return <AlumniNotifications />;
  } else {
    return <CollegeNotifications />;
  }
};

export default Notifications;
