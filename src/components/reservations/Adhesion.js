import React from 'react'
import styled from 'styled-components'
import { Dimensions, Linking } from 'react-native';

import { JAUNE } from '../Color'
import { URL_SITE_INTERNET_COMMENT_ADHERER} from '../../config/parameters'

import Text from '../Text'

const Adhesion = () => {
    
    return (
        <>
            <Text title heavy style={{ top: 10, left: 10 }}>Réservations</Text>
            <Container>
                <Text medium center>{`La réservation des terrains est uniquement autorisée aux membres du Beach Volley Vaucluse`}</Text>

                <CardPhotoContainer
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CardPhoto
                        source={require("../../../assets/carteAdhesion.png")}
                        style={{
                            width: Dimensions.get('window').width,
                        }}
                        resizeMode="contain"
                    />
                </CardPhotoContainer>

                <LinkURL onPress={() => Linking.openURL(URL_SITE_INTERNET_COMMENT_ADHERER)}>
                    <Text title center semi>Je souhaite m'inscrire</Text>
                </LinkURL>

            </Container>
        </>
    )
}

export default Adhesion


const Container = styled.ScrollView`
    flex: 1;
    margin-top: 40px;
`;

const CardPhotoContainer = styled.View`

`;

const CardPhoto = styled.Image`

`;

const LinkURL = styled.TouchableOpacity`
    background-color: ${JAUNE}
    border-radius: 20px;
    margin: 15px;
`;