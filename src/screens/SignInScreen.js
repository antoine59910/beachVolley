import React, { useState, useContext } from 'react'
import { SafeAreaView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import styled from 'styled-components'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FireBaseContext'

import Text from '../components/Text'


const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const [_, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    const signIn = async () => {
        setLoading(true)

        try {
            await firebase.signIn(email, password);
            const uid = await firebase.getCurrentUser().uid;
            const userInfo = await firebase.getUserInfo(uid);

            setUser({
                username: userInfo.username,
                email: userInfo.email,
                uid,
                profilePhotoUrl: userInfo.profilePhotoUrl,
                isLoggedIn: true,
                authorization: userInfo.authorization,
                level: userInfo.level,
            })

        } catch (error) {
            alert(error.message)

        } finally {
            setLoading(false)
        }
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >               
                <LogoContainer>
                    <Logo 
                    source={require('../../assets/logo.png')} 
                    style={{
                        height: Dimensions.get('window').width/2,
                    }}
                    resizeMode="contain"/>
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
                            onSubmitEditing={signIn}
                        />
                    </AuthContainer>

                    <AuthContainer>
                        <AuthTitle>
                            <Text>Mot de passe</Text>
                        </AuthTitle>
                        <AuthField
                            autoCapitalize="none"
                            autoCompleteType="password"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text.trim())}
                            value={password}
                            onSubmitEditing={signIn}
                        />
                        <ForgottenPassword onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text small center>
                                <Text right color="#FBBC05" fontStyle="italic">
                                    Mot de passe oublié ?
                    </Text>
                            </Text>
                        </ForgottenPassword>
                    </AuthContainer>
                </Auth>


                <SignInContainer onPress={signIn} disabled={loading}>

                    {loading ?
                        (
                            <Loading />
                        ) : (
                            <Text bold center color="white">
                                Connexion
                            </Text>

                        )
                    }

                </SignInContainer>


                <SignUp onPress={() => navigation.navigate('SignUp')}>
                    <Text small center>
                        Pas encore inscrit ?{"  "}
                        <Text bold color="#FBBC05">
                            Inscription
                    </Text>
                    </Text>
                </SignUp>
                
                {/* <FacebookSignIn onPress={() => { console.log("ici") }}>
                    <SocialIcon
                        title='Se connecter avec facebook'
                        button
                        type='facebook'
                    />
                </FacebookSignIn>
                <GoogleSignIn>
                    <SocialIcon
                        title='Se connecter avec google'
                        button
                        type='google'
                    />
                </GoogleSignIn> */}
                
            </KeyboardAvoidingView>
            <StatusBar barStyle="light-content" />

        </SafeAreaView>
    )
}

export default SignInScreen

const LogoContainer = styled.View`
    align-items: center;
    justify-content: center;
    margin : 20px;
`;

const Logo = styled.Image`
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
    margin-bottom: 60px;
`;

const ForgottenPassword = styled.TouchableOpacity``;

const StatusBar = styled.StatusBar``;

const GoogleSignIn = styled.TouchableOpacity`
margin:auto
`;

const FacebookSignIn = styled.TouchableOpacity`
`;
