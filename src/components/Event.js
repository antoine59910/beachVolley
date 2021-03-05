import React from 'react'
import styled from 'styled-components'
import Text from '../components/Text'

const Event = ({ event }) => {

    const { titre, maxEquipes, nbEquipesInscrites, date } = event;
    const placesRestantes = maxEquipes - nbEquipesInscrites;


    return (
        <EventContainer >
            <Text large center bold>{titre}</Text>
            <Text medium center>{date}</Text>
            { placesRestantes > 0 ?
                <Text medium center>places restantes : {placesRestantes}</Text>
                : <Text medium center color={"red"}>COMPLET</Text>
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



