import { useFormikContext } from 'formik';
import React from 'react';
import { Form } from 'native-base';
import styled from 'styled-components'


import FormikDatePicker from '../../formik/FormikDatePicker'
import FormTextInput from '../../formik/FormTextInput';
import FormikTextArea from '../../formik/FormikTextArea';
import { ROUGE, VERT, JAUNE } from '../../Color'
import Text from '../../Text';


const FormikCreationEvent = ({ loadingValidate, loadingDelete, id, onDeletePress }) => {
    const { submitForm } = useFormikContext();

    const handleDeleteEvent = async () => {
        onDeletePress(id)
    }

    return (
        <>
            <Container>
                <Form style={{ padding: 20, flex: 1, marginBottom:100 }}>
                    <FormTextInput fieldName="title" label="Titre" />
                    <FormikDatePicker fieldName="selectedDate" label="Date" />
                    <FormikTextArea fieldName="description" label="Description" />
                    <FormTextInput fieldName="numberOfTeams" label="Equipes au total" type="numeric" />
                    <FormTextInput fieldName="playersByTeam" label="Joueurs par équipe" type="numeric" />
                </Form >
            </Container>
            <ButtonValiderContainer>
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
                        : 
                            id ?
                            <Text center large color={"white"}>Modifier</Text>
                            : <Text center large color={"white"}>Créer l'évènement</Text>
                    }
                </ButtonValider>
            </ButtonValiderContainer>

        </>
    )
}

export default FormikCreationEvent

const Container = styled.ScrollView`
    
`;

const ButtonValiderContainer = styled.View`
    width : 100%;
    border-width : 0.2px;
    background-color: white;
    flex-direction:row;
    align-items:center;
`

const ButtonValider = styled.TouchableOpacity`
    flex:1;
    margin: 2px;
    padding : 2px;
    background-color: ${VERT};
    border-radius: 50px;
`;


const ButtonSupprimer = styled.TouchableOpacity`
    flex:1;
    margin: 2px;
    padding : 2px;
    background-color: ${ROUGE};
    border-radius: 50px;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "white",
    size: "small",
}))``;
