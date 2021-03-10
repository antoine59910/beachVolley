import React from 'react'
import { Item, Input, Icon } from 'native-base';
import Text from './Text'
import { useField } from 'formik'

const FormTextInput = ({ fieldName, label, ...props }) => {
    const [field, meta] = useField(fieldName);
    const error = meta.error && meta.touched;
    const success = !meta.error && meta.touched;

    const { type } = props;

    return (
        <>
            <Text large>{label}</Text>
            <Item rounded error={error} success={success}>
                <Input
                    value={field.value}
                    onChangeText={field.onChange(fieldName)}
                    onBlur={field.onBlur(fieldName)}
                    keyboardType={type || "default"}
                />
                {error && <Icon name='close-circle' />}
                {success && <Icon name='checkmark-circle' />}
            </Item>
            {error && <Text center color="red">{meta.error}</Text>}
        </>
    )
}

export default FormTextInput