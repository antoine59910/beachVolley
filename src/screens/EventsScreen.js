import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { FirebaseContext } from '../context/FireBaseContext';
import Event from '../components/Event'

const EventsScreen = () => {
    const firebase = useContext(FirebaseContext);
    const [events, setEvents] = useState([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const onPressEvent = (event) => {
        navigation.navigate('eventDetail', { event: event })
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

        </Container >
    )
}

export default EventsScreen

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
