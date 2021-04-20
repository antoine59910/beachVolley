import React, { useState, useContext, useEffect } from 'react'
import { KeyboardAvoidingView, SafeAreaView, Platform } from 'react-native'
import styled from 'styled-components'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { Form, Item, Picker } from 'native-base';
import { useNavigation } from "@react-navigation/native";

import { FirebaseContext } from '../context/FireBaseContext'
import { UserContext } from '../context/UserContext'
import Text from '../components/Text'
import LevelsExplication from '../components/profile/LevelsExplication'

const SignUpScreen = () => {

    const [username, setUsername] = useState("");
    const [level, setLevel] = useState("")
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState("");
    const [showModal, setShowModal] = useState(false)

    const firebase = useContext(FirebaseContext)
    const [user, setUser] = useContext(UserContext)
    const navigation = useNavigation();

    //Initialisation
    useEffect(() => {
        setUsername(user.username)
        setLevel(user.level)
    }, [])

    useEffect(() => {
        setUser(prevState => ({ ...prevState, level }))
    }, [level])

    useEffect(() => {
        setUser(prevState => ({ ...prevState, profilePhoto }))
    }, [profilePhoto])

    useEffect(() => {
        setUser(prevState => ({ ...prevState, username }))
    }, [username])


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
            alert("La permission est requise pour accéder à vos images")

            return;
        }

        pickImage();
    };

    const modifyProfile = async () => {
        setLoading(true)

        try {
            const updatedUser = await firebase.updateUser(user)
            if (updatedUser) {
                setUser(updatedUser)
                navigation.goBack();
            }
        } catch (error) {
            alert(error)

        } finally {
            setLoading(false)
        }
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <Container>
                    <ClosePage onPress={() => navigation.goBack()}>
                        <AntDesign name="closecircle" size={40} color="black" />
                    </ClosePage>
                    <ProfilePhotoTitle>
                        <Text large light center >AVATAR</Text>
                    </ProfilePhotoTitle>
                    <ProfilePhotoContainer onPress={addProfilePhoto}>
                        <ProfilePhoto source={
                            profilePhoto ? { uri: profilePhoto }
                                :
                                user.profilePhotoUrl == "default"
                                    ? require("../../assets/defaultProfilePhoto.jpg")
                                    : { uri: user.profilePhotoUrl }
                        } />
                    </ProfilePhotoContainer>

                    <Auth>
                        <AuthContainer>
                            <AuthTitle>
                                <Text>Adresse mail</Text>
                            </AuthTitle>
                            <AuthField
                                autoCapitalize="none"
                                autoCompleteType="email"
                                autoCorrect={false}
                                keyboardType="email-address"
                                value={user.email}
                                editable={false}
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
                                value={user.email}
                                editable={false}
                            />
                        </AuthContainer>

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
                            <InformationTouchableOpacity onPress={() => setShowModal(true)}>
                                <AuthTitle>
                                    <Text><Ionicons name="information-circle-outline" size={24} color="black" />{` Niveau`}</Text>
                                </AuthTitle>
                            </InformationTouchableOpacity>

                            <Form>
                                <Item picker>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<AntDesign name="caretdown" size={24} color="black" />}
                                        placeholder="Niveau"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={level}
                                        onValueChange={(value) => setLevel(value)}
                                    >
                                        <Picker.Item label="Débutant" value="débutant" />
                                        <Picker.Item label="Intérmédiaire" value="intermédiaire" />
                                        <Picker.Item label="Confirmé" value="confirmé" />
                                        <Picker.Item label="Avancé" value="avancé" />
                                        <Picker.Item label="Expert" value="expert" />
                                    </Picker>
                                </Item>
                            </Form>
                        </AuthContainer>
                    </Auth>
                    <SignUpContainer onPress={modifyProfile} disabled={loading}>
                        {loading ?
                            (
                                <Loading />
                            ) : (
                                <Text bold center>
                                    Modifier mon profil
                                </Text>

                            )
                        }
                    </SignUpContainer>
                    <StatusBar barStyle="light-content" />
                </Container>
                <LevelsExplication
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            </KeyboardAvoidingView >
        </SafeAreaView >
    )
}

export default SignUpScreen

const Container = styled.ScrollView`
    flex:1;
`;

const ProfilePhotoTitle = styled.View`
    margin-top: 30px;
    margin-bottom: 10px;
`;

const ProfilePhotoContainer = styled.TouchableOpacity`
    align-items: center;
`;

const ProfilePhoto = styled.Image`
    width: 128px;
    height: 128px;
    border-radius: 64px;
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

const InformationTouchableOpacity = styled.TouchableOpacity`

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


const StatusBar = styled.StatusBar``;

const ClosePage = styled.TouchableOpacity`
    position : absolute;
    top:20px;
    right:20px;
    background-color: white;
    border-radius: 20px;
    z-index:1;
`;
