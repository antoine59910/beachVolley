import React from 'react';
import styled from 'styled-components'
import { useFormikContext } from 'formik'
import { Toast } from 'native-base';

import Text from '../Text';
import FormikArrayInput from '../formik/FormikArrayInput';


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
            <FormikArrayInput
                arrayName="equipe"
                placeholderName="Joueur"
                addItem={helpers => addPlayer(helpers)}
                removeItem={helpers => removePlayer(helpers)}
            />
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

const ButtonsContainer = styled.View`
    margin-top : 30px;
    margin-bottom : 50px;
    justify-content : space-between;
    flex-direction: row;
`;

const ButtonSupprimer = styled.TouchableOpacity`
    background-color: #EA4335;
    width : 120px;
    border-radius: 50px;
    flex:1;
    margin : 15px;
`;

const ButtonValider = styled.TouchableOpacity`
    background-color: #34A853;
    width : 120px;
    border-radius: 50px;
    flex:1;
    margin : 15px;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "large",
}))``;