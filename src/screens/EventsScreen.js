import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Content } from 'native-base';

import { FirebaseContext } from '../context/FireBaseContext';
import Event from '../components/Event'
import Text from '../components/Text'

const EventsScreen = () => {
    const firebase = useContext(FirebaseContext);
    const [events, setEvents] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

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
        <Content padder>
            <Text title heavy style={{ top: 20, left: 20 }}>Évenements</Text>
            <EventsContainer>
                {events &&
                    events.map((event) => (
                        <EventContainer key={event.id} onPress={() => onPressEvent(event)}>
                            <PhotoContainer>
                                <Photo
                                    source={require("../../assets/eventPictureResized.jpg")}
                                />
                            </PhotoContainer>
                            <TextContainer>
                                <Event event={event} />
                            </TextContainer>
                        </EventContainer>
                    ))
                }
            </EventsContainer>

        </Content >
    )
}

export default EventsScreen


const EventsContainer = styled.ScrollView`
    flex:1;
    margin : 15px;
    margin-top: 50px;
`;

const EventContainer = styled.TouchableOpacity`
    flex:1;
    border-width:2px;
    border-radius:15px;
    height: 330px;
    width: 311px;
    margin: auto;
    margin-bottom: 20px;
`;

const PhotoContainer = styled.View`
    text-align: center;
    margin: auto;
    flex: 2;
`;

const Photo = styled.Image`
    height: 200px;
    width: 306px;
    border-top-left-radius :12px;
    border-top-right-radius :12px;
`;

const TextContainer = styled.View`
    flex:1;
`;