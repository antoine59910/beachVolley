import React, { useEffect, useContext, useState } from 'react'
import styled from 'styled-components'
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { FirebaseContext } from '../context/FireBaseContext';
import { UserContext } from '../context/UserContext';

import Text from '../components/Text'
import InscribedTeams from '../components/events/InscribedTeams'

const EventInscriptionScreen = ({ route }) => {
    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext);
    const [inscriptions, setInscriptions] = useState([]);
    const isFocused = useIsFocused();
    const event = route.params.event

    const { date, description, joueurParEquipe, maxEquipes, titre, nbEquipesInscrites, id } = event
    const placesRestantes = maxEquipes - nbEquipesInscrites;
    const navigation = useNavigation();

    const onPressSInscrire = (event) => {
        navigation.navigate('eventInscription', { event: event, inscription: "" })
    }

    const onPressInscription = (event, inscription) => {
        //Modification ou suppression accessible uniquement si l'utilisateur est soit administrateur soit qu'il soit l'auteur de l'inscription
        if (inscription.inscrivantId === user.uid || user.authorization === "administrator")
            navigation.navigate('eventInscription', { event: event, inscription: inscription })
    }

    useEffect(() => {
        const getInscriptionsEvent = async () => {
            setInscriptions(await firebase.getInscriptionsEvent(id));
        }

        getInscriptionsEvent();
    }, [isFocused])

    return (
        <Container>
            <Text large center bold>{titre}</Text>
            <Text medium center>{`${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`}</Text>
            <Text medium center>Inscriptions {nbEquipesInscrites} / {maxEquipes}</Text>
            {
                placesRestantes <= 0 && <Text medium center color={"red"}>COMPLET</Text>
            }
            <Description>
                <Text medium>{description}</Text>
            </Description>

            <Text large center bold>Inscriptions</Text>
            <TeamsContainer>
                {
                    inscriptions &&
                    inscriptions.map((inscription) => (
                        <InscriptionContainer
                            key={inscription.id}
                            onPress={() => onPressInscription(event, inscription)}
                        >
                            <InscribedTeams inscription={inscription} />
                        </InscriptionContainer>
                    ))
                }
            </TeamsContainer>

            <ButtonValiderContainer>
                <ButtonValider
                    onPress={() => onPressSInscrire(event)}
                    disabled={placesRestantes <= 0 ? true : false}
                    color={placesRestantes > 0 && "#34A853"}
                >
                    {
                        placesRestantes <= 0 ?
                            <Text center large color={"white"}>COMPLET</Text>
                            : <Text center large color={"white"}>S'inscrire</Text>
                    }
                </ButtonValider>
            </ButtonValiderContainer>
        </Container >
    )
}

export default EventInscriptionScreen


const Container = styled.ScrollView`
    flex: 1;
    margin-top: 16px;
`;

const Description = styled.View`
    border-width: 0.75px;
    border-radius: 25px;
    padding : 15px;
    margin : 5px;
    background-color : white;
`;

const ButtonValiderContainer = styled.View`
    position : absolute;
    bottom : 0px;
    z-index: 1;
    width : 100%;
    border-width : 0.2px;
`
const ButtonValider = styled.TouchableOpacity`
    margin: 10px;
    padding : 20px;
    background-color: ${props => props.color || "#EA4335"};
    border-radius: 50px;
`;

const TeamsContainer = styled.View`
    background-color: white;
    margin-bottom: 100px;
`;

const InscriptionContainer = styled.TouchableOpacity`
    border-width: 0.5px;
    background-color: ${props => props.color || "white"};
    padding: 15px;
`;

