import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ProfileScreen from '../screens/ProfileScreen'
import ProfileModificationScreen from '../screens/ProfileModificationScreen'

const ProfileStackScreens = () => {
    const ProfileStack = createStackNavigator();

    return (
        <ProfileStack.Navigator headerMode="">
            <ProfileStack.Screen name="Profile" component={ProfileScreen} />
            <ProfileStack.Screen name="ModifyProfile" component={ProfileModificationScreen} />
        </ProfileStack.Navigator>
    )
}

export default ProfileStackScreens
