import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components'
import { Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Item, Input } from 'native-base';
import { SafeAreaView } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

import { FirebaseContext } from '../context/FireBaseContext';
import Text from '../components/Text';
import { TERRAINS } from '../config/parameters'
import { ROUGE, VERT, JAUNE } from '../components/Color'

const EventCreationScreen = ({ route }) => {
    const [loadingValidate, setLoadingValidate] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [selectedDate, setSelectedDate] = useState()
    const [field1Selected, setField1Selected] = useState(false)
    const [field2Selected, setField2Selected] = useState(false)
    const [field3Selected, setField3Selected] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const firebase = useContext(FirebaseContext)
    const navigation = useNavigation();


    const onValiderPress = async () => {
        if (selectedDate && (field1Selected || field2Selected || field3Selected)) {
            let response = false
            setLoadingValidate(true)
            response = await firebase.setBlocage(selectedDate, field1Selected, field2Selected, field3Selected)
            if (response) {
                Toast.show({
                    text: "Blocage créé",
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }
            else {
                Toast.show({
                    text: 'Erreur lors de la création du blocage',
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }
            setLoadingValidate(false)
            navigation.goBack();
        }
        else {
            alert("sélectionner au moins un terrain et une date")
        }

    }

    const onDeletePress = async (id) => {
        setLoadingDelete(true)

        const response = await firebase.deleteEvent(id)
        if (response) {
            Toast.show({
                text: "Evenement supprimé",
                textStyle: { textAlign: "center" },
                duration: 3000,
            })
        }
        else {
            Toast.show({
                text: "Erreur lors de la suppression de l'évènement",
                textStyle: { textAlign: "center", color: 'red' },
                duration: 3000,
            })
        }
        setLoadingDelete(false)

        navigation.goBack();
    }

    const onDayPress = selectedDate => {
        setSelectedDate(selectedDate.dateString)
        setShowCalendar(false)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CloseModal onPress={() => navigation.goBack()}>
                <AntDesign name="closecircle" size={40} color="black" />
            </CloseModal>
            <Container
                keyboardShouldPersistTaps={'handled'}
            >
                <ButtonShowCalendar onPress={() => showCalendar ? setShowCalendar(false) : setShowCalendar(true)}>
                    <Text large>Date</Text>

                    <Item rounded onPress={() => showCalendar ? setShowCalendar(false) : setShowCalendar(true)}>
                        <Input
                            value={selectedDate && `${selectedDate.substr(8, 2)}/${selectedDate.substr(5, 2)}/${selectedDate.substr(0, 4)}`}
                            disabled={true}
                        />
                    </Item>


                </ButtonShowCalendar>
                {showCalendar &&
                    <Calendar
                        minDate={Date()}
                        onDayPress={onDayPress}
                        firstDay={1}
                        enableSwipeMonths={true}
                    />
                }
                <FieldButtonsContainer>
                    <Text center large>Sélectionner les terrains à bloquer</Text>
                    <FieldButton
                        onPress={() => field1Selected ? setField1Selected(false) : setField1Selected(true)}
                        color={field1Selected && ROUGE}>
                        <Text center large color={field1Selected ? "white" : null}>Terrain 1</Text>
                    </FieldButton>

                    <FieldButton
                        onPress={() => field2Selected ? setField2Selected(false) : setField2Selected(true)}
                        color={field2Selected && ROUGE}>
                        <Text center large color={field2Selected ? "white" : null}>Terrain 2</Text>
                    </FieldButton>

                    <FieldButton
                        onPress={() => field3Selected ? setField3Selected(false) : setField3Selected(true)}
                        color={field3Selected && ROUGE}>
                        <Text center large color={field3Selected ? "white" : null}>Terrain 3</Text>
                    </FieldButton>

                </FieldButtonsContainer>

            </Container>
            <ButtonValiderContainer>
                <ButtonValider onPress={onValiderPress} disabled={loadingValidate}>
                    {loadingValidate ?
                        <Loading />
                        : <Text center large color={"white"}>Bloquer les terrains</Text>
                    }
                </ButtonValider>
            </ButtonValiderContainer>
        </SafeAreaView >
    )
};

export default EventCreationScreen



const Container = styled.ScrollView`
    flex:1;
    background-color: white
    padding : 20px;
`;

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const ButtonShowCalendar = styled.TouchableOpacity`
    justify-content: center;
`;


const FieldButtonsContainer = styled.View`
    justify-content : space-evenly;
    flex:1;
    margin-top: 30px;
`;

const FieldButton = styled.TouchableOpacity`
    margin:auto;
    width : 120px;
    background-color:${props => props.color || JAUNE}; 
    border-radius: 50px;
    flex:1;
    margin: auto;
    margin-top: 20px;
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
    background-color: ${VERT};
    border-radius: 50px;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "small",
}))``;

const CloseModal = styled.TouchableOpacity`
    position : absolute;
    top:40px;
    right:20px;
    background-color: white;
    border-radius: 20px;
    z-index:1;
`;