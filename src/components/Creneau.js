import React, { useContext, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import styled from 'styled-components'

import Text from '../components/Text'
import Terrain from '../components/Terrain'

const Creneau = ({ date, hour, reservationsParHour }) => {
    const [loading, setLoading] = useState(false)
    const [terrains, setTerrains] = useState([])
    const nombreTerrain = 3

    //Création des terrains
    useEffect(() => {
        setLoading(true)
        setTerrains([])
        for (let terrain = 1; terrain <= nombreTerrain; terrain++) {
            const terrain =
                < Terrain
                    key={terrain}
                    field={terrain}
                    date={date}
                    hour={hour}
                    reservationsParHourParField={
                        reservationsParHour ?
                            reservationsParHour.filter(element => element.terrain == terrain)
                            : null
                    }
                />;
            setTerrains(prevState => [...prevState, terrain])
        }

        setLoading(false)
    }, [reservationsParHour])

    return (
        <Item>
            <ReservationHeader>
                <Ionicons name="time-outline" size={40} />
                <Hour>
                    <Text center large>{`${hour}h00 - ${hour + 1}h00`}</Text>
                </Hour>
            </ReservationHeader>
            <ReservationBody>
                {loading ? <Loading /> : terrains}
            </ReservationBody>
        </Item>
    )
}

export default Creneau


const Item = styled.View`
    border-top-width : 1px;
`;

const ReservationHeader = styled.View`
    flex-direction : row;
    justify-content: center;
    align-items: center;
`;

const Hour = styled.View`
    flex:1;
`;

const ReservationBody = styled.View`
flex-direction : row;
`;

const TitreTerrain = styled.TouchableOpacity`
    height: 30px;
    border-radius: 15px;
    background-color: #FBBC05;
    justify-content: center;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "#FBBC05",
    size: "large",
}))``;

