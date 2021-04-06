import FormTextInput from "./FormTextInput";
import React from 'react';
import { useFormikContext, FieldArray } from 'formik';
import { View, Button } from 'react-native'


export default function ArrayInput({
    arrayName,
    placeholderName,
    addItem,
    removeItem,
}) {
    const { values } = useFormikContext();

    return (
        <FieldArray
            name={arrayName}
            render={arrayHelpers => (
                <>
                    {
                        values[arrayName].map((competitor, index) => (
                            <FormTextInput
                                key={index}
                                fieldName={`${arrayName}[${index}]`}
                                label={`${placeholderName} ${index + 1}`}
                            />
                        ))}
                    {/* <Button onPress={() => addItem(arrayHelpers)} title="+" />
                    <Button onPress={() => removeItem(arrayHelpers)} title="-" /> */}
                </>
            )} />
    )
}