import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import Text from '../components/Text'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Content } from 'native-base';
import { Modal } from 'react-native'
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import { Card, CardItem } from 'native-base';

import { FirebaseContext } from '../context/FireBaseContext';
import { UserContext } from '../context/UserContext';
import Creneau from '../components/reservations/Creneau';
import { ROUGE, VERT, JAUNE } from '../components/Color'
import { MINHOUR, MAXHOUR, LIMITE_RESERVATION_PAR_DAY, MIN_DAYS_RESERVATION, MAX_DAYS_RESERVATION } from '../config/parameters'


const ReservationScreen = () => {

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [selectedField, setSelectedField] = useState("terrain 1");
    const [reservations, setReservations] = useState();
    const [reservationsParField, setReservationsParField] = useState();
    const [loading, setLoading] = useState(false);
    const [creneaux, setCreneaux] = useState([]);
    const [onReservation, setOnReservation] = useState([]);
    const [limiteReservationParDay, setLimiteReservationParDay] = useState();

    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);


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
        // console.log("selectedDate", selectedDate)
        const getReservationsOfTheDay = async () => {
            setLoading(true)
            setReservations(await firebase.getReservations(selectedDate))
            setLoading(false)
        }

        getReservationsOfTheDay()
    }, [selectedDate, onReservation])

    //Quand changement de réservations : Filtre des résas en fonction du terrain
    useEffect(() => {
        // console.log("reservations", reservations)
        if (reservations) {
            setReservationsParField(reservations.filter(element => element.terrain == selectedField))
        }
        else {
            setReservationsParField()
        }

    }, [reservations])

    //Lors d'un changement de terrain : filtre des réservations par terrain
    useEffect(() => {
        // console.log("selectedField", selectedField)
        if (reservations)
            setReservationsParField(reservations.filter(element => element.terrain == selectedField))
    }, [selectedField])

    //Création/MAJ des créneaux : chgmnt de terrain ou les réservations ont étaient modifiées
    useEffect(() => {
        // console.log("reservationsParField", reservationsParField)
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
                />
                setCreneaux(prevState => [...prevState, creneau])
            }
        }
    }, [reservationsParField, selectedField])

    //Lors d'un appui sur une date du calendrier
    const onDayPress = dateSelected => {
        setLoading(true);
        setShowCalendar(false);
        setSelectedDate(dateSelected.dateString)
        setLoading(false);
    };

    //Lors d'un appui sur un Terrain
    const onFieldPress = (field) => {
        setSelectedField(field);
    }

    //Lors d'un appui pour réserver
    const onReservePress = async (hour) => {
        const successOnCreateReservation = await firebase.setReservation(selectedDate, hour, selectedField, user.username, user.uid, user.profilePhotoUrl, user.level);

        //Vérification : Si OK on va récupérer les résas pour rafraichir l'écran.
        if (!successOnCreateReservation)
            alert("Problème lors de la réservation, veuillez réessayer plus tard");
        else
            setOnReservation(!onReservation)
    }

    const onDeletePress = async (hour) => {
        // console.log("OnDeletePress")
        const successOnDeleteReservation = await firebase.deleteReservation(selectedDate, hour, selectedField, user.username)
        if (!successOnDeleteReservation)
            alert("Problème lors de la suppression de la réservation")
        else
            setOnReservation(!onReservation)
    }

    return (
        <>
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
                                        <Field
                                            color={selectedField === "terrain 1" ? VERT : JAUNE}
                                            onPress={() => onFieldPress("terrain 1")}
                                            disabled={selectedField === "terrain 1" || loading}
                                        >
                                            <Text color={selectedField === "terrain 1" ? "white" : null} medium>Terrain 1</Text>
                                        </Field>

                                        <Field
                                            color={selectedField === "terrain 2" ? VERT : JAUNE}
                                            onPress={() => onFieldPress("terrain 2")}
                                            disabled={selectedField === "terrain 2" || loading}
                                        >
                                            <Text color={selectedField === "terrain 2" ? "white" : null} medium>Terrain 2</Text>
                                        </Field>

                                        <Field color={selectedField === "terrain 3" ? VERT : JAUNE}
                                            onPress={() => onFieldPress("terrain 3")}
                                            disabled={selectedField === "terrain 3" || loading}
                                        >
                                            <Text color={selectedField === "terrain 3" ? "white" : null} medium>Terrain 3</Text>
                                        </Field>

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
                        <Calendar
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
                    </ModalView>
                </CenteredView>
            </Modal>
        </>
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