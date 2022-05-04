import React, { useContext, useState } from 'react'
import { Dimensions, SafeAreaView, Platform } from 'react-native';
import styled from 'styled-components'
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import { Toast } from 'native-base';
import { Form, Item, Picker, Content } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

import { FirebaseContext } from '../context/FireBaseContext'
import Text from '../components/Text'
import { ROUGE, VERT, JAUNE } from '../components/Color'

const UserDetailScreen = ({ route }) => {
    const firebase = useContext(FirebaseContext)
    const [user, setUser] = useState(route.params.user)
    const [level, setLevel] = useState("")
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation();


    const inscription = async () => {
        try {
            const authorization = "inscrit"
            const updated = await firebase.updateAuthorization(user.uid, authorization)
            if (updated) {
                setUser({ ...user, authorization: "inscrit" })
                navigation.goBack()
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
                navigation.goBack()
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
                navigation.goBack()
            }
        } catch (error) {
            console.log("Error @inscription: ", error)
        }
    }

    const deleteUser = async () => {
        try {
            const deleted = await firebase.deleteUser(user.uid)
            if (deleted) {
                setUser({ ...user, authorization: "administrator" })
                navigation.goBack()
                Toast.show({
                    text: "L'utilisateur a bien été supprimé",
                    textStyle: { textAlign: "center" },
                    duration: 3000,
                })
            }
        } catch (error) {
            console.log("Error @inscription: ", error)
        }
    }

    const modifyLevel = async (newLevel) => {
        setLevel(newLevel)
        setLoading(true)

        try {
            const updatedUser = await firebase.updateUser({ ...user, level: newLevel })
            if (updatedUser) {
                setUser(updatedUser)
            }
        } catch (error) {
            alert(error)

        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CloseModal onPress={() => navigation.goBack()}>
                <AntDesign name="closecircle" size={40} color="black" />
            </CloseModal>
            <Container>
                <ScrollView>
                    <Text large medium bold center
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

                    <Text title margin="16px 0 0 0" center>
                        {user.username}
                    </Text>

                    <Content>
                    <ItemPicker>
                        <Form>
                            <Item picker >
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<AntDesign name="caretdown" size={24} color="black" />}
                                    placeholder="Niveau"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={user.level}
                                    onValueChange={(value) => modifyLevel(value)}
                                >
                                    <Picker.Item label="Débutant" value="débutant" />
                                    <Picker.Item label="Intérmédiaire" value="intermédiaire" />
                                    <Picker.Item label="Confirmé" value="confirmé" />
                                    <Picker.Item label="Avancé" value="avancé" />
                                    <Picker.Item label="Expert" value="expert" />
                                </Picker>
                            </Item>
                        </Form>
                    </ItemPicker>
                    </Content>
                    
                    <Text large medium margin="15px 0 16px 0" color="gray" center>
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
                        <Text large center >
                            Nommer Administrateur
                        </Text>
                    </NommerAdministrateur>

                    <SupprimerUtilisateur onPress={deleteUser}
                        style={{ width: Dimensions.get('window').width / 4 * 3 }}>
                        <Text large center>
                            SUPPRESSION
                        </Text>
                    </SupprimerUtilisateur>
                </ScrollView>
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
    margin:auto;
`;

const ProfilePhoto = styled.Image`
    width: 256px;
    height: 256px;
    border-radius: 64px;
`;

const Inscrire = styled.TouchableOpacity`
    margin: auto;
    margin-bottom: 16px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #34A853;
    border-radius: 6px;
`;

const Desinscrire = styled.TouchableOpacity`
    margin: auto;
    margin-bottom: 16px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: orange;
    border-radius: 6px;`;

const NommerAdministrateur = styled.TouchableOpacity`
    margin: auto;
    margin-bottom: 16px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #3C7EF9;
    border-radius: 6px;
`;

const SupprimerUtilisateur = styled.TouchableOpacity`
    margin: auto;
    margin-bottom: 16px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: ${ROUGE};
    border-radius: 6px;
`;


const CloseModal = styled.TouchableOpacity`
    position : absolute;
    top:40px;
    right:20px;
    background-color: white;
    border-radius: 20px;
    z-index:1;
`;

const ItemPicker = Platform.OS === 'ios' ?
styled.View`
    align-items: center;
`
: styled.View`
`
;