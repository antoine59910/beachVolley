import React, { useState, useContext, useEffect } from 'react'
import { Modal, SafeAreaView, View } from 'react-native'
import styled from 'styled-components'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import { Card, CardItem, Content } from 'native-base';

import { FirebaseContext } from '../context/FireBaseContext';
import { UserContext } from '../context/UserContext';
import Creneau from '../components/reservations/Creneau';
import { ROUGE, VERT, JAUNE, BLEU } from '../components/Color'
import { MINHOUR, MAXHOUR, LIMITE_RESERVATION_PAR_DAY, MIN_DAYS_RESERVATION, MAX_DAYS_RESERVATION } from '../config/parameters'
import Text from '../components/Text'
import Adhesion from '../components/reservations/Adhesion';

import firebase from 'firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const ReservationScreen = () => {

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [reservations, setReservations] = useState();
    const [loading, setLoading] = useState(false);
    const [creneaux, setCreneaux] = useState([]);
    const [onReservation, setOnReservation] = useState([]);
    const [limiteReservationParDay, setLimiteReservationParDay] = useState();
    const [reservationsCounterListener, setReservationsCounterListener] = useState()
    const [events, setEvents] = useState([]);
    const [cadenas, setCadenas] = useState({})
    const [message, setMessage] = useState({})
    const [cadenasListener, setCadenasListener] = useState()
    const [messageListener, setMessageListener] = useState()

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

    //MAJ temps réel si qqun modifie le code du cadenas
    useEffect(() => {
        const unscubscribeCadenas = db.collection('security')
            .doc('cadenas')
            .onSnapshot((snapshot) => {
                if (snapshot.exists)
                    setCadenasListener(snapshot.data())
            })

        return () => {
            unscubscribeCadenas()
        }
    }, [])

    //MAJ temps réel si qqun modifie le message
    useEffect(() => {
        const unscubscribeMessage = db.collection('security')
            .doc('message')
            .onSnapshot((snapshot) => {
                if (snapshot.exists)
                    setMessageListener(snapshot.data())
            })

        return () => {
            unscubscribeMessage()
        }
    }, [])

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

    //Lors d'un changement de date, lors d'une réservation de l'utilisateur ou lors d'une réservation d'un autre utilisateur : Récupération des réservations et MAJ des évènements
    useEffect(() => {
        const getReservationsOfTheDay = async () => {
            setLoading(true)
            setReservations(await firebase.getReservations(selectedDate))
            setLoading(false)
        }


        getReservationsOfTheDay()

    }, [selectedDate, onReservation, reservationsCounterListener])


    useEffect(() => {
        const getEvents = async () => {
            setEvents(await firebase.getEvents());
        }

        getEvents();
    }, [])

    //Récupération du code du cadenas
    useEffect(() => {
        const getCadenas = async () => {
            setCadenas(await firebase.getCadenas());
        }

        getCadenas();
    }, [cadenasListener])

    //Récupération du message
    useEffect(() => {
        const getMessage = async () => {
            setMessage(await firebase.getMessage());
        }

        getMessage();
    }, [messageListener])

    //Création/MAJ des créneaux : chgmnt de terrain ou les réservations ont étaient modifiées
    useEffect(() => {

        if (reservations) {
            setCreneaux([])
            for (let hour = MINHOUR; hour <= MAXHOUR; hour++) {
                const creneau = < Creneau
                    key={hour}
                    hour={hour}
                    onReservePress={onReservePress}
                    onDeletePress={onDeletePress}
                    limiteReservationParDay={limiteReservationParDay}
                    reservationsParHour={reservations.filter(element => element.heure == hour)}
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
                    reservationsParHour={[]}
                />
                setCreneaux(prevState => [...prevState, creneau])
            }
        }
    }, [reservations])

    //Lors d'un appui sur une date du calendrier
    const onDayPress = dateSelected => {
        setLoading(true);
        setShowCalendar(false);
        setSelectedDate(dateSelected.dateString)
        setLoading(false);
    };

    //Lors d'un appui pour réserver, on stock en BDD la réservation
    const onReservePress = async (hour, selectedField) => {

        const successOnCreateReservation = await firebase.setReservation(selectedDate, hour, selectedField, user.username, user.uid, user.profilePhotoUrl, user.level, user.stars, user.title, user.champion);

        //Vérification : Si OK on va récupérer les résas pour rafraichir l'écran.
        if (!successOnCreateReservation)
            alert("Problème lors de la réservation, veuillez réessayer plus tard");
        else
            setOnReservation(!onReservation)
    }

    // Lors d'un appui pour supprimé, on détruit la réservation en BDD
    const onDeletePress = async (hour) => {
        const successOnDeleteReservation = await firebase.deleteReservation(selectedDate, hour, user.username)
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
                                {message && <Text center medium style={{marginBottom: 10, marginTop:10}} heavy>{`${message.libelle}`}</Text>

                                }
                                {
                                    limiteReservationParDay && <Text center large color={ROUGE}>Limite de réservations du jour atteinte</Text>
                                }
                                {
                                    reservations &&
                                    reservations.filter(reservation => reservation.joueurId === user.uid).length > 0 &&
                                    <Text center large >{`Code cadenas : ${cadenas.code}`}</Text>
                                }
                                {events &&
                                    events.map(event => {
                                        if (event.date == selectedDate)
                                            return (<View key={event.id}>
                                                <Text center large>{event.titre}</Text>
                                            </View>
                                            )
                                    })
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
                        <Adhesion />
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
    flex-direction: row;
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

const Yesterday = styled.TouchableOpacity`
    z-index:1;
`

const Tomorrow = styled.TouchableOpacity`
    z-index:1;
    
`