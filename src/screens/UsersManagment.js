import React, { useEffect, useState, useContext } from 'react'
import Text from '../components/Text'
import styled from 'styled-components'
import { useIsFocused } from "@react-navigation/native";

import { FirebaseContext } from '../context/FireBaseContext';

const UsersManagment = ({ navigation }) => {
    const firebase = useContext(FirebaseContext);
    const [users, setUsers] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getUsers = async () => {
            setUsers(await firebase.getUsers());
        }

        getUsers();
    }, [isFocused])

    return (
        <Container>
            <Title>
                <Text title center semi>Gestion des utilisateurs</Text>
            </Title>
            <DataContainer>
                <Text large center>Comptes : {users.length}</Text>
            </DataContainer>

            <UsersContainer>

                {
                    users.map(user =>
                        <UserContainer
                            color={!user.authorization && "#EA4335"}
                            key={user.email}
                            onPress={() => navigation.navigate('userDetail', { user: user })}>
                            <Text large>{user.username}</Text>
                            {user.authorization === "administrator" &&
                                <Text color={"#34A853"}>Administrateur</Text>
                            }
                        </UserContainer>)
                }
            </UsersContainer>
        </Container>
    )
}

export default UsersManagment

const Container = styled.View`
    flex:1;
`;

const Title = styled.View`
    background-color: #FBBC05; 
`;

const DataContainer = styled.View`
    margin-top : 16px;
    margin-bottom : 16px;
`;

const UsersContainer = styled.View`

`;

const UserContainer = styled.TouchableOpacity`
    border-width: 0.5px;
    background-color: ${props => props.color || "white"};
`;