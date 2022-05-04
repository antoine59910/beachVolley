import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AdministratorScreen from '../screens/AdministratorScreen'
import UserDetailScreen from '../screens/UserDetailScreen'
import EventsManagmentScreen from '../screens/EventsManagmentScreen'
import UsersManagmentScreen from '../screens/UsersManagmentScreen'
import EventCreationScreen from '../screens/EventCreationScreen'
import FieldsManagmentScreen from '../screens/FieldsManagmentScreen'
import BlocageCreationScreen from '../screens/BlocageCreationScreen'
import NotificationsManagment from '../screens/NotificationsManagment'
import SecuriteScreen from '../screens/SecuriteScreen'


const AdminStackScreens = () => {
    const AdminStack = createStackNavigator();

    return (
        <AdminStack.Navigator headerMode="">
            <AdminStack.Screen name="admin" component={AdministratorScreen} />
            <AdminStack.Screen name="eventsManagment" component={EventsManagmentScreen} />
            <AdminStack.Screen name="eventCreation" component={EventCreationScreen} />
            <AdminStack.Screen name="usersManagment" component={UsersManagmentScreen} />
            <AdminStack.Screen name="userDetail" component={UserDetailScreen} />
            <AdminStack.Screen name="fieldsManagment" component={FieldsManagmentScreen} />
            <AdminStack.Screen name="notificationsManagment" component={NotificationsManagment} />
            <AdminStack.Screen name="blocageCreation" component={BlocageCreationScreen} />
            <AdminStack.Screen name="security" component={SecuriteScreen} />
        </AdminStack.Navigator>
    )
}

export default AdminStackScreens
