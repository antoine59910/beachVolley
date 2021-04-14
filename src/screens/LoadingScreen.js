import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { StatusBar } from 'react-native'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FireBaseContext'

const LoadingScreen = () => {
    const [_, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        setTimeout(async () => {
            const user = await firebase.getCurrentUser()

            if (user) {
                const userInfo = await firebase.getUserInfo(user.uid)

                setUser({
                    isLoggedIn: true,
                    email: userInfo.email,
                    uid: user.uid,
                    username: userInfo.username,
                    profilePhotoUrl: userInfo.profilePhotoUrl,
                    authorization: userInfo.authorization,
                    level: userInfo.level,
                })
            }
            else {
                setUser((state) => ({ ...state, isLoggedIn: false }))
            }
        }, 500)

    }, [])

    return (
        <Container>
            <StatusBar />
            <Logo source={require('../../assets/logo.png')} />
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
    width : 300px;
    height: 300px;
`;