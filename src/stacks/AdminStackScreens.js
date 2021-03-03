import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AdministratorScreen from '../screens/AdministratorScreen'
import UserDetailScreen from '../screens/UserDetailScreen'
import EventsManagment from '../screens/EventsManagment'
import UsersManagment from '../screens/UsersManagment'


const AdminStackScreens = () => {
    const AdminStack = createStackNavigator();

    return (
        <AdminStack.Navigator headerMode="">
            <AdminStack.Screen name="admin" component={AdministratorScreen} />
            <AdminStack.Screen name="eventsManagment" component={EventsManagment} />
            <AdminStack.Screen name="usersManagment" component={UsersManagment} />
            <AdminStack.Screen name="userDetail" component={UserDetailScreen} />
        </AdminStack.Navigator>
    )
}

export default AdminStackScreens
