import React, { useEffect, useContext, useState } from 'react'
import styled from 'styled-components'
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { FirebaseContext } from '../context/FireBaseContext';
import { UserContext } from '../context/UserContext';
import { Dimensions, SafeAreaView } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Content } from 'native-base';
import { Card, CardItem } from 'native-base';

import Text from '../components/Text'
import { ROUGE, VERT, JAUNE } from '../components/Color'

import firebase from 'firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const EventInscriptionScreen = ({ route }) => {
    const [user, setUser] = useContext(UserContext)
    const [alreadySuscribed, setAlreadySuscribed] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const firebase = useContext(FirebaseContext);
    const [inscriptions, setInscriptions] = useState([]);
    const [event, setEvent] = useState(route.params.event);
    const isFocused = useIsFocused();

    const { date, description, joueurParEquipe, maxEquipes, titre, nbEquipesInscrites, id } = event
    const placesRestantes = maxEquipes - nbEquipesInscrites;
    const navigation = useNavigation();

    //MAJ temps réel de l'évènement si qqun s'inscrit/se supprime à l'évènement
    useEffect(() => {
        const unscubscribe = db.collection('evenements')
            .doc(event.id)
            .onSnapshot((snapshot) => {
                if (snapshot.exists)
                    setEvent(snapshot.data())
            })

        return () => {
            unscubscribe()
        }
    }, [])

    //Mise à jour temps réel des inscriptions
        useEffect(() => {
        const unscubscribe = db.collection('evenements').doc(event.id).collection('equipes')
        .onSnapshot((querySnapshot) => {
                var equipes=[]     
                querySnapshot.forEach((doc) => {
                    equipes.push(doc.data());

                });
                setInscriptions(equipes)
            })

        return () => {
            unscubscribe()
        }
    }, [])

    const onPressSInscrire = (event) => {
        navigation.navigate('eventInscription', { event: event, inscription: "" })
    }

    const onPressInscription = (event, inscription) => {
        //Modification ou suppression accessible uniquement si l'utilisateur est soit administrateur soit qu'il soit l'auteur de l'inscription
        if (inscription.inscrivantId === user.uid || user.authorization === "administrator")
            navigation.navigate('eventInscription', { event: event, inscription: inscription })
    }

    //Permet de s'avoir si le joueur s'est déjà inscrit ou non
    useEffect(() => {
        if (inscriptions) {
            setAlreadySuscribed(false)
            inscriptions.map(inscription => {
                if (inscription.inscrivantId === user.uid)
                    setAlreadySuscribed(true)
            })
        }
    }, [inscriptions])

    //Initialisation
    useEffect(() => {
        if (user.authorization === "administrator")
            setIsAdmin(true)
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container>
                <PhotoContainer>
                    <CloseModal onPress={() => navigation.navigate("events")}>
                        <AntDesign name="closecircle" size={40} color="black" />
                    </CloseModal>
                    {
                                    event.selectedPicture === "Tournoi" ?
                                        <Photo
                                            source={require("../../assets/tournamentDetail.jpg")}
                                        />
                                        :
                                        event.selectedPicture === "Entrainement" ?
                                            <Photo
                                                source={require("../../assets/training.jpg")}
                                            />
                                            :
                                            <Photo
                                                source={require("../../assets/eventPicture.jpg")}
                                            />
                                }
                </PhotoContainer>
                <BodyContainer>
                    <Content padder>
                        <TitleContainer>
                            <Text title center bold>{titre}</Text>
                            <Text medium center >{`${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`}</Text>
                            <Text medium center >Inscriptions {nbEquipesInscrites} / {maxEquipes}</Text>
                        </TitleContainer>

                        <Description>
                            <Text large heavy>A propos</Text>
                            <Text medium>{description}</Text>
                        </Description>
                        <Text title center bold>Inscriptions</Text>
                        <TeamsContainer>
                            {
                                inscriptions &&
                                inscriptions.map((inscription) => (
                                    <Card
                                        key={inscription.id}
                                    >
                                        <CardTouchableOpacity onPress={() => onPressInscription(event, inscription)}>
                                            <CardItem>
                                                <ProfilePhoto
                                                    source={
                                                        inscription.profilePhotoUrl === "default" || inscription.profilePhotoUrl === "undefined"
                                                            ? require("../../assets/defaultProfilePhoto.jpg")
                                                            : { uri: inscription.profilePhotoUrl }
                                                    }
                                                />

                                                <PlayerContainer>
                                                    <Text medium color="gray">{inscription.inscrivantNiveau}</Text>
                                                    {
                                                        inscription &&
                                                        inscription.equipe.map((joueur, index) =>
                                                            joueur.length > 12 ?
                                                            <Text key={index} title>{joueur.substr(0,12)}...</Text>
                                                            :
                                                            <Text key={index} title>{joueur}</Text>
                                                        )
                                                    }
                                                </PlayerContainer>
                                            </CardItem>
                                        </CardTouchableOpacity>
                                    </Card>
                                ))
                            }
                        </TeamsContainer>
                    </Content>
                </BodyContainer>

            </Container >
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
                            ? <Text center large>S'inscrire</Text> :
                            (alreadySuscribed && !isAdmin)
                                ? <Text center large color={"white"}>Déjà inscrit</Text> :
                                (placesRestantes <= 0 && isAdmin) ||
                                    (placesRestantes <= 0 && !isAdmin && alreadySuscribed)
                                    ? <Text center large color={"white"}>COMPLET</Text>
                                    : null
                    }
                </ButtonValider>
            </ButtonValiderContainer>
        </SafeAreaView>
    )
}

export default EventInscriptionScreen


const Container = styled.ScrollView`
    flex: 1;
    background-color:white;
`;

const PhotoContainer = styled.View`
`;

const Photo = styled.Image`
    height: ${432 * Dimensions.get('window').width / 750}px;
    width: ${Dimensions.get('window').width}px;
    z-index: -100;
`;

const CloseModal = styled.TouchableOpacity`
    position : absolute;
    top:20px;
    right:20px;
    background-color: white;
    border-radius: 20px;
`;

const BodyContainer = styled.View`
    background-color:white;
    flex:1;
    margin-top: -40px;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
 `;

const TitleContainer = styled.View`
    border-radius: 40px;
    width:75%;
    padding: 10px;
    margin:auto;
    margin-bottom: 30px;
    margin-top: 20px;
    border-width: 3px;
    border-color: ${JAUNE}
`;

const Description = styled.View`
    margin-bottom: 30px;
`;

const ButtonValiderContainer = styled.View`
    position : absolute;
    bottom : 0px;
    z-index: 1;
    width : 100%;
    border-width : 0.2px;
    background-color: white;
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

const CardTouchableOpacity = styled.TouchableOpacity`
`;

const PlayerContainer = styled.View`
margin-left: 10px;
`;

const ProfilePhoto = styled.Image`
    width: 75px;
    height: 75px;
    border-radius: 35px;
    margin: 10px;
`;

