import React, { useContext, useState } from 'react';
import styled from 'styled-components'
import { Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SafeAreaView, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { FirebaseContext } from '../context/FireBaseContext';
import FormikCreationEvent from '../components/administrator/events/FormikCreationEvent';
import Text from "../components/Text";
import { EVENTS_PICTURES } from '../config/parameters'
import { ROUGE, VERT, JAUNE, BLEU } from '../components/Color'
import { ScrollView } from 'react-native';


const EventCreationScreen = ({ route }) => {
    const [loadingValidate, setLoadingValidate] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [selectedPicture, setSelectedPicture] = useState("Autre")
    const firebase = useContext(FirebaseContext)
    const navigation = useNavigation();

    //Si c'est une modification
    const { titre, date, description, maxEquipes, joueurParEquipe, id } = route.params.event

    const initialValues = {
        title: titre || '',
        selectedDate: date || '',
        description: description || '',
        numberOfTeams: maxEquipes || '',
        playersByTeam: joueurParEquipe || '',
    }

    const ValidationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Required'),
        description: Yup.string(),
        selectedDate: Yup.string()
            .required('reaze'),
        numberOfTeams: Yup.string()
            .required('Required'),
        playersByTeam: Yup.string()
            .required('Required'),
    });

    const onValiderPress = async ({ ...values }) => {
        const { title, description, selectedDate, playersByTeam, numberOfTeams } = values
        let response = false
        setLoadingValidate(true)

        //Modification
        if (id) {
            response = await firebase.setEvent(title, description, selectedDate, playersByTeam, numberOfTeams,selectedPicture, id )
            if (response) {
                Toast.show({
                    text: "La modification de l'évènement a bien été prise en compte",
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }
            else {
                Toast.show({
                    text: 'Erreur lors de la modification',
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }
        }
        //Création
        else {
            response = await firebase.setEvent(title, description, selectedDate, playersByTeam, numberOfTeams, selectedPicture)
            if (response) {
                Toast.show({
                    text: "Evènement créé",
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }
            else {
                Toast.show({
                    text: 'Erreur lors de la création',
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }

        }


        setLoadingValidate(false)
        navigation.goBack();
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CloseModal onPress={() => navigation.goBack()}>
                <AntDesign name="closecircle" size={40} color="black" />
            </CloseModal>
            
            <Container
                keyboardShouldPersistTaps={'handled'}
            >
                <Text title heavy style={{ top: 20, left: 20, marginBottom: 50 }}>Création évènement</Text>
                <EventsTitleContainer>
                    {
                        EVENTS_PICTURES.map(eventPicture => {
                            return (

                                <EventTitleContainer
                                    color={selectedPicture === eventPicture ? VERT : JAUNE}
                                    onPress={() => setSelectedPicture(eventPicture)}
                                    disabled={selectedPicture === eventPicture}
                                    key={eventPicture}
                                >
                                    <Text color={selectedPicture === eventPicture ? "white" : null} medium>{eventPicture}</Text>
                                </EventTitleContainer>
                            )
                        })
                    }
                </EventsTitleContainer>
                {/* <PictureContainer>
                    {
                        selectedPicture === "Tournoi" ?
                            <Picture
                                source={require("../../assets/tournament.jpg")}
                            />
                            :
                            selectedPicture === "Entrainement" ?
                                <Picture
                                    source={require("../../assets/training.jpg")}
                                />
                                :
                                <Picture
                                    source={require("../../assets/eventPicture.jpg")}
                                />
                    }
                </PictureContainer> */}

                <Formik
                    initialValues={initialValues}
                    onSubmit={values => onValiderPress(values)}
                    validationSchema={ValidationSchema}
                    style={{ flex: 1 }}
                >
                    <>
                        <FormikCreationEvent
                            loadingValidate={loadingValidate}
                            loadingDelete={loadingDelete}
                            id={id}
                            onDeletePress={onDeletePress}
                        />
                    </>
                </Formik>

            </Container>
        </SafeAreaView>
    )
};

export default EventCreationScreen



const Container = styled.View`
    flex:1;
`;

const CloseModal = styled.TouchableOpacity`
    position : absolute;
    top:40px;
    right:20px;
    background-color: white;
    border-radius: 20px;
    z-index:1;
`;

const EventsTitleContainer = styled.View`
    flex-direction: row;
    justify-content: space-evenly;
`;

const EventTitleContainer = styled.TouchableOpacity`
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

const PictureContainer = styled.View`
`;

const Picture = styled.Image`
    height: ${432 * Dimensions.get('window').width / 750 / 2}px;
    width: ${Dimensions.get('window').width / 2}px;
    z-index: -100;
    margin-left:auto;
    margin-right:auto;
`;