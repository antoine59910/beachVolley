import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { StatusBar } from 'react-native'
import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FireBaseContext'

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

const db = firebase.firestore()


const LoadingScreen = () => {
    const [_, setUser] = useContext(UserContext)
    const firebaseContext = useContext(FirebaseContext)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setTimeout(async () => {
                    const user = await firebaseContext.getCurrentUser()

                    if (user) {
                        const userInfo = await firebaseContext.getUserInfo(user.uid)

                        setUser({
                            isLoggedIn: true,
                            email: userInfo.email,
                            uid: user.uid,
                            username: userInfo.username,
                            profilePhotoUrl: userInfo.profilePhotoUrl,
                            authorization: userInfo.authorization,
                            level: userInfo.level,
                            stars:userInfo.stars||0,
                            champion:userInfo.champion||"",
                            title: userInfo.title||"",
                        })
                    }
                    else {
                        setUser((state) => ({ ...state, isLoggedIn: false }))
                    }
                }, 500)
            }
            else {
                setUser((state) => ({ ...state, isLoggedIn: false }))
            }

        })
    }, [])


    return (
        <Container>
            <StatusBar />
            <Logo source={require('../../assets/icon.png')} />
        </Container>
    )
}

export default LoadingScreen

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const Logo = styled.Image`
    max-width:100%;
    height:auto;
`;