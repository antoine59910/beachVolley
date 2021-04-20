import { useFormikContext } from 'formik';
import React from 'react';
import { Form } from 'native-base';
import styled from 'styled-components'

import Text from '../../Text';
import FormikDatePicker from '../../formik/FormikDatePicker'
import FormTextInput from '../../formik/FormTextInput';
import FormikTextArea from '../../formik/FormikTextArea';
import { ROUGE, VERT, JAUNE } from '../../Color'

const FormikCreationEvent = ({ loadingValidate, loadingDelete, id, onDeletePress }) => {
    const { submitForm } = useFormikContext();

    const handleDeleteEvent = async () => {
        onDeletePress(id)
    }

    return (
        <Form>
            <FormTextInput fieldName="title" label="Titre" />
            <FormikDatePicker fieldName="selectedDate" label="Date" />
            <FormikTextArea fieldName="description" label="Description" />
            <FormTextInput fieldName="numberOfTeams" label="Equipes au total" type="numeric" />
            <FormTextInput fieldName="playersByTeam" label="Joueurs par équipe" type="numeric" />

            <ButtonsContainer>

                {
                    id &&
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
                        : id ?
                            <Text center large color={"white"}>Modifier</Text>
                            : <Text center large color={"white"}>Créer</Text>
                    }

                </ButtonValider>
            </ButtonsContainer>
        </Form >
    )
}

export default FormikCreationEvent


const ButtonsContainer = styled.View`
    margin-top : 30px;
    margin-bottom : 50px;
    justify-content : space-between;
    flex-direction: row;
`;


const ButtonValider = styled.TouchableOpacity`
    background-color: ${VERT};
    width : 120px;
    border-radius: 50px;
    flex:1;
    margin: auto;
`;

const ButtonSupprimer = styled.TouchableOpacity`
    background-color: ${ROUGE};
    width : 120px;
    border-radius: 50px;
    flex:1;
    margin: auto;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "small",
}))``;