import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView } from 'react-native'
import styled from 'styled-components'
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Content } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

import { FirebaseContext } from '../context/FireBaseContext';
import Text from '../components/Text'

const UsersManagmentScreen = () => {
    const firebase = useContext(FirebaseContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("")
    const [searchingUsers, setSearchingUsers] = useState([])
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        const getUsers = async () => {
            setUsers(await firebase.getUsers());
        }

        getUsers();
    }, [isFocused])

    useEffect(() => {
        if (users.length > 0 && search !== "") {
            setSearchingUsers(users.filter(user => user.username.toUpperCase().includes(search.toUpperCase())))
        }
        else {
            setSearchingUsers(users)
        }

    }, [search, users])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text title heavy style={{ top: 20, left: 20 }}>Gestion des joueurs</Text>

            <Content padder style={{marginTop: 40}}>

                <Text large center>Recherche joueur</Text>
                <Search>
                    <SearchInput
                        onChangeText={setSearch}
                        value={search}
                    />
                </Search>
                <DataContainer>
                    <Text large center>Joueurs inscrits : {users.filter(user => user.authorization).length}</Text>
                </DataContainer>

                <UsersContainer>

                    {
                        searchingUsers.map(user =>
                            <UserContainer
                                color={!user.authorization && "#EA4335"}
                                key={user.email}
                                onPress={() => navigation.navigate('userDetail', { user: user })}>
                                <ProfilePhotoContainer>
                                    <ProfilePhoto
                                        source={
                                            user.profilePhotoUrl === "default"
                                                ? require("../../assets/defaultProfilePhoto.jpg")
                                                : { uri: user.profilePhotoUrl }
                                        }
                                    />
                                </ProfilePhotoContainer>
                                <TextUserContainer>
                                <Text large>{user.username}</Text>
                                {user.authorization === "administrator" &&
                                    <Text color={"#34A853"}>Administrateur</Text>
                                }
                                </TextUserContainer>
                            </UserContainer>)
                    }
                </UsersContainer>

            </Content>
        </SafeAreaView>
    )
}

export default UsersManagmentScreen

const DataContainer = styled.View`
    margin-top : 16px;
    margin-bottom : 16px;
`;

const Search = styled.View`
    background-color:white;
    height: 40px;
    justify-content:center;
    margin: 5px;
    margin-bottom: 20px;
    border-radius: 20px;
`;

const SearchInput = styled.TextInput`
    margin-left: 15px;
`;

const UsersContainer = styled.ScrollView`

`;

const UserContainer = styled.TouchableOpacity`
    border-width: 0.5px;
    background-color: ${props => props.color || "white"};
    flex-direction:row;
    padding: 5px;
`;

const CloseModal = styled.TouchableOpacity`
    position : absolute;
    top:40px;
    right:20px;
    background-color: white;
    border-radius: 20px;
    z-index:1;
`;

const ProfilePhoto = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 64px;
`;

const ProfilePhotoContainer = styled.View`
    
`;

const TextUserContainer = styled.View`
justify-content:flex-start;
align-items:flex-start;
margin-left: 15px;
flex:1;
`;
