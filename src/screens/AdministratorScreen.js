import React, { useEffect, useState, useContext } from 'react'
import Text from '../components/Text'
import styled from 'styled-components'
import { useIsFocused } from "@react-navigation/native";

import { FirebaseContext } from '../context/FireBaseContext';
import UsersManagment from './UsersManagment';
import EventsManagment from './EventsManagment';

const Administrator = ({ navigation }) => {

    return (
        <Container>
            <Title>
                <Text title center semi>Administration</Text>
            </Title>

            <UsersManagmentTouchableOpacity onPress={() => navigation.navigate('usersManagment')}>
                <Text>Gestion des utilisateurs</Text>
            </UsersManagmentTouchableOpacity>
            <EventsManagmentTouchableOpacity onPress={() => navigation.navigate('eventsManagment')}>
                <Text>Gestion des événements</Text>
            </EventsManagmentTouchableOpacity>
        </Container>
    )
}

export default Administrator

const Container = styled.View`
    flex:1;
`;

const Title = styled.View`
    background-color: #FBBC05; 
`;

const UsersManagmentTouchableOpacity = styled.TouchableOpacity`
    border-width: 0.5px;
    background-color: ${props => props.color || "white"};
`;

const EventsManagmentTouchableOpacity = styled.TouchableOpacity`
    border-width: 0.5px;
    background-color: ${props => props.color || "white"};
`;