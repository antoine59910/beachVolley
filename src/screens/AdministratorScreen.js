import React from 'react'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Text from '../components/Text'
import { JAUNE } from '../components/Color'

const Administrator = ({ navigation }) => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container>
                <Title>
                    <Text title center semi>Administration</Text>
                </Title>
                <ButtonsContainer>
                    <Button onPress={() => navigation.navigate('usersManagment')}>
                        <Text title>
                            {"   "}
                            <Ionicons name="people-sharp" size={40} color="black" />
                            {"   "}utilisateurs
                    </Text>
                    </Button>
                    <Button onPress={() => navigation.navigate('eventsManagment')}>
                        <Text title >
                            {"   "}
                            <FontAwesome name="trophy" size={40} color="black" />
                            {"   "}évènements

                    </Text>
                    </Button>
                    <Button onPress={() => navigation.navigate('fieldsManagment')}>
                        <Text title >
                            {"   "}
                            <MaterialCommunityIcons name="soccer-field" size={40} color="black" />
                            {"   "}terrains

                    </Text>
                    </Button>
                </ButtonsContainer>

            </Container>
        </SafeAreaView>
    )
}

export default Administrator

const Container = styled.View`
    flex: 1;
`;

const Title = styled.View`
    background-color: ${JAUNE}; 
`;

const ButtonsContainer = styled.View`
    flex:1;
    justify-content: space-evenly;
    align-items: center;
`;

const Button = styled.TouchableOpacity`
    background-color: ${JAUNE};
    width : 80%;
    height: 50px;
    border-radius: 25px;
    justify-content: space-evenly;
`;

