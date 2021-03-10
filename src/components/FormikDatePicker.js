import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Item, Icon, Input } from 'native-base';
import Text from './Text';
import moment from 'moment';
import styled from 'styled-components'

const FormikDatePicker = ({ fieldName, label }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(fieldName);
    const [showCalendar, setShowCalendar] = useState(false);
    const error = meta.error && meta.touched;
    const success = !meta.error && meta.touched;

    const onDayPress = selectedDate => {
        setFieldValue(fieldName, selectedDate.dateString)
        setShowCalendar(false)
    }

    return (
        <>
            <ButtonShowCalendar onPress={() => showCalendar ? setShowCalendar(false) : setShowCalendar(true)}>
                <Text large>{label}</Text>

                <Item rounded error={error} success={success}>
                    <Input
                        value={field.value && `${field.value.substr(8, 2)}/${field.value.substr(5, 2)}/${field.value.substr(0, 4)}`}
                        editable={false}
                    />
                    {error && <Icon name='close-circle' />}
                    {success && <Icon name='checkmark-circle' />}
                </Item>
            </ButtonShowCalendar>
            {showCalendar &&
                <Calendar
                    minDate={Date()}
                    onDayPress={onDayPress}
                    firstDay={1}
                    enableSwipeMonths={true}
                />
            }
        </>
    );
};

export default FormikDatePicker

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const ButtonShowCalendar = styled.TouchableOpacity`
    justify-content: center;
`;
