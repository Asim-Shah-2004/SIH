import AlumniConnections from '../components/connections/AlumniConnections';
import CollegeConnections from '../components/connections/CollegeConnections';
import { useAuth } from '../providers/AuthProvider';

const Notifications = () => {
  const { role } = useAuth();
  if (role === 'alumni') {
    return <AlumniConnections />;
  } else {
    return <CollegeConnections />;
  }
};

export default Notifications;
