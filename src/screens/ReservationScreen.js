import React, { useState, useContext, useEffect } from 'react'
import { Modal, SafeAreaView } from 'react-native'
import styled from 'styled-components'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import { Card, CardItem, Content } from 'native-base';

import { FirebaseContext } from '../context/FireBaseContext';
import { UserContext } from '../context/UserContext';
import Creneau from '../components/reservations/Creneau';
import { ROUGE, VERT, JAUNE } from '../components/Color'
import { MINHOUR, MAXHOUR, LIMITE_RESERVATION_PAR_DAY, MIN_DAYS_RESERVATION, MAX_DAYS_RESERVATION } from '../config/parameters'
import Text from '../components/Text'
import { TERRAINS } from '../config/parameters'

import firebase from 'firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const ReservationScreen = () => {

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [selectedField, setSelectedField] = useState("Terrain 1");
    const [reservations, setReservations] = useState();
    const [reservationsParField, setReservationsParField] = useState();
    const [loading, setLoading] = useState(false);
    const [creneaux, setCreneaux] = useState([]);
    const [onReservation, setOnReservation] = useState([]);
    const [limiteReservationParDay, setLimiteReservationParDay] = useState();
    const [blocages, setBlocages] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [reservationsCounterListener, setReservationsCounterListener] = useState()

    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);

    //MAJ temps réel si qqun fait une réservation
    useEffect(() => {
        const unscubscribe = db.collection('compteur-reservations')
            .doc(selectedDate)
            .onSnapshot((snapshot) => {
                if (snapshot.exists)
                    setReservationsCounterListener(snapshot.data())
            })

        return () => {
            unscubscribe()
        }
    }, [selectedDate])

    //Récupération des blocages au changement de date
    useEffect(() => {
        const getBlocage = async () => {
            if (selectedDate) {
                setBlocages(await firebase.getBlocage(selectedDate))
            }
        }

        getBlocage()
    }, [selectedDate])

    //Mise à jour du blocage en cas de changement
    useEffect(() => {
        setBlocked(false)

        if (blocages)
            blocages.map(
                (blocage, index) => {
                    switch (selectedField) {
                        case TERRAINS[0]:
                            if (blocage.terrain1)
                                setBlocked(true)
                            break;

                        case TERRAINS[1]:
                            if (blocage.terrain2)
                                setBlocked(true)
                            break;

                        case TERRAINS[2]:
                            if (blocage.terrain3)
                                setBlocked(true)
                            break;

                        default:
                            break;
                    }
                }
            )
    }, [selectedField, blocages])

    //Compte du nombre de réservations
    useEffect(() => {
        if (reservations)
            if (reservations.filter(reservation => reservation.joueurId === user.uid).length >= LIMITE_RESERVATION_PAR_DAY)
                setLimiteReservationParDay(true)
            else
                setLimiteReservationParDay(false)
        else
            setLimiteReservationParDay(false)

    }, [reservations])

    //Lors d'un changement de date : Récupération des réservations
    useEffect(() => {

        const getReservationsOfTheDay = async () => {
            setLoading(true)
            setReservations(await firebase.getReservations(selectedDate))
            setLoading(false)
        }

        getReservationsOfTheDay()
    }, [selectedDate, onReservation, reservationsCounterListener])

    //Quand changement de réservations : Filtre des résas en fonction du terrain
    useEffect(() => {

        if (reservations) {
            setReservationsParField(reservations.filter(element => element.terrain == selectedField))
        }
        else {
            setReservationsParField()
        }

    }, [reservations])

    //Lors d'un changement de terrain : filtre des réservations par terrain
    useEffect(() => {

        if (reservations)
            setReservationsParField(reservations.filter(element => element.terrain == selectedField))
    }, [selectedField])

    //Création/MAJ des créneaux : chgmnt de terrain ou les réservations ont étaient modifiées
    useEffect(() => {

        if (reservationsParField) {
            setCreneaux([])
            for (let hour = MINHOUR; hour <= MAXHOUR; hour++) {
                const creneau = < Creneau
                    key={hour}
                    hour={hour}
                    onReservePress={onReservePress}
                    onDeletePress={onDeletePress}
                    limiteReservationParDay={limiteReservationParDay}
                    reservationsParHourParField={reservationsParField.filter(element => element.heure == hour)}
                    blocked={blocked}
                />
                setCreneaux(prevState => [...prevState, creneau])
            }
        }
        else {
            setCreneaux([])
            for (let hour = MINHOUR; hour <= MAXHOUR; hour++) {
                const creneau = < Creneau
                    key={hour}
                    hour={hour}
                    onReservePress={onReservePress}
                    onDeletePress={onDeletePress}
                    reservationsParHourParField={[]}
                    blocked={blocked}
                />
                setCreneaux(prevState => [...prevState, creneau])
            }
        }
    }, [reservationsParField, selectedField, blocked])

    //Lors d'un appui sur une date du calendrier
    const onDayPress = dateSelected => {
        setLoading(true);
        setShowCalendar(false);
        setSelectedDate(dateSelected.dateString)
        setLoading(false);
    };

    //Lors d'un appui sur un Terrain, on change le terrain sélectionné
    const onFieldPress = (field) => {
        setSelectedField(field);
    }

    //Lors d'un appui pour réserver, on stock en BDD la réservation
    const onReservePress = async (hour) => {
        const successOnCreateReservation = await firebase.setReservation(selectedDate, hour, selectedField, user.username, user.uid, user.profilePhotoUrl, user.level);

        //Vérification : Si OK on va récupérer les résas pour rafraichir l'écran.
        if (!successOnCreateReservation)
            alert("Problème lors de la réservation, veuillez réessayer plus tard");
        else
            setOnReservation(!onReservation)
    }

    //Lors d'un appui pour supprimé, on détruit la réservation en BDD
    const onDeletePress = async (hour) => {
        const successOnDeleteReservation = await firebase.deleteReservation(selectedDate, hour, selectedField, user.username)
        if (!successOnDeleteReservation)
            alert("Problème lors de la suppression de la réservation")
        else
            setOnReservation(!onReservation)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Content padder>
                {
                    user.authorization ?
                        <>
                            <MainHeader>
                                <TopHeader>
                                    <LogoContainer>
                                        <Logo source={require('../../assets/logo.png')} />
                                    </LogoContainer>
                                    <ButtonContainer>
                                        <ButtonDate onPress={() => showCalendar ? setShowCalendar(false) : setShowCalendar(true)}>
                                            {selectedDate ?
                                                selectedDate === moment().format("YYYY-MM-DD") ?
                                                    <Text title >Aujourd'hui</Text>
                                                    : <Text title>{selectedDate.substr(8, 2)}/{selectedDate.substr(5, 2)}/{selectedDate.substr(0, 4)}</Text>
                                                : null
                                            }
                                        </ButtonDate>
                                    </ButtonContainer>
                                </TopHeader>
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
                                {
                                    limiteReservationParDay && <Text center large color={ROUGE}>Limite de réservations du jour atteinte</Text>
                                }
                            </MainHeader>

                            {
                                loading ?
                                    <Loading />
                                    :
                                    <BodyContainer>{creneaux}
                                    </BodyContainer>
                            }
                        </>
                        :
                        <Card>
                            <CardItem>
                                <Text medium>{`Veuillez vous rapprocher d'un administrateur de l'application afin de valider l'inscription\n\nSeul les membres validés par un administrateur peuvent réserver des terrains `}</Text>
                            </CardItem>
                        </Card>
                }
            </Content>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showCalendar}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setShowCalendar(!showCalendar);
                }}
            >
                <CenteredView>
                    <ModalView>
                        <CloseModal onPress={() => setShowCalendar(false)}>
                            <AntDesign name="closecircle" size={30} color="black" />
                        </CloseModal>
                        {
                            user.authorization === "administrator" ?
                                <Calendar
                                    maxDate={moment().add(MAX_DAYS_RESERVATION, 'days').format("YYYY-MM-DD")}
                                    onDayPress={onDayPress}
                                    firstDay={1}
                                    enableSwipeMonths={true}
                                    markedDates={{
                                        [selectedDate]: {
                                            selected: true,
                                            disableTouchEvent: true,
                                            selectedColor: '#FBBC05',
                                            selectedTextColor: 'white'
                                        }
                                    }}
                                />
                                : <Calendar
                                    minDate={moment().add(MIN_DAYS_RESERVATION, 'days').format("YYYY-MM-DD")}
                                    maxDate={moment().add(MAX_DAYS_RESERVATION, 'days').format("YYYY-MM-DD")}
                                    onDayPress={onDayPress}
                                    firstDay={1}
                                    enableSwipeMonths={true}
                                    markedDates={{
                                        [selectedDate]: {
                                            selected: true,
                                            disableTouchEvent: true,
                                            selectedColor: '#FBBC05',
                                            selectedTextColor: 'white'
                                        }
                                    }}
                                />
                        }

                    </ModalView>
                </CenteredView>
            </Modal>
        </SafeAreaView>
    )
}


export default (ReservationScreen)

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';



const MainHeader = styled.View`
    flex:1;
    margin-bottom: 20px;
`;

const TopHeader = styled.View`
    flex: 2;
    flex-direction: row;
    margin-bottom: 10px;
`;

const LogoContainer = styled.View`
    align-items: center;
    justify-content: center;
    flex : 1;
`;

const Logo = styled.Image`
    width : 100px;
    height: 100px;
`;

const ButtonContainer = styled.View`
    flex: 2;
`;

const ButtonDate = styled.TouchableOpacity`
    background-color: ${JAUNE};
    align-items: center;
    justify-content: center;
    flex: 0.75;
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 5px;
    margin-left: 5px;
    border-radius : 55px;
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
    border-radius: 25px;
    align-items: center;
    justify-content: center;
    height: 50px;
`;

const BodyContainer = styled.ScrollView`
    flex:3;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "#FBBC05",
    size: "large",
}))``;

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
    right:10px;
`;