import React, { useState, useContext } from 'react'
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
        <Container>
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
                    />
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

            <StatusBar barStyle="light-content" />
        </Container>
    )
}

export default SignInScreen

const Container = styled.ScrollView`
    flex:1;
`;

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
