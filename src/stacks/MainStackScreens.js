import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import ReservationScreen from '../screens/ReservationScreen'
import ProfileScreen from '../screens/ProfileScreen'

export default MainStackScreens = () => {
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
            <MainStack.Screen name="Profile" component={ProfileScreen} />
        </MainStack.Navigator>
    )

}