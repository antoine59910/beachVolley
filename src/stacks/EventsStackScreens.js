import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import EventDetailScreen from '../screens/EventDetailScreen'
import EventsScreen from '../screens/EventsScreen'
import EventInscriptionScreen from '../screens/EventInscriptionScreen'


const EventsStackScreens = () => {
    const EventsStack = createStackNavigator();

    return (
        <EventsStack.Navigator headerMode="">
            <EventsStack.Screen name="events" component={EventsScreen} />
            <EventsStack.Screen name="eventDetail" component={EventDetailScreen} />
            <EventsStack.Screen name="eventInscription" component={EventInscriptionScreen} />
        </EventsStack.Navigator>
    )
}

export default EventsStackScreens
