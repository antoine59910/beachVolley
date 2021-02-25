import React, { useState, useContext } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components'
import { AntDesign } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

import { FirebaseContext } from '../context/FireBaseContext'
import { UserContext } from '../context/UserContext'

import Text from '../components/Text'

const SignUpScreen = ({ navigation }) => {

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState();
    const firebase = useContext(FirebaseContext)
    const [_, setUser] = useContext(UserContext)

    const getPermission = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);

            return status;
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.cancelled) {
                setProfilePhoto(result.uri)
            }
        } catch (error) {
            console.log('Error @pickImage: ', error)
        }
    }


    const addProfilePhoto = async () => {
        const status = await getPermission()

        if (status !== "granted") {
            alert("We need permission to access your camera roll")

            return;
        }

        pickImage();
    };

    const signUp = async () => {
        setLoading(true)

        const user = { username, email, password, profilePhoto };

        try {
            const createdUser = await firebase.createUser(user)

            setUser({ ...createdUser, isLoggedIn: true })
        } catch (error) {
            console.log("Error @signup: ", error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>

            <Main>
                <Text title semi center>
                    Inscription
                </Text>
            </Main>
            <ProfilePhotoTitle>
                <Text large light center >AVATAR</Text>
            </ProfilePhotoTitle>
            <ProfilePhotoContainer onPress={addProfilePhoto}>

                {
                    profilePhoto ? (
                        <ProfilePhoto source={{ uri: profilePhoto }} />
                    ) : (
                            <DefaultProfilePhoto>

                                <AntDesign name="plus" size={24} color="white" />
                            </DefaultProfilePhoto>
                        )
                }
            </ProfilePhotoContainer>

            <Auth>
                <AuthContainer>
                    <AuthTitle>
                        <Text>Nom utilisateur</Text>
                    </AuthTitle>
                    <AuthField
                        autoCapitalize="none"
                        autoCorrect={false}
                        autofocus={true}
                        onChangeText={(username) => setUsername(username.trim())}
                        value={username}
                    />
                </AuthContainer>

                <AuthContainer>
                    <AuthTitle>
                        <Text>Adresse mail</Text>
                    </AuthTitle>
                    <AuthField
                        autoCapitalize="none"
                        autoCompleteType="email"
                        autoCorrect={false}
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
                        autoCapitalize="none" //N'écrit pas la première lettre en majuscule
                        autoCompleteType="password"
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text.trim())}
                        value={password}
                    />
                </AuthContainer>
            </Auth>

            <SignUpContainer onPress={signUp} disabled={loading}>
                {loading ?
                    (
                        <Loading />
                    ) : (
                        <Text bold center color="white">
                            S'enregistrer
                        </Text>

                    )
                }

            </SignUpContainer>

            <SignIn onPress={() => navigation.navigate('SignIn')}>
                <Text small center>
                    Déjà inscrit ?{"  "}
                    <Text bold color="#FBBC05">
                        Connexion
                    </Text>
                </Text>
            </SignIn>

            <StatusBar barStyle="light-content" />
        </Container>
    )
}

export default SignUpScreen

const Container = styled.View`
    flex:1;
`;

const Main = styled.View`
    margin-top: 30px;
`;

const ProfilePhotoTitle = styled.View`
    margin-top: 30px;
    margin-bottom: 10px;
`;

const ProfilePhotoContainer = styled.TouchableOpacity`
    background-color: #FDDA77;
    width: 100px;
    height: 100px;
    border-radius: 50px;
    align-self: center;
    overflow:hidden;
`;

const DefaultProfilePhoto = styled.View`
    align-items: center;
    justify-content: center;
    flex: 1;
`;

const ProfilePhoto = styled.Image`
    flex:1;
`;

const Auth = styled.View`
    margin: 40px 32px 32px;
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
    height: 35px;
`;

const SignUpContainer = styled.TouchableOpacity`
    margin: 0 32px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #FBBC05;
    border-radius: 6px;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "small",
}))``;

const SignIn = styled.TouchableOpacity`
    margin-top: 16px;

`;

const StatusBar = styled.StatusBar``;
