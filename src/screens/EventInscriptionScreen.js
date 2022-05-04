import React, { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup';
import styled from 'styled-components'
import { Formik } from 'formik'
import { Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

import Text from '../components/Text'
import FormikInscriptionEvent from '../components/events/FormikInscriptionEvent'
import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FireBaseContext';

const EventInscriptionScreen = ({ route }) => {
    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)
    const navigation = useNavigation();

    const [equipe, setEquipe] = useState([])
    const [loadingValidate, setLoadingValidate] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)


    const { id: equipeId, equipe: team } = route.params.inscription
    const { date, description, joueurParEquipe, maxEquipes, titre, nbEquipesInscrites, id } = route.params.event

    const placesRestantes = maxEquipes - nbEquipesInscrites;

    const validationSchema = Yup.object().shape({
        equipe: Yup.array()
            .of(Yup.string().required('Veuillez renseigner le nom du joueur'),
        ),
    });


    //CREATION / MODIFICATION D UNE INSCRIPTION
    const onValiderPress = async (values) => {
        const { equipe } = values
        let response = false
        //utilisé uniquement dans la création
        let newEvent = { ...route.params.event, nbEquipesInscrites: nbEquipesInscrites + 1 }

        setLoadingValidate(true)
        //Modification d'une inscription
        if (equipeId) {
            response = await firebase.updateInscription(id, equipe, equipeId)
            if (response) {
                Toast.show({
                    text: "Inscription modifiée",
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }
        }

        //Création d'une inscription
        else {
            response = await firebase.setInscription(id, equipe, user)

            if (response) {
                response = await firebase.updateEvent(id, newEvent)
            }

            if (response) {
                Toast.show({
                    text: "Inscription validée",
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }
        }

        setLoadingValidate(false)

        //Si modification, retour à l'écran du détail de l'évènement
        if (equipeId) {
            navigation.navigate('eventDetail')
        }
        //Si création, mise à jour du nombre d'inscrit
        else {
            navigation.navigate('eventDetail', { event: newEvent })
        }
    }

    //SUPPRESSION DE L INSCRIPTION A L EVENEMENT
    const onDeletePress = async (eventId, equipeId) => {
        let response = false

        setLoadingDelete(true)
        response = await firebase.deleteInscription(eventId, equipeId)

        let newEvent = { ...route.params.event, nbEquipesInscrites: nbEquipesInscrites - 1 }
        if (response) {
            response = await firebase.updateEvent(eventId, newEvent)
        }

        if (response) {
            Toast.show({
                text: "Inscription supprimée",
                textStyle: { textAlign: "center" },
                duration: 3000,
            })
        }
        else {
            Toast.show({
                text: "Erreur lors de la suppression de l'inscription",
                textStyle: { textAlign: "center", color: 'red' },
                duration: 3000,
            })
        }

        setLoadingDelete(false)
        navigation.navigate('eventDetail', { event: newEvent })
    }

    //Initialisation du tableau des joueurs
    useEffect(() => {
        if (equipeId)
            setEquipe(team)
        else {
            setEquipe([user.username])

            for (let i = 1; i < joueurParEquipe; i++) {
                setEquipe(prevState => [...prevState, ""])
            }
        }

    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
                        <CloseModal onPress={() => navigation.goBack()}>
                <AntDesign name="closecircle" size={40} color="black" />
            </CloseModal>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                    <Container
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <Title>
                        <Text title heavy style={{ top: 20, left: 20 }}>Inscription</Text>
                        </Title>
                        
                        <Formik
                            initialValues={{
                                equipe,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={values => onValiderPress(values)}
                            enableReinitialize={true}
                        >
                            <FormikInscriptionEvent
                                loadingValidate={loadingValidate}
                                loadingDelete={loadingDelete}
                                onDeletePress={onDeletePress}
                                equipeId={equipeId}
                                eventId={id}
                            />
                        </Formik>
                    </Container >
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EventInscriptionScreen


const Container = styled.View`
    flex: 1;
`;

const Title = styled.View`
    margin-bottom : 50px;
`;

const CloseModal = styled.TouchableOpacity`
    position : absolute;
    top:40px;
    right:20px;
    background-color: white;
    border-radius: 20px;
    z-index:1;
`;