import React, { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native'
import Text from '../components/Text'
import styled from 'styled-components'
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as Notifications from 'expo-notifications';

import FormikCreationNotification from '../components/administrator/notifications/FormikCreationNotification'



const notificationsManagment = () => {
    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    }, [])

    const initialValues = {
        title: '',
        description: '',
    }

    const ValidationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Required'),
        description: Yup.string(),
    });

    const onValiderPress = async ({ ...values }) => {
        console.log(expoPushToken)
        const { title, description } = values
        const message = {
            to: expoPushToken,
            sound: 'default',
            title,
            body: description,
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Text title heavy style={{ top: 20, left: 20 }}>Envoi de notification</Text>
            <Container>
                <Formik
                    initialValues={initialValues}
                    onSubmit={values => onValiderPress(values)}
                    validationSchema={ValidationSchema}
                    style={{ flex: 1 }}
                >

                    <FormikCreationNotification />

                </Formik>
            </Container>
        </SafeAreaView>

    )
}

export default notificationsManagment

const Container = styled.View`
    margin-top: 50px;
    flex:1;
`;

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}