import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import Text from '../Text'
import { UserContext } from '../../context/UserContext';
import { FirebaseContext } from '../../context/FireBaseContext';
import * as actions from '../../redux/actions'


const Terrain = ({ date, hour, field, reservationsParHourParField }) => {
    const [user] = useContext(UserContext);
    const [playersOnField, setPlayersOnField] = useState([]);
    const [alreadyRegistred, setAlreadyRegistred] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const nombreReservations = useSelector(state => state.nombreReservations)


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
                dispatch(actions.IncrementNombreReservations())
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
                dispatch(actions.DecrementNombreReservations())
            }
        }

        setIsLoading(false);
    }

    return (
        <Container>
            {
                reservationsParHourParField && reservationsParHourParField.length >= 6 && !alreadyRegistred ?
                    <TitreTerrain
                        color={"#EA4335"}
                        disabled
                    >

                        <Text center medium color={"white"}>Complet</Text>

                    </TitreTerrain>
                    :
                    <TitreTerrain
                        onPress={() => onReservationPress()}
                        color={alreadyRegistred ? "#34A853" : nombreReservations >= 2 ? "#EA4335" : null}
                        disabled={isLoading || !alreadyRegistred && nombreReservations >= 2}
                    >
                        {isLoading ?
                            (
                                <Loading />
                            ) : (
                                <Text center medium color={alreadyRegistred || nombreReservations >= 2 ? "white" : null}>Terrain {field}</Text>
                            )
                        }
                    </TitreTerrain>
            }


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