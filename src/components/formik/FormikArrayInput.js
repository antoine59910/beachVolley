import FormTextInput from "./FormTextInput";
import React, { useContext } from 'react';
import { useFormikContext, FieldArray } from 'formik';

import { UserContext } from '../../context/UserContext';


export default function ArrayInput({
    arrayName,
    placeholderName,
    addItem,
    removeItem,
}) {
    const { values } = useFormikContext();
    const [user, setUser] = useContext(UserContext)

    return (
        <FieldArray
            name={arrayName}
            render={arrayHelpers => (
                <>
                    {
                        values[arrayName].map((competitor, index) => {
                            if (index == 0 && user.authorization != "administrator")
                                return (
                                    <FormTextInput
                                        key={index}
                                        fieldName={`${arrayName}[${index}]`}
                                        label={`${placeholderName} ${index + 1}`}
                                        editable={false}
                                    />
                                )
                            return (
                                <FormTextInput
                                    key={index}
                                    fieldName={`${arrayName}[${index}]`}
                                    label={`${placeholderName} ${index + 1}`}
                                />)
                        })
                    }
                    {/* <Button onPress={() => addItem(arrayHelpers)} title="+" />
                    <Button onPress={() => removeItem(arrayHelpers)} title="-" /> */}
                </>
            )} />
    )
}