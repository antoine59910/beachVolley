import React from 'react'
import { Form, Textarea, Item, Content } from 'native-base';
import Text from './Text'
import { useField } from 'formik'

const FormTextInput = ({ fieldName, label }) => {
    const [field, meta] = useField(fieldName)
    const error = meta.error && meta.touched;
    const success = !meta.error && meta.touched;

    return (
        <>
            <Text large>{label}</Text>
            <Item rounded error={error} success={success}>
                <Content padder>
                    <Form>
                        <Textarea
                            rowSpan={5}
                            value={field.value}
                            onChangeText={field.onChange(fieldName)}
                            onBlur={field.onBlur(fieldName)}
                        />
                    </Form>
                </Content>
            </Item>

        </>
    )
}

export default FormTextInput