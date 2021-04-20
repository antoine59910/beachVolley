import React, { useContext } from 'react'
import { Dimensions, SafeAreaView } from 'react-native';
import styled from 'styled-components'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import openMap from 'react-native-open-maps';
import { useNavigation } from "@react-navigation/native";

import { UserContext } from '../context/UserContext';
import { FirebaseContext } from '../context/FireBaseContext';
import Text from '../components/Text';
import { JAUNE, VERT, ROUGE } from '../components/Color'

const ProfileScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const navigation = useNavigation();

    const logOut = async () => {
        const loggedOut = await firebase.logOut();

        if (loggedOut) {
            setUser((state) => ({ ...state, isLoggedIn: false }))
        }
    };

    const goToBeachClub = () => {
        openMap({
            latitude: 43.9674698,
            longitude: 4.8314312,
            provider: "google",
            travelType: "drive",
            end: "Beach+Club+Mangrove+Piscine",
        })
    }

    const handleOnModifyProfilPress = () => {
        navigation.navigate('ModifyProfile');
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                <Text large bold margin="16px">
                    {user.username}
                </Text>
                <Text medium bold margin="0 0 16px 0">
                    Niveau : {user.level}
                </Text>
                <ModifyProfil onPress={handleOnModifyProfilPress}>
                    <Text medium bold>
                        Modifier mon profil
                </Text>
                </ModifyProfil>
                <MainContainer>
                    <GoogleMapButton onPress={goToBeachClub}>
                        <GoogleMapImage source={require("../../assets/googleMaps.png")} />
                    </GoogleMapButton>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{
                            height: "100%",
                            width: Dimensions.get('window').width,
                        }}
                        initialRegion={{
                            latitude: 43.9674698,
                            longitude: 4.8314312,
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
                    <Text medium bold>
                        Se déconnecter
                </Text>
                </Logout>
            </Container>
        </SafeAreaView>
    )
}

export default ProfileScreen

const Container = styled.View`
    align-items: center;
    flex: 1;
    margin-top: 16px;
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
    border-width: 3px;
`

const Logout = styled.TouchableOpacity`
    margin-bottom:32px;
    margin-top:32px;
    background-color:${JAUNE};
    padding: 10px;
    border-radius: 10px;
`;

const ModifyProfil = styled.TouchableOpacity`
    margin-bottom:32px;
    margin-top:20px;
    background-color:${JAUNE};
    padding: 10px;
    border-radius: 10px;
`;

const GoogleMapButton = styled.TouchableOpacity`
    position: absolute;
    right: 0px;
    bottom: 0px;
    z-index:1;
`;

const GoogleMapImage = styled.Image`
    width : 100px;
    height: 100px;
`;