import React from 'react'
import Text from '../components/Text'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Administrator = ({ navigation }) => {

    const onUsersButtonPress = () => {
        navigation.navigate('usersManagment')
    }

    const onEventssButtonPress = () => {
        navigation.navigate('eventsManagment')
    }

    return (
        <Container>
            <Title>
                <Text title center semi>Administration</Text>
            </Title>
            <ButtonsContainer>
                <UsersButton onPress={onUsersButtonPress}>
                    <Text title center color={"white"}>
                        <Ionicons name="people-sharp" size={40} color="white" />
                        {"   "}utilisateurs
                    </Text>
                </UsersButton>
                <EventsButton onPress={onEventssButtonPress}>
                    <Text title center color={"white"}>
                        <FontAwesome name="trophy" size={40} color="white" />
                        {"   "}évènements

                    </Text>
                </EventsButton>
            </ButtonsContainer>

        </Container>
    )
}

export default Administrator

const Container = styled.View`
    flex: 1;
`;

const Title = styled.View`
    background-color: #FBBC05; 
`;

const ButtonsContainer = styled.View`
    flex:1;
    justify-content: space-evenly;
    align-items: center;
`;

const UsersButton = styled.TouchableOpacity`
    background-color: #FBBC05;
    width : 80%;
    height: 50px;
    border-radius: 25px;
    justify-content: space-evenly;
    align-items: center;
`;

const EventsButton = styled.TouchableOpacity`
    background-color: #FBBC05;
    width : 80%;
    height: 50px;
    border-radius: 25px;
    justify-content: space-evenly;
    align-items: center;
`;

