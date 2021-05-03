import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { Card, CardItem, Body } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

import Text from '../Text'
import { ROUGE, VERT, JAUNE, BLEU } from '../Color'
import { LIMITE_RESERVATION_PAR_FIELD } from '../../config/parameters'
import { UserContext } from '../../context/UserContext';

const Creneau = ({ hour, onReservePress, onDeletePress, reservationsParHourParField, limiteReservationParDay, blocked }) => {
    const [showBody, setShowBody] = useState(false)
    const [alreadyRegistred, setAlreadyRegistred] = useState(false)
    const [loading, setLoading] = useState(false)

    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        if (reservationsParHourParField)
            if (reservationsParHourParField.filter(element => element.joueurId === user.uid).length !== 0)
                setAlreadyRegistred(true)
            else
                setAlreadyRegistred(false)
    }, [reservationsParHourParField])

    const handleOnReservePress = (hour) => {
        setLoading(true)
        onReservePress(hour)
        setLoading(false)
    }

    return (
        <Card>
            <CardItem header bordered style={{ justifyContent: "space-evenly" }}>
                <HourContainer onPress={() => showBody ? setShowBody(false) : setShowBody(true)}>
                    {
                        showBody ?
                            <Text large><AntDesign name="caretup" size={24} color="black" />{` `}{`${hour}H - ${hour + 1}H`}</Text>
                            : <Text large><AntDesign name="caretdown" size={24} color="black" />{` `}{`${hour}H - ${hour + 1}H`}</Text>
                    }
                    {
                        reservationsParHourParField.length > 0 &&
                        <Text color={JAUNE} medium>{`                  `}{`${reservationsParHourParField.length}/${LIMITE_RESERVATION_PAR_FIELD}`}</Text>
                    }

                </HourContainer>
                {alreadyRegistred ?

                    <ButtonContainer color={VERT} onPress={() => onDeletePress(hour)}>
                        <Text center medium color="white">Inscrit</Text>
                    </ButtonContainer>
                    :
                    reservationsParHourParField.length >= LIMITE_RESERVATION_PAR_FIELD ?
                        <ButtonContainer color={ROUGE}>
                            <Text center medium color="white">Complet</Text>
                        </ButtonContainer>
                        :
                        <ButtonContainer onPress={() => handleOnReservePress(hour)} disabled={limiteReservationParDay || blocked} color={blocked ? "gray" : null}>
                            {blocked ?
                                <Text center medium color="white">Indisponible</Text> :
                                <Text center medium>S'inscrire</Text>
                            }
                        </ButtonContainer>
                }


            </CardItem>
            {
                showBody && reservationsParHourParField.length > 0 &&
                <CardItem>
                    <Body>
                        {
                            !!reservationsParHourParField &&
                            reservationsParHourParField.map(element =>
                                <PlayerContainer key={element.joueurId}>
                                    <ProfilePhoto
                                        source={
                                            element.profilePhotoUrl === "default" || element.profilePhotoUrl === "undefined"
                                                ? require("../../../assets/defaultProfilePhoto.jpg")
                                                : { uri: element.profilePhotoUrl }
                                        }
                                    />
                                    <TextPlayerContainer>
                                        <Text title>{element.joueur}</Text>
                                        <Text medium color="gray">{element.niveau}</Text>
                                    </TextPlayerContainer>
                                </PlayerContainer>
                            )
                        }
                    </Body>
                </CardItem>
            }
        </Card >
    )
}

export default Creneau

const HourContainer = styled.TouchableOpacity`
    flex:2;
    justify-content: space-evenly;
    margin:auto;
    border-radius: 10px;
    height: 60px;
`;

const ButtonContainer = styled.TouchableOpacity`
    flex:1;
    justify-content:center;
    background-color:  ${props => props.color || JAUNE};
    margin-left: 10px;
    border-radius: 30px;
    height: 50px;
`;

const PlayerContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const ProfilePhoto = styled.Image`
    width: 75px;
    height: 75px;
    border-radius: 35px;
    margin: 10px;
`;

const TextPlayerContainer = styled.View`
`;