import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import Text from '../components/Text'
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { FirebaseContext } from '../context/FireBaseContext';
import Creneau from '../components/Creneau'


const ReservationScreen = () => {
    const [selectedDate, setSelectedDate] = useState();
    const [loading, setLoading] = useState(false);
    const [creneaux, setCreneaux] = useState([]);
    const firebase = useContext(FirebaseContext);


    const minHour = 8;
    const maxHour = 21;


    //Lors d'un appui sur une date du calendrier, je récupère les réservations de la journée puis j'affiche les créneaux
    const onDayPress = async dateSelected => {

        setLoading(true);
        setSelectedDate(dateSelected.dateString)

        //Récupération des réservations de la journée
        const reservations = await firebase.getReservations(dateSelected.dateString)

        //Création des créneaux
        //Réinit
        setCreneaux([])
        for (let hour = minHour; hour <= maxHour; hour++) {
            const creneau = < Creneau
                key={hour}
                hour={hour}
                date={dateSelected.dateString}
                reservationsParHour={reservations ? reservations.filter(element => element.heure == hour) : null}
            />
            setCreneaux(prevState => [...prevState, creneau])

        }

        setLoading(false);
    };


    return (
        <Container>
            <Title>
                <Text title center semi>RESERVATIONS</Text>
            </Title>
            <CalendarContainer>
                <Calendar
                    minDate={Date()}
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
            </CalendarContainer>
            {
                selectedDate &&
                <>
                    <Text center large>Créneaux le {selectedDate}</Text>
                    {
                        loading ?
                            <Loading />
                            :
                            <CreneauxContainer>
                                {creneaux}
                            </CreneauxContainer>
                    }

                </>
            }

        </Container>
    )
}

export default ReservationScreen

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';


const Container = styled.View`
    flex:1;
`;

const Title = styled.View`
    background-color: #FBBC05; 
`;

const CalendarContainer = styled.View`

`;

const CreneauxContainer = styled.ScrollView`

`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "#FBBC05",
    size: "large",
}))``;