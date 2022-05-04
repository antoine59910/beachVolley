import React, { useContext } from 'react'
import { Dimensions, SafeAreaView, Linking } from 'react-native';
import styled from 'styled-components'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import openMap from 'react-native-open-maps';
import { useNavigation } from "@react-navigation/native";
import moment from 'moment';

import { UserContext } from '../context/UserContext';
import { FirebaseContext } from '../context/FireBaseContext';
import Text from '../components/Text';
import { JAUNE, VERT, ROUGE } from '../components/Color'
import { URL_SITE_INTERNET, URL_GROUPE_FACEBOOK } from '../config/parameters'
import { ScrollView } from 'react-native-gesture-handler';

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
            <ScrollView>
                <ProfilePhotoContainer>
                    <ProfilePhoto
                        source={
                            user.profilePhotoUrl === "default"
                                ? require("../../assets/defaultProfilePhoto.jpg")
                                : { uri: user.profilePhotoUrl }
                        }
                    />
                </ProfilePhotoContainer>
                
                {user.authorization ?
                    <Text large margin="16px" color={VERT} center>
                        {"Membre saison "}
                        {moment().format("MM") < "06" ?
                            + moment().add(-1, 'years').format("YYYY") + "/" + moment().add(0, 'years').format("YYYY")
                            : moment().add(0, 'years').format("YYYY") + "/" + moment().add(1, 'years').format("YYYY")}
                    </Text>
                    :
                    <Text large margin="16px" color={ROUGE} center>
                        {"NON INSCRIT SAISON "}
                        {moment().format("MM") < "06" ?
                            + moment().add(-1, 'years').format("YYYY") + "/" + moment().add(0, 'years').format("YYYY")
                            : moment().add(0, 'years').format("YYYY") + "/" + moment().add(1, 'years').format("YYYY")}
                    </Text>
                }

                <Text large margin="0 0 16px 0" center>
                    {user.username}
                </Text>
                <Text medium margin="0 0 0px 0" center>
                    Niveau : {user.level}
                </Text>



                <ModifyProfil onPress={handleOnModifyProfilPress}>
                    <Text medium center>
                        Modifier mon profil
                    </Text>
                </ModifyProfil>

                <JoinFacebookGroup onPress={() => Linking.openURL(URL_GROUPE_FACEBOOK)}>
                    <Text medium center>
                        Groupe facebook
                    </Text>
                </JoinFacebookGroup>

                <GoToWebsite onPress={() => Linking.openURL(URL_SITE_INTERNET)}>
                    <Text medium center>
                        Site internet
                    </Text>
                </GoToWebsite>

                <GoToBeachClub onPress={goToBeachClub}>
                    <Text medium center>
                        GPS beachClub
                    </Text>
                </GoToBeachClub>

                {/* <MainContainer>
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
                </MainContainer> */}
                <Logout onPress={logOut}>
                    <Text medium center>
                        Se déconnecter
                    </Text>
                </Logout>
                </ScrollView>
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
    margin:auto;
`;

const ProfilePhoto = styled.Image`
    width: 256px;
    height: 256px;
    border-radius: 64px;
`;

const MainContainer = styled.View`
    flex: 1;
    border-width: 3px;
    margin-bottom: 0px;
`

const Logout = styled.TouchableOpacity`
    margin-bottom: 20px;
    margin-top: 20px;
    background-color:${JAUNE};
    padding: 10px;
    border-radius: 10px;
`;

const ModifyProfil = styled.TouchableOpacity`
    margin-bottom:2px;
    margin-top:20px;
    background-color:${JAUNE};
    padding: 10px;
    border-radius: 10px;
`;

const JoinFacebookGroup = styled.TouchableOpacity`
    margin-bottom:2px;
    margin-top:20px;
    background-color:${JAUNE};
    padding: 10px;
    border-radius: 10px;
`;

const GoToWebsite = styled.TouchableOpacity`
    margin-bottom:2px;
    margin-top:20px;
    background-color:${JAUNE};
    padding: 10px;
    border-radius: 10px;
`;

const GoToBeachClub = styled.TouchableOpacity`
    margin-bottom:2px;
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




