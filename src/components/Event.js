import React from 'react'
import styled from 'styled-components'
import { useNavigation } from '@react-navigation/native';

import Text from '../components/Text'

const Event = ({ event }) => {

    const { titre, maxEquipes, nbEquipesInscrites, date } = event;
    const placesRestantes = maxEquipes - nbEquipesInscrites;
    const navigation = useNavigation();

    const onPressEvent = () => {
        navigation.navigate('eventCreation', { event: event })
    }

    return (
        <EventContainer onPress={onPressEvent}>
            <Text large center bold>{titre}</Text>
            <Text medium center>{`${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`}</Text>
            <Text medium center>Inscriptions {nbEquipesInscrites} / {maxEquipes}</Text>
            { placesRestantes === 0 &&
                <Text medium center color={"red"}>COMPLET</Text>
            }
        </EventContainer>
    )
}

export default Event

const EventContainer = styled.TouchableOpacity`
    border-width: 0.5px;
    background-color: ${props => props.color || "white"};
    padding: 15px;
`;



