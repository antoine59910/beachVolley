import React, { useContext, useState } from 'react';
import styled from 'styled-components'
import { Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SafeAreaView } from 'react-native';

import { FirebaseContext } from '../context/FireBaseContext';
import FormikCreationEvent from '../components/administrator/events/FormikCreationEvent';

const EventCreationScreen = ({ route }) => {
    const [loadingValidate, setLoadingValidate] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
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
            response = await firebase.setEvent(title, description, selectedDate, playersByTeam, numberOfTeams, id)
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
            response = await firebase.setEvent(title, description, selectedDate, playersByTeam, numberOfTeams)
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
            <Container
                keyboardShouldPersistTaps={'handled'}
            >
                <Formik
                    initialValues={initialValues}
                    onSubmit={values => onValiderPress(values)}
                    validationSchema={ValidationSchema}
                >
                    <FormikCreationEvent
                        loadingValidate={loadingValidate}
                        loadingDelete={loadingDelete}
                        id={id}
                        onDeletePress={onDeletePress}
                    />
                </Formik>
            </Container>
        </SafeAreaView>
    )
};

export default EventCreationScreen



const Container = styled.ScrollView`
    flex:1;
    background-color: white
    padding : 20px;
`;