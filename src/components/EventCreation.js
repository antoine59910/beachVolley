// Formik x React Native example
import React, { useState, useContext } from 'react';
import styled from 'styled-components'
import Text from '../components/Text'
import { Form, Item, Input } from 'native-base';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { FirebaseContext } from '../context/FireBaseContext'
import { Formik } from 'formik';

const EventCreation = ({ navigation }) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedDate, setSelectedDate] = useState();
    const [numberOfTeams, setNumberOfTeams] = useState();
    const [playersByTeam, setPlayersByTeam] = useState();
    const [showCalendar, setShowCalendar] = useState(true)
    const [loading, setLoading] = useState(false)
    const firebase = useContext(FirebaseContext)


    const onDayPress = (newDate) => {
        setSelectedDate(newDate.dateString)
        setShowCalendar(false)
    }

    const onValiderPress = async () => {
        setLoading(true)
        await firebase.setEvent(title, description, selectedDate, playersByTeam, numberOfTeams)
        setLoading(false)
    }

    return (
        <Container>
            <Content>
                <Form>
                    <Field>
                        <Text large center>Titre</Text>
                        <Item rounded >
                            <Input
                                autofocus={true}
                                onChangeText={(text) => setTitle(text)}
                                value={title}
                            />
                        </Item>
                    </Field>

                    <Field>
                        <ButtonShowCalendar onPress={() => showCalendar ? setShowCalendar(false) : setShowCalendar(true)}>
                            <Text large center>Date</Text>
                            <Text large >{selectedDate && `${selectedDate.substr(8, 2)}/${selectedDate.substr(5, 2)}/${selectedDate.substr(0, 4)}`}</Text>
                        </ButtonShowCalendar>

                        {showCalendar &&
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
                        }
                    </Field>

                    <Field>
                        <Text large center>Nombre équipes</Text>
                        <Item rounded>
                            <Input
                                autofocus={true}
                                keyboardType="numeric"
                                onChangeText={(text) => setNumberOfTeams(text)}
                                value={numberOfTeams}
                            />
                        </Item>
                    </Field>

                    <Field>
                        <Text large center>Joueurs/équipe</Text>
                        <Item rounded >
                            <Input
                                keyboardType="numeric"
                                onChangeText={(text) => setPlayersByTeam(text)}
                                value={playersByTeam}
                            />
                        </Item>
                    </Field>

                    <Field>
                        <Text large center>Description</Text>
                        <Description>
                            <DescriptionInput
                                multiline={true}
                                numberOfLines={10}
                                onChangeText={(text) => setDescription(text)}
                                value={description}
                                underlineColorAndroid="transparent"
                            />
                        </Description>
                    </Field>

                    <ButtonsContainer>
                        <ButtonAnnuler onPress={() => navigation.goBack()}>
                            <Text center large color={"white"}>Annuler</Text>
                        </ButtonAnnuler>

                        <ButtonValider onPress={onValiderPress}
                            disabled={loading}
                        >
                            {
                                loading ?
                                    <Loading />
                                    : <Text center large color={"white"}>Valider</Text>
                            }

                        </ButtonValider>
                    </ButtonsContainer>
                </Form>
            </Content>
        </Container>
    )
};

export default EventCreation

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';


const Container = styled.ScrollView`
    flex:1;
    background-color: white
    padding : 20px;
`;

const Content = styled.View`
    justify-content: space-evenly;
`;

const ButtonShowCalendar = styled.TouchableOpacity`
    justify-content: center;
`;

const Description = styled.ScrollView`
    border-color: #DEDADF;
    border-width: 1px;
    border-radius : 25px;
    padding: 5px;
    margin: 5px;
`;

const DescriptionInput = styled.TextInput`
    height: 150px;
    justify-content: flex-start;
    align-items: flex-start;
`;

const Field = styled.View`
    margin : 10px;
`;

const ButtonsContainer = styled.View`
    margin-top : 30px;
    margin-bottom : 50px;
    justify-content : space-between;
    flex-direction: row;
`;


const ButtonValider = styled.TouchableOpacity`
    background-color: #34A853;
    width : 100px;
    border-radius: 50px;
`;

const ButtonAnnuler = styled.TouchableOpacity`
    background-color: #EA4335;
    width : 100px;
    border-radius: 50px;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "small",
}))``;