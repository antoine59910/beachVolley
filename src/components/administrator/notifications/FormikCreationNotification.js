import { useFormikContext } from 'formik';
import React from 'react';
import { Form } from 'native-base';
import styled from 'styled-components'

import FormTextInput from '../../formik/FormTextInput'
import FormikTextArea from '../../formik/FormikTextArea';
import { ROUGE, VERT, JAUNE } from '../../Color'
import Text from '../../Text';


const FormikCreationEvent = () => {
    const { submitForm } = useFormikContext();

    return (
        <>
            <Container>
                <Form style={{ padding: 20, flex: 1, marginBottom: 100 }}>
                    <FormTextInput fieldName="title" label="Titre" />
                    <FormikTextArea fieldName="description" label="Description" />
                </Form >
            </Container>
            <ButtonValiderContainer>
                <ButtonValider onPress={submitForm}>
                    <Text center large color={"white"}>Envoyer la notification</Text>
                </ButtonValider>
            </ButtonValiderContainer>

        </>
    )
}

export default FormikCreationEvent

const Container = styled.ScrollView`
    
`;

const ButtonValiderContainer = styled.View`
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
`