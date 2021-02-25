import React, { useContext } from 'react'
import styled from 'styled-components'
import { Button } from 'react-native'

import { UserContext } from '../context/UserContext';
import { FirebaseContext } from '../context/FireBaseContext';
import Text from '../components/Text';



const ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);

    const logOut = async () => {
        const loggedOut = await firebase.logOut();

        if (loggedOut) {
            setUser((state) => ({ ...state, isLoggedIn: false }))
        }
    };


    return (
        <Container>
            <ProfilePhotoContainer>
                <ProfilePhoto
                    source={
                        user.profilePhotoUrl === "default"
                            ? require("../../assets/defaultProfilePhoto.jpg")
                            : { uri: user.profilePhotoUrl }
                    }
                />
            </ProfilePhotoContainer>
            <Text medium bold margin="16px 0 32px 0">
                {user.username}
            </Text>

            <MainContainer>

            </MainContainer>
            <Logout onPress={logOut}>
                <Text medium bold color="#23a8d9">
                    Se déconnecter
                </Text>
            </Logout>
        </Container>
    )
}

export default ProfileScreen

const Container = styled.View`
    align-items: center;
    margin-top: 64px;
    flex: 1;
`;

const ProfilePhotoContainer = styled.View`
    
`;

const ProfilePhoto = styled.Image`
    width: 128px;
    height: 128px;
    border-radius: 64px;
`;

const MainContainer = styled.View`
    flex: 1;
`

const Logout = styled.TouchableOpacity`
    margin-bottom:32px;
`;
