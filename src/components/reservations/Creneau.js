import React, { useEffect, useState, useContext } from 'react'
import { Modal, Alert, StyleSheet } from 'react-native';
import styled from 'styled-components'
import { Card, CardItem, Body } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'

import Text from '../Text'
import { ROUGE, VERT, JAUNE, BLEU } from '../Color'
import { LIMITE_RESERVATION_PAR_FIELD } from '../../config/parameters'
import { UserContext } from '../../context/UserContext';
import { TERRAINS, PLAYERS_BY_MATCH } from '../../config/parameters';
import { creationTeamFunction } from '../../features/CreationEquipe'
import TeamCreated from './TeamCreated'
import PlayersWaiting from './PlayersWaiting';

const Creneau = ({ hour, onReservePress, onDeletePress, reservationsParHour, limiteReservationParDay }) => {
    const [showBody, setShowBody] = useState(false)
    const [alreadyRegistred, setAlreadyRegistred] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedField, setSelectedField] = useState("Terrain 1");
    const [reservationsParHourParField, setReservationsParHourParField] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [playersTeamCreated, setPlayersTeamCreated] = useState([])

    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        if (reservationsParHour)
            if (reservationsParHour.filter(element => element.joueurId === user.uid).length !== 0)
                setAlreadyRegistred(true)
            else
                setAlreadyRegistred(false)
    }, [reservationsParHour])

    useEffect(() => {
        if (reservationsParHour)
            setReservationsParHourParField(reservationsParHour.filter(element => element.terrain === selectedField))
        else
            setReservationsParHourParField([])
    }, [reservationsParHour, selectedField])

    const handleOnReservePress = (hour, selectedField) => {
        setLoading(true)
        onReservePress(hour, selectedField)
        setLoading(false)
    }

    const handleOnDeletePress = () => {
        setLoading(true)
        onDeletePress(hour)
        setLoading(false)
    }

    //Lors d'un appui sur un Terrain, on change le terrain sélectionné
    const onFieldPress = (field) => {
        setSelectedField(field);
    }

    //Génération de la création d'équipe
    const handleCreationTeam = (reservations) => {
        setPlayersTeamCreated([])
        if (reservations.length < PLAYERS_BY_MATCH)
            Alert.alert("Génération des équipes impossible", "Il n'y a pas assez de joueurs")

        else {
            let playersTeamCreatedParHour = creationTeamFunction(reservations)
            setPlayersTeamCreated(playersTeamCreatedParHour)
            setShowModal(true)
        }
    }

    return (
        <Card>
            <CardItem header bordered style={{ justifyContent: "space-evenly" }}>
                {/*
                    En tête
                */}
                <HourContainer onPress={() => showBody ? setShowBody(false) : setShowBody(true)}>
                    {
                        showBody ?
                            <Text large><AntDesign name="caretup" size={24} color="black" />{` `}{`${hour}H - ${hour + 1}H`}</Text>
                            : <Text large><AntDesign name="caretdown" size={24} color="black" />{` `}{`${hour}H - ${hour + 1}H`}</Text>
                    }
                    {
                        reservationsParHour.length > 0 &&
                        <Text color={JAUNE} medium>{`                  `}{`${reservationsParHour.length}/${LIMITE_RESERVATION_PAR_FIELD * TERRAINS.length}`}</Text>
                    }

                </HourContainer>

                {alreadyRegistred ?

                    <ButtonContainer color={VERT} onPress={() => handleOnDeletePress()}>
                        <Text center medium color="white">Inscrit</Text>
                    </ButtonContainer>
                    :
                    reservationsParHour.length >= LIMITE_RESERVATION_PAR_FIELD * TERRAINS.length ?
                        <ButtonContainer color={ROUGE}>
                            <Text center medium color="white">Complet</Text>
                        </ButtonContainer>
                        :
                        <>
                            {
                                hour < 13 ?
                                    <>
                                        {
                                            showBody ?
                                                <ReservationButtonContainer onPress={() => handleOnReservePress(hour, selectedField)} disabled={limiteReservationParDay} >
                                                    <Text center medium color="white">Réserver</Text>
                                                </ReservationButtonContainer>
                                                :
                                                <ButtonContainer onPress={() => setShowBody(true)} disabled={limiteReservationParDay} >
                                                    <Text center medium>Voir Détail</Text>
                                                </ButtonContainer>
                                        }
                                    </>

                                    :
                                    <ButtonContainer onPress={() => handleOnReservePress(hour, selectedField)} disabled={limiteReservationParDay} >
                                        <Text center medium>S'inscrire</Text>
                                    </ButtonContainer>
                            }
                        </>

                }
            </CardItem>

            {/* Corps */}
            {
                showBody && hour >= 13 && reservationsParHour.length >= PLAYERS_BY_MATCH &&
                <GenererLesEquipes onPress={() => handleCreationTeam(reservationsParHour)}  >
                    <Text center medium>Créer les équipes</Text>
                </GenererLesEquipes>
            }
            {
                hour < 13 && showBody &&
                <BottomHeader>
                    <FieldsContainer>
                        {
                            TERRAINS.map(terrain => {
                                return (
                                    <Field
                                        color={selectedField === terrain ? VERT : JAUNE}
                                        onPress={() => onFieldPress(terrain)}
                                        disabled={selectedField === terrain || loading}
                                        key={terrain}
                                    >
                                        <Text color={selectedField === terrain ? "white" : null} medium>{terrain}</Text>
                                    </Field>
                                )
                            })
                        }
                    </FieldsContainer>
                </BottomHeader>
            }
            {
                showBody && reservationsParHour.length > 0 &&
                <CardItem>
                    <Body>
                        {
                            !!reservationsParHour &&
                            reservationsParHourParField.map(element =>
                                <PlayerContainer key={element.joueurId}>

                                    <ProfilePhoto
                                        source={
                                            element.profilePhotoUrl === "default" || element.profilePhotoUrl === "undefined"
                                                ? require("../../../assets/defaultProfilePhoto.jpg")
                                                : { uri: element.profilePhotoUrl }
                                        }
                                        style={[element.champion == "or" ? styles.or : element.champion == "argent" ? styles.argent : element.champion == "bronze" && styles.bronze]}
                                    />

                                    {
                                        element.stars >= 1 &&
                                        <Ionicons name="star" size={20} color={"#EAAE04"} style={styles.etoiles1} />
                                    }
                                    {
                                        element.stars >= 2 &&
                                        <Ionicons name="star" size={20} color={"#EAAE04"} style={styles.etoiles2} />
                                    }
                                    {
                                        element.stars >= 3 &&
                                        <Ionicons name="star" size={20} color={"#EAAE04"} style={styles.etoiles3} />
                                    }
                                    {
                                        element.stars >= 4 &&
                                        <Ionicons name="star" size={20} color={"#EAAE04"} style={styles.etoiles4} />
                                    }
                                    {
                                        element.stars >= 5 &&
                                        <Ionicons name="star" size={20} color={"#EAAE04"} style={styles.etoiles5} />
                                    }

                                    <TextPlayerContainer>
                                        {
                                            element.joueur.length > 12 ?
                                                <Text title>{element.joueur.substr(0, 12)}...</Text>
                                                : <Text title>{element.joueur}</Text>

                                        }
                                        <Text medium color="gray">{element.niveau}</Text>
                                        {
                                            !!element.title &&
                                            <Text medium >{element.title}</Text>
                                        }

                                    </TextPlayerContainer>
                                </PlayerContainer>
                            )
                        }
                    </Body>
                </CardItem>
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setShowCalendar(!showCalendar);
                }}
            >
                <CenteredView>
                    <ModalView>
                        <CloseModal onPress={() => setShowModal(false)}>
                            <AntDesign name="closecircle" size={30} color="black" />
                        </CloseModal>
                        {

                            TERRAINS.map(terrain =>
                                <TeamCreated
                                    joueurs={playersTeamCreated.filter(player => player.creationEquipeTerrain === terrain)}
                                    terrain={terrain}
                                    key={terrain}
                                />)
                        }
                        <PlayersWaiting
                            joueurs={playersTeamCreated.filter(player => !player.creationEquipeTerrain)}
                        />

                    </ModalView>
                </CenteredView>
            </Modal>
        </Card >
    )
}

