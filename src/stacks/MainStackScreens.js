import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import { UserContext } from '../context/UserContext';

import ReservationScreen from '../screens/ReservationScreen'
import ProfileScreen from '../screens/ProfileScreen'
import EventsStackScreens from './EventsStackScreens'
import AdminStackScreens from './AdminStackScreens'


export default MainStackScreens = () => {
    const [user, setUser] = useContext(UserContext);
    const MainStack = createBottomTabNavigator()

    const tabBarOptions = {
        showLabel: false,
    }

    const screenOptions = (({ route }) => ({
        tabBarIcon: ({ focused }) => {
            let iconName = ""
            switch (route.name) {
                case "Profile":
                    iconName = "ios-person"
                    break;

                case "Reservation":
                    iconName = "calendar-outline"
                    break;

                case "Administrator":
                    iconName = "shield"
                    break;

                case "Event":
                    iconName = "trophy"
                    break;
                default:
                    iconName = "ios-home"
                    break;

            }

            return <Ionicons name={iconName} size={26} color={focused ? "#EAAE04" : "#666666"} />
        }
    }))

    return (
        <MainStack.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
            <MainStack.Screen name="Reservation" component={ReservationScreen} />
            <MainStack.Screen name="Event" component={EventsStackScreens} />
            <MainStack.Screen name="Profile" component={ProfileScreen} />
            {
                user.authorization === "administrator" &&
                <MainStack.Screen name="Administrator" component={AdminStackScreens} />
            }
        </MainStack.Navigator>
    )

}