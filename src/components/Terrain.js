import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import Text from '../components/Text'
import { UserContext } from '../context/UserContext';
import { FirebaseContext } from '../context/FireBaseContext';


const Terrain = ({ date, hour, field, reservationsParHourParField, reservedLimitExceed }) => {
    const [user, setUser] = useContext(UserContext);
    const [playersOnField, setPlayersOnField] = useState([]);
    const [alreadyRegistred, setAlreadyRegistred] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const firebase = useContext(FirebaseContext);

    useEffect(() => {
        if (reservationsParHourParField) {
            setPlayersOnField(reservationsParHourParField)
            if (reservationsParHourParField.filter(element => element.joueurId === user.uid).length !== 0)
                setAlreadyRegistred(true)
        }

    }, [reservationsParHourParField])

    const onReservationPress = async () => {
        setIsLoading(true);

        //Ajout réservation
        if (!alreadyRegistred) {
            const successOnCreateReservation = await firebase.setReservation(date, hour, field, user.username, user.uid);

            if (!successOnCreateReservation)
                alert("Problème lors de la réservation, veuillez réessayer plus tard");

            //Si réservation OK, ajout du joueur passage en déjà enregistré
            else {
                const player = {
                    joueurId: user.uid,
                    joueur: user.username
                }
                setPlayersOnField(prevState => [...prevState, player])
                setAlreadyRegistred(true)
            }
        }

        //Suppression réservation
        else {
            const successOnDeleteReservation = await firebase.deleteReservation(date, hour, field, user.username)
            if (!successOnDeleteReservation)
                alert("Problème lors de la suppression de la réservation")

            //Si suppression OK, suppression du joueur et passage en non enregistré
            else {
                setPlayersOnField(prevState => prevState.filter(reservation => reservation.joueurId !== user.uid))
                setAlreadyRegistred(false)
            }
        }

        setIsLoading(false);
    }

    return (
        <Container>

            <TitreTerrain
                onPress={() => onReservationPress()}
                color={alreadyRegistred ? "#34A853" : reservedLimitExceed ? "#EA4335" : null}
                disabled={isLoading || (reservedLimitExceed && !alreadyRegistred)}
            >
                {isLoading ?
                    (
                        <Loading />
                    ) : (
                        <Text center medium color={alreadyRegistred || reservedLimitExceed ? "white" : null}>Terrain {field}</Text>
                    )
                }
            </TitreTerrain>

            {playersOnField &&
                playersOnField.map(element =>
                    <Text key={element.joueurId} large>{element.joueur}</Text>
                )}

        </Container>
    )
}

export default Terrain

const Container = styled.View`
    flex:1;
    padding: 5px;
`;

const TitreTerrain = styled.TouchableOpacity`
    height: 30px;
    border-radius: 15px;
    background-color: ${props => props.color || "#FBBC05"};
    justify-content: center;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "small",
}))``;