export default Creneau

const styles = StyleSheet.create({
    etoiles1: {
        position: 'absolute',
        top: 30,
        left: -10,
    },
    etoiles2: {
        position: 'absolute',
        top: 0,
        left: 5,
    },
    etoiles3: {
        position: 'absolute',
        top: -12,
        left: 37.5,
    },
    etoiles4: {
        position: 'absolute',
        top: 0,
        left: 70,
    },
    etoiles5: {
        position: 'absolute',
        top: 30,
        left: 85,
    },
    or: {
        borderWidth: 5,
        borderColor: JAUNE,
    },
    argent: {
        borderWidth: 5,
        borderColor: "#bab8b8",
    },
    bronze: {
        borderWidth: 5,
        borderColor: "#E9A06D",
    },
})

const HourContainer = styled.TouchableOpacity`
    flex:2;
    justify-content: space-evenly;
    margin:auto;
    border-radius: 10px;
    height: 60px;
`;

const ReservationButtonContainer = styled.TouchableOpacity`
    flex:1;
    justify-content:center;
    background-color:  ${props => props.color || BLEU};
    margin-left: 10px;
    border-radius: 30px;
    height: 50px;
`;

const ButtonContainer = styled.TouchableOpacity`
    flex:1;
    justify-content:center;
    background-color:  ${props => props.color || JAUNE};
    margin-left: 10px;
    border-radius: 30px;
    height: 50px;
`;

const GenererLesEquipes = styled.TouchableOpacity`
    flex:1;
    justify-content:center;
    background-color:  ${props => props.color || JAUNE};
    margin: 20px;
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
margin-left :20px;
`;


const BottomHeader = styled.View`
    flex: 1;
    padding-top: 10px;
    align-items: center;
`;

const FieldsContainer = styled.View`
    flex-direction: row;
    justify-content: space-evenly;
`;

const Field = styled.TouchableOpacity`
    background-color: ${props => props.color || "#FAC01C"}; 
    flex: 1;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 10px;
    border-radius: 25px;
    align-items: center;
    justify-content: center;
    height: 30px;
`;

const CenteredView = styled.View`
                    flex: 1;
                    justifyContent: center;
                    alignItems: center;
                    marginTop: 22px;
                    `;

const ModalView = styled.View`
                    margin: 20px;
                    backgroundColor: white;
                    borderRadius: 20px;
                    border-width: 2px;
                    padding: 35px;
                    alignItems: center;
                    shadowColor: #000;
                    `;

const CloseModal = styled.TouchableOpacity`
                    position : absolute;
                    top:10px;
                    right:50px;
                    `;
