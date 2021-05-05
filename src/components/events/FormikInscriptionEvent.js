import React from 'react';
import styled from 'styled-components'
import { useFormikContext } from 'formik'
import { Toast } from 'native-base';

import Text from '../Text';
import FormikArrayInput from '../formik/FormikArrayInput';
import {VERT, ROUGE, JAUNE} from '../Color'


const FormikCreationEvent = ({ loadingValidate, loadingDelete, equipeId, onDeletePress, eventId }) => {
    const { submitForm } = useFormikContext();

    const handleDeleteEvent = async () => {
        onDeletePress(eventId, equipeId)
    }

    const addPlayer = helpers => {
        helpers.push('');
    };

    const removePlayer = helpers => {
        helpers.pop();
    }

    return (
        <>
        <Form>
            <FormikArrayInput
                arrayName="equipe"
                placeholderName="Joueur"
                addItem={helpers => addPlayer(helpers)}
                removeItem={helpers => removePlayer(helpers)}
            />
        </Form>
            <ButtonsContainer>
                {
                    equipeId &&
                    <ButtonSupprimer onPress={handleDeleteEvent} disabled={loadingDelete}>
                        {loadingDelete ?
                            <Loading />
                            : <Text center large color={"white"}>Supprimer</Text>
                        }
                    </ButtonSupprimer>
                }

                <ButtonValider onPress={submitForm} disabled={loadingValidate}>
                    {loadingValidate ?
                        <Loading />
                        : equipeId ?
                            <Text center large color={"white"}>Modifier</Text>
                            : <Text center large color={"white"}>Valider</Text>
                    }

                </ButtonValider>
            </ButtonsContainer>
        </>
    )
}

export default FormikCreationEvent


const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "large",
}))``;

const Form = styled.ScrollView`
margin-bottom: 100px;`;


const ButtonsContainer = styled.View`
    position : absolute;
    bottom : 0px;
    z-index: 1;
    width : 100%;
    border-width : 0.2px;
    background-color: white;
    flex-direction:row;
    align-items:center;
`

const ButtonValider = styled.TouchableOpacity`
    flex:1;
    margin: 10px;
    padding : 20px;
    background-color: ${VERT};
    border-radius: 50px;
`;


const ButtonSupprimer = styled.TouchableOpacity`
flex:1;
margin: 10px;
padding : 20px;
background-color: ${ROUGE};
border-radius: 50px;
`;