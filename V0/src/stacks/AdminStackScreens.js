import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AdministratorScreen from '../screens/AdministratorScreen'
import UserDetailScreen from '../screens/UserDetailScreen'
import EventsManagmentScreen from '../screens/EventsManagmentScreen'
import UsersManagmentScreen from '../screens/UsersManagmentScreen'
import EventCreationScreen from '../screens/EventCreationScreen'


const AdminStackScreens = () => {
    const AdminStack = createStackNavigator();

    return (
        <AdminStack.Navigator headerMode="">
            <AdminStack.Screen name="admin" component={AdministratorScreen} />
            <AdminStack.Screen name="eventsManagment" component={EventsManagmentScreen} />
            <AdminStack.Screen name="eventCreation" component={EventCreationScreen} />
            <AdminStack.Screen name="usersManagment" component={UsersManagmentScreen} />
            <AdminStack.Screen name="userDetail" component={UserDetailScreen} />
        </AdminStack.Navigator>
    )
}

export default AdminStackScreens
