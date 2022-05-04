import React, { useContext, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { withBadge } from 'react-native-elements'
import moment from 'moment';

import { UserContext } from '../context/UserContext';

import ReservationScreen from '../screens/ReservationScreen'
import ProfileStackScreens from './ProfileStackScreens'
import EventsStackScreens from './EventsStackScreens'
import AdminStackScreens from './AdminStackScreens'
import { FirebaseContext } from '../context/FireBaseContext'

import firebase from 'firebase'
import 'firebase/firestore'

const db = firebase.firestore()

export default MainStackScreens = () => {
    const [user, setUser] = useContext(UserContext);
    const MainStack = createBottomTabNavigator()
    const [newEvent, setNewEvent] = useState(false)
    const [events, setEvents] = useState(false)
    const firebase = useContext(FirebaseContext)

    //MAJ temps réel si qqun créé ou supprime un évenement
    useEffect(() => {
        const unscubscribe = db.collection('evenements')
        .onSnapshot((querySnapshot) => {
                var evenements=[]     
                querySnapshot.forEach((doc) => {
                    evenements.push(doc.data().name);
                    
                });
                setEvents(evenements)
            })

        return () => {
            unscubscribe()
        }
    }, [])

    useEffect(() => {
        const getIfNewEvent = async () => {
            try {
                const AWeekLater = moment().add(7, 'days').format('YYYY-MM-DD')
                const events = await firebase.getEvents()

                if (events && events.filter(event => event.date < AWeekLater))
                    setNewEvent(true)
                else
                    setNewEvent(false)
            }
            catch (error) {
                console.log(error)
            }
        }

        getIfNewEvent()
    }, [events])

    const tabBarOptions = {
        showLabel: false,
    }

    const screenOptions = (({route}) => ({
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
                    if (newEvent) {
                        const BadgedIcon = withBadge("soon")(Ionicons)
                        return <BadgedIcon name={iconName} size={30} color={focused ? "#EAAE04" : "#666666"} />
                    }
                    break;

                default:
                    iconName = "ios-home"
                    break;


            }

            return <Ionicons name={iconName} size={30} color={focused ? "#EAAE04" : "#666666"} />

        }
    }))

    return (
        <MainStack.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
            <MainStack.Screen name="Reservation" component={ReservationScreen} />
            <MainStack.Screen name="Event" component={EventsStackScreens} />
            <MainStack.Screen name="Profile" component={ProfileStackScreens} />
            {
                user.authorization === "administrator" &&
                <MainStack.Screen name="Administrator" component={AdminStackScreens} />
            }
        </MainStack.Navigator>
    )

}