import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView } from 'react-native'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Toast } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

import { FirebaseContext } from '../context/FireBaseContext';
import Text from '../components/Text'
import { ROUGE, VERT, JAUNE } from '../components/Color'

const EventsManagmentScreen = () => {
    const firebase = useContext(FirebaseContext);
    const [blocages, setBlocages] = useState([]);
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const onPressDeleteBlocage = async (id) => {
        setLoading(true)

        const response = await firebase.deleteBlocage(id)
        if (response) {
            Toast.show({
                text: "Blocage supprimé",
                textStyle: { textAlign: "center" },
                duration: 3000,
            })
        }
        else {
            Toast.show({
                text: "Erreur lors de la suppression du blocage",
                textStyle: { textAlign: "center", color: 'red' },
                duration: 3000,
            })
        }
        setBlocages(await firebase.getBlocages());
        setLoading(false)
    }


    useEffect(() => {
        const getBlocages = async () => {
            setBlocages(await firebase.getBlocages());
        }

        getBlocages();
    }, [isFocused])


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text title heavy style={{ top: 20, left: 20 }}>Gestion des terrains</Text>
            <Container>

                <EventsContainer>

                    {blocages &&
                        blocages.map((blocage, index) => (
                            <BlocageContainer key={index}>
                                <Text large center>{blocage.dateDeBlocage.substr(8, 2)}/{blocage.dateDeBlocage.substr(5, 2)}/{blocage.dateDeBlocage.substr(0, 4)}</Text>
                                {
                                    blocage.terrain1 &&
                                    <Text large center >Terrain 1</Text>
                                }
                                {
                                    blocage.terrain2 &&
                                    <Text large center >Terrain 2</Text>
                                }
                                {
                                    blocage.terrain3 &&
                                    <Text large center >Terrain 3</Text>
                                }
                                <DeleteButton onPress={() => onPressDeleteBlocage(blocage.id)} disabled={loading}>
                                    <Text large center color="white">Supprimer</Text>
                                </DeleteButton>
                            </BlocageContainer>
                        )
                        )}
                </EventsContainer>

                {/* Nouvel évènement, on n'envoie vide en paramètre */}
                <AjoutEvent onPress={() => navigation.navigate('blocageCreation', { blocage: "" })}>
                    <Ionicons name="add-circle" size={100} color="#4CD964" />
                </AjoutEvent>

            </Container >
        </SafeAreaView>
    )
}

export default EventsManagmentScreen

const Container = styled.View`
    flex:1;
`;

const EventsContainer = styled.ScrollView`
    flex:1;
    margin : 15px;
    background-color: white;
    margin-top: 50px;
`;

const AjoutEvent = styled.TouchableOpacity`
    position : absolute;
    bottom:20px;
    right:20px;
`;

const BlocageContainer = styled.View`
    border-width: 0.5px;
    background-color: ${props => props.color || "white"};
    padding: 15px;
`;

const DeleteButton = styled.TouchableOpacity`
    background-color: ${ROUGE};
    border-radius: 25px;
    width: 50%;
    margin: auto;
`;