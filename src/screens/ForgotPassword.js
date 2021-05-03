import React, { useState, useContext } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FireBaseContext'

import Text from '../components/Text'


const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const [_, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    const passwordReinit = async() => {
        await firebase.setEmailReset(email)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <LogoContainer>
                    <Logo source={require('../../assets/logo.png')} />
                </LogoContainer>

                <Auth>
                    <AuthContainer>
                        <AuthTitle>
                            <Text>Adresse mail</Text>
                        </AuthTitle>
                        <AuthField
                            autoCapitalize="none"
                            autoCompleteType="email"
                            autoCorrect={false}
                            autofocus={true}
                            keyboardType="email-address"
                            onChangeText={(text) => setEmail(text.trim())}
                            value={email}
                        />
                    </AuthContainer>
                </Auth>


                <SignInContainer onPress={passwordReinit} disabled={loading}>

                    {loading ?
                        (
                            <Loading />
                        ) : (
                            <Text bold center color="white">
                                Réinitialiser le mot de passe
                            </Text>

                        )
                    }

                </SignInContainer>

                <SignUp onPress={() => navigation.navigate('SignIn')}>
                    <Text small center bold color="#FBBC05">
                            Retour écran de connexion
                    </Text>
                </SignUp>
                
            </KeyboardAvoidingView>
            <StatusBar barStyle="light-content" />

        </SafeAreaView>
    )

}
export default ForgotPassword


const LogoContainer = styled.View`
    align-items: center;
    justify-content: center;
    margin : 30px;
`;

const Logo = styled.Image`
    width : 200px;
    height: 200px;
`;

const Auth = styled.View`
    margin: 32px 32px 32px;
`;

const AuthContainer = styled.View`
    margin-bottom: 16px;
`;

const AuthTitle = styled(Text)`
    color: #8e93a1;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 300;
`;

const AuthField = styled.TextInput`
    border-bottom-color: #8e93a1;
    border-bottom-width: 0.5px;
    height: 48px;
`;

const SignInContainer = styled.TouchableOpacity`
    margin: 0 32px;
    height: 35px;
    align-items: center;
    justify-content: center;
    background-color: #FBBC05;
    border-radius: 6px;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "small",
}))``;

const SignUp = styled.TouchableOpacity`
    margin-top: 16px;

`;

const StatusBar = styled.StatusBar``;

