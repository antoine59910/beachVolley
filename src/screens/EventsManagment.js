import React from 'react'
import styled from 'styled-components'
import Text from '../components/Text'
import { Ionicons } from '@expo/vector-icons';

import Event from '../components/Event'

const EventsManagment = ({ navigation }) => {

    const events = [
        {
            id: "azesqazeqsdd",
            titre: "Tournoi 2v2 mixte",
            date: "25 02 2021",
            maxEquipes: 8,
            nbEquipesInscrites: 3,
        },
        {
            id: "azesqd",
            titre: "Stage formation débutant",
            date: "23 02 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 5,
        },
        {
            id: "azessqxwcxcwd",
            titre: "Entrainement réceptions",
            date: "25 01 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 0,
        },
        {
            id: "azesqazeqsdd",
            titre: "Tournoi 2v2 mixte",
            date: "25 02 2021",
            maxEquipes: 8,
            nbEquipesInscrites: 3,
        },
        {
            id: "azesqd",
            titre: "Stage formation débutant",
            date: "23 02 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 5,
        },
        {
            id: "azessqxwcxcwd",
            titre: "Entrainement réceptions",
            date: "25 01 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 0,
        },
        {
            id: "azesqazeqsdd",
            titre: "Tournoi 2v2 mixte",
            date: "25 02 2021",
            maxEquipes: 8,
            nbEquipesInscrites: 3,
        },
        {
            id: "azesqd",
            titre: "Stage formation débutant",
            date: "23 02 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 5,
        },
        {
            id: "azessqxwcxcwd",
            titre: "Entrainement réceptions",
            date: "25 01 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 0,
        },
        {
            id: "azesqazeqsdd",
            titre: "Tournoi 2v2 mixte",
            date: "25 02 2021",
            maxEquipes: 8,
            nbEquipesInscrites: 3,
        },
        {
            id: "azesqd",
            titre: "Stage formation débutant",
            date: "23 02 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 5,
        },
        {
            id: "azessqxwcxcwd",
            titre: "Entrainement réceptions",
            date: "25 01 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 0,
        },
        {
            id: "azesqazeqsdd",
            titre: "Tournoi 2v2 mixte",
            date: "25 02 2021",
            maxEquipes: 8,
            nbEquipesInscrites: 3,
        },
        {
            id: "azesqd",
            titre: "Stage formation débutant",
            date: "23 02 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 5,
        },
        {
            id: "azessqxwcxcwd",
            titre: "Entrainement réceptions",
            date: "25 01 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 0,
        },
        {
            id: "azesqazeqsdd",
            titre: "Tournoi 2v2 mixte",
            date: "25 02 2021",
            maxEquipes: 8,
            nbEquipesInscrites: 3,
        },
        {
            id: "azesqd",
            titre: "Stage formation débutant",
            date: "23 02 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 5,
        },
        {
            id: "azessqxwcxcwd",
            titre: "Entrainement réceptions",
            date: "25 01 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 0,
        },
        {
            id: "azesqazeqsdd",
            titre: "Tournoi 2v2 mixte",
            date: "25 02 2021",
            maxEquipes: 8,
            nbEquipesInscrites: 3,
        },
        {
            id: "azesqd",
            titre: "Stage formation débutant",
            date: "23 02 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 5,
        },
        {
            id: "azessqxwcxcwd",
            titre: "Entrainement réceptions",
            date: "25 01 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 0,
        },
        {
            id: "azesqazeqsdd",
            titre: "Tournoi 2v2 mixte",
            date: "25 02 2021",
            maxEquipes: 8,
            nbEquipesInscrites: 3,
        },
        {
            id: "azesqd",
            titre: "Stage formation débutant",
            date: "23 02 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 5,
        },
        {
            id: "azessqxwcxcwd",
            titre: "Entrainement réceptions",
            date: "25 01 2021",
            maxEquipes: 5,
            nbEquipesInscrites: 0,
        },
    ]

    return (
        <Container>
            <Title>
                <Text title center semi>Gestion des évènements</Text>
            </Title>
            <EventsContainer>
                {
                    events.map((event, index) => <Event event={event} key={index} />)
                }
            </EventsContainer>

            <AjoutEvent onPress={() => navigation.navigate('eventCreation')}>
                <Ionicons name="add-circle" size={100} color="#4CD964" />
            </AjoutEvent>

        </Container >
    )
}

export default EventsManagment

const Container = styled.View`
    flex:1;
`;

const Title = styled.View`
    background-color: #FBBC05; 
`;

const EventsContainer = styled.ScrollView`
    flex:1;
    margin : 15px;
    background-color: white;
`;

const AjoutEvent = styled.TouchableOpacity`
    position : absolute;
    bottom:20px;
    right:20px;
    z-index:1;
`;