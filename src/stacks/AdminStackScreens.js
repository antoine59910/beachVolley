import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AdministratorScreen from '../screens/AdministratorScreen'
import UserDetailScreen from '../screens/UserDetailScreen'
import EventsManagmentScreen from '../screens/EventsManagmentScreen'
import UsersManagmentScreen from '../screens/UsersManagmentScreen'
import EventCreationScreen from '../screens/EventCreationScreen'
import FieldsManagmentScreen from '../screens/FieldsManagmentScreen'
import BlocageCreationScreen from '../screens/BlocageCreationScreen'


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
            <AdminStack.Screen name="blocageCreation" component={BlocageCreationScreen} />
        </AdminStack.Navigator>
    )
}

export default AdminStackScreens
