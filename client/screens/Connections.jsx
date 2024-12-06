import React from 'react'
import { AuthContext } from '../providers/CustomProvider'

import AlumniConnections from '../components/connections/AlumniConnections'
import CollegeConnections from '../components/connections/CollegeConnections'

const Notifications = () => {
  const { role } = React.useContext(AuthContext)
  if (role === 'alumni') {
    return <AlumniConnections />
  } else {
    return <CollegeConnections />
  }
}

export default Notifications