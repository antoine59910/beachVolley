import React, { useContext, useState } from 'react'
import { Dimensions, SafeAreaView } from 'react-native';
import styled from 'styled-components'

import { FirebaseContext } from '../context/FireBaseContext'
import Text from '../components/Text'

const UserDetailScreen = ({ route }) => {
    const firebase = useContext(FirebaseContext)
    const [user, setUser] = useState(route.params.user)

    const inscription = async () => {
        try {
            const authorization = "inscrit"
            const updated = await firebase.updateAuthorization(user.uid, authorization)
            if (updated) {
                setUser({ ...user, authorization: "inscrit" })
            }
        } catch (error) {
            console.log("Error @inscription: ", error)
        }
    }

    const desincription = async () => {
        try {
            const authorization = ""
            const updated = await firebase.updateAuthorization(user.uid, authorization)
            if (updated) {
                setUser({ ...user, authorization: "" })
            }
        } catch (error) {
            console.log("Error @inscription: ", error)
        }
    }

    const setAdministrator = async () => {
        try {
            const authorization = "administrator"
            const updated = await firebase.updateAuthorization(user.uid, authorization)
            if (updated) {
                setUser({ ...user, authorization: "administrator" })
            }
        } catch (error) {
            console.log("Error @inscription: ", error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container>
                <Text large medium bold
                    margin="16px 0 32px 0"
                    color={!user.authorization ? "#EA4335" :
                        user.authorization == "administrator" ? "#34A853"
                            : null}>
                    {user.authorization ? user.authorization != "administrator" && "Joueur inscrit" : "Joueur non inscrit"}
                    {user.authorization === "administrator" && "Administrateur"}
                </Text>
                <ProfilePhotoContainer>
                    <ProfilePhoto
                        source={
                            user.profilePhotoUrl === "default"
                                ? require("../../assets/defaultProfilePhoto.jpg")
                                : { uri: user.profilePhotoUrl }
                        }
                    />
                </ProfilePhotoContainer>
                <Text large bold margin="16px 0 16px 0">
                    {user.username}
                </Text>
                <Text large medium bold margin="16px 0 16px 0">
                    {user.email}
                </Text>


                <Inscrire onPress={inscription}
                    style={{ width: Dimensions.get('window').width / 4 * 3 }}>
                    <Text large center>
                        Inscrire
                </Text>
                </Inscrire>

                <Desinscrire onPress={desincription}
                    style={{ width: Dimensions.get('window').width / 4 * 3 }}>
                    <Text large center>
                        Désinscrire
                </Text>
                </Desinscrire>

                <NommerAdministrateur onPress={setAdministrator}
                    style={{ width: Dimensions.get('window').width / 4 * 3 }}>
                    <Text large center>
                        Nommer Administrateur
                </Text>
                </NommerAdministrateur>

            </Container >
        </SafeAreaView>
    )
}

export default UserDetailScreen


const Container = styled.View`
    align-items: center;
    flex: 1;
`;

const ProfilePhotoContainer = styled.View`
    
`;

const ProfilePhoto = styled.Image`
    width: 128px;
    height: 128px;
    border-radius: 64px;
`;

const Inscrire = styled.TouchableOpacity`
    margin: 16px 0px 16px 0px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #34A853;
    border-radius: 6px;
`;

const Desinscrire = styled.TouchableOpacity`
margin: 16px 0px 16px 0px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #EA4335;
    border-radius: 6px;`;

const NommerAdministrateur = styled.TouchableOpacity`
margin: 16px 0px 16px 0px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #FBBC05;
    border-radius: 6px;
`;