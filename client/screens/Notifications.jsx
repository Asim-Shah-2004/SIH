import AlumniNotifications from '../components/notifications/AlumniNotifications';
import CollegeNotifications from '../components/notifications/CollegeNotifications';
import { useAuth } from '../providers/AuthProvider';

const Notifications = () => {
  const { role } = useAuth();
  if (role === 'alumni') {
    return <AlumniNotifications />;
  } else {
    return <CollegeNotifications />;
  }
};

export default Notifications;
