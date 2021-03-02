import React, { useContext } from 'react'
import styled from 'styled-components'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import openMap from 'react-native-open-maps';
import { Dimensions, Button } from 'react-native';

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

    const goToBeachClub = () => {
        openMap({
            latitude: 43.967993,
            longitude: 4.831655,
            provider: "google",
            // end: "Beach Club Mangrove Piscine",
            // navigate_mode: "navigate",
        })
    }

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
            <Button
                color={'#bdc3c7'}
                onPress={goToBeachClub}
                title="Click To Open Maps 🗺" />

            <MainContainer>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{
                        height: "100%",
                        width: Dimensions.get('window').width,
                    }}
                    initialRegion={{
                        latitude: 43.967467,
                        longitude: 4.831532,
                        latitudeDelta: 0.0622,
                        longitudeDelta: 0.0621,
                    }}
                >
                    <Marker
                        coordinate={
                            {
                                latitude: 43.967467,
                                longitude: 4.831532,
                            }
                        }
                        title={"Beach Volley Vaucluse"}
                        description={"Club de beach volley"}

                    />
                </MapView>
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
