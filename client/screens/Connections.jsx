import { useContext } from 'react';

import AlumniConnections from '../components/connections/AlumniConnections';
import CollegeConnections from '../components/connections/CollegeConnections';
import { AuthContext } from '../providers/CustomProvider';

const Notifications = () => {
  const { role } = useContext(AuthContext);
  if (role === 'alumni') {
    return <AlumniConnections />;
  } else {
    return <CollegeConnections />;
  }
};

export default Notifications;
