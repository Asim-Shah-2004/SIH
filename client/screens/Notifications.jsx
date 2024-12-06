import React from 'react'
import { AuthContext } from '../providers/CustomProvider'

import AlumniNotifications from '../components/notifications/AlumniNotifications'
import CollegeNotifications from '../components/notifications/CollegeNotifications'

const Notifications = () => {
  const { role } = React.useContext(AuthContext)
  if (role === 'alumni') {
    return <AlumniNotifications />
  } else {
    return <CollegeNotifications />
  }
}

export default Notifications