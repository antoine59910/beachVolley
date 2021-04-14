import React, { useEffect, useContext, useState } from 'react'
import styled from 'styled-components'
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { FirebaseContext } from '../context/FireBaseContext';
import { UserContext } from '../context/UserContext';

import Text from '../components/Text'
import InscribedTeams from '../components/events/InscribedTeams'
import { ROUGE, VERT, JAUNE } from '../components/Color'

const EventInscriptionScreen = ({ route }) => {
    const [user, setUser] = useContext(UserContext)
    const [alreadySuscribed, setAlreadySuscribed] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
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

    useEffect(() => {
        if (inscriptions)
            inscriptions.map(inscription => {
                console.log()
                if (inscription.inscrivantId === user.uid)
                    setAlreadySuscribed(true)
            })
    }, [inscriptions])

    useEffect(() => {
        if (user.authorization === "administrator")
            setIsAdmin(true)
    }, [])

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
                    disabled={
                        (placesRestantes > 0 && !alreadySuscribed) ||
                            (placesRestantes > 0 && alreadySuscribed && isAdmin)
                            ? false : true
                    }
                    color={
                        (placesRestantes > 0 && !alreadySuscribed) ||
                            (placesRestantes > 0 && alreadySuscribed && isAdmin)
                            ? JAUNE :
                            (alreadySuscribed && !isAdmin)
                                ? VERT :
                                (placesRestantes <= 0 && isAdmin) ||
                                    (placesRestantes <= 0 && !isAdmin && alreadySuscribed)
                                    ? ROUGE : null}
                >
                    {
                        (placesRestantes > 0 && !alreadySuscribed) ||
                            (placesRestantes > 0 && alreadySuscribed && isAdmin)
                            ? <Text center large color={"white"}>S'inscrire</Text> :
                            (alreadySuscribed && !isAdmin)
                                ? <Text center large color={"white"}>Déjà inscrit</Text> :
                                (placesRestantes <= 0 && isAdmin) ||
                                    (placesRestantes <= 0 && !isAdmin && alreadySuscribed)
                                    ? <Text center large color={"white"}>COMPLET</Text>
                                    : null
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
    background-color: white;
    padding: 15px;
`;

