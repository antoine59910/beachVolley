import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import Text from '../components/Text'
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";

import { FirebaseContext } from '../context/FireBaseContext';
import Event from '../components/Event'


const EventsScreen = () => {
    const firebase = useContext(FirebaseContext);
    const [events, setEvents] = useState([]);
    const isFocused = useIsFocused();

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
                    events.map((event, index) => <Event
                        event={event}
                        key={index}
                    />)
                }
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