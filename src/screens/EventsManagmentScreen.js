import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { FirebaseContext } from '../context/FireBaseContext';
import Event from '../components/Event'

const EventsManagmentScreen = () => {
    const firebase = useContext(FirebaseContext);
    const [events, setEvents] = useState([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const onPressEvent = (event) => {
        navigation.navigate('eventCreation', { event: event })
    }


    useEffect(() => {
        const getEvents = async () => {
            setEvents(await firebase.getEvents());
        }

        getEvents();
    }, [isFocused])


    return (
        <Container>

            <EventsContainer>

                {events &&
                    events.map((event, index) => (
                        <EventContainer
                            onPress={() => onPressEvent(event)}
                            key={index}
                        >
                            <Event event={event} />
                        </EventContainer>)
                    )}
            </EventsContainer>

            {/* Nouvel évènement, on n'envoie vide en paramètre */}
            <AjoutEvent onPress={() => navigation.navigate('eventCreation', { event: "" })}>
                <Ionicons name="add-circle" size={100} color="#4CD964" />
            </AjoutEvent>

        </Container >
    )
}

export default EventsManagmentScreen

const Container = styled.View`
    flex:1;
`;

const EventsContainer = styled.ScrollView`
    flex:1;
    margin : 15px;
    background-color: white;
`;

const AjoutEvent = styled.TouchableOpacity`
    position : absolute;
    bottom:20px;
    right:20px;
`;

const EventContainer = styled.TouchableOpacity`
    border-width: 0.5px;
    background-color: ${props => props.color || "white"};
    padding: 15px;
`;