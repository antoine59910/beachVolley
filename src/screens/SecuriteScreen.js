import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from 'react-native';
import { Toast } from 'native-base';

import Text from '../components/Text'
import { JAUNE } from '../components/Color'
import { FirebaseContext } from '../context/FireBaseContext';


//Il faut terminer l'action modifier, le updateCadenas est déjà effectué sur firebaseContext
const SecuriteScreen = ({navigation}) => {
    const firebase = useContext(FirebaseContext);
    const [cadenas, setCadenas] = useState({})
    const [message, setMessage] = useState({});
    const isFocused = useIsFocused();

    useEffect(() => {
        const getCadenas = async () => {
            setCadenas(await firebase.getCadenas());
        }        
        const getMessage = async () => {
            setMessage(await firebase.getMessage());
        }

        getMessage();
        getCadenas();
    }, [isFocused])

    const updateCadenas = async() => {
        await firebase.updateCadenas(cadenas.code);
        navigation.goBack();
        Toast.show({
            text: "Code cadenas modifié",
            textStyle: { textAlign: "center" },
            duration: 3000,
        })
    }

    const updateMessage = async() => {
        await firebase.updateMessage(message.libelle);
        navigation.goBack();
        Toast.show({
            text: "Message modifié",
            textStyle: { textAlign: "center" },
            duration: 3000,
        })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text title heavy style={{ top: 20, left: 20 }}>Sécurité</Text>
            <Container>

                <CadenasContainer>
                    <Text large>{`Code cadenas :`}</Text>
                
                <AuthField
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(text) => setCadenas((state) => ({ ...state, code: text }))}
                            value={cadenas.code}
                            //onSubmitEditing={}
                        />
                <Button onPress={() => updateCadenas()}>
                    <Text large center>
                        modifier
                    </Text>
                </Button>
                </CadenasContainer>
               
                <MessageContainer>
                <Text large>{`Message :`}</Text>
                <AuthField
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(text) => setMessage((state) => ({ ...state, libelle: text }))}
                            value={message.libelle}
                            //onSubmitEditing={}
                        />
                <Button onPress={() => updateMessage()}>
                    <Text large center>
                        modifier
                    </Text>
                </Button>
                </MessageContainer>


            </Container>
        </SafeAreaView>
    );
};

export default SecuriteScreen;

const Container = styled.View`
    flex: 1;
`;

const CadenasContainer = styled.View`
    margin : 15px;
    margin-top: 50px;
    margin-left: auto;
    margin-right: auto;
`;

const Button = styled.TouchableOpacity`
    background-color: ${JAUNE};
    width : 40%;
    height: 30px;
    border-radius: 25px;
    margin-left: auto;
    margin-right: auto;
    margin-top:16px;
`;

const AuthField = styled.TextInput`
    border-bottom-color: #8e93a1;
    border-bottom-width: 0.5px;
    height: 48px;
`;

const MessageContainer = styled.View`
margin : 15px;
margin-top: 50px;
margin-left: auto;
margin-right: auto;
`;