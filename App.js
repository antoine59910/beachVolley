import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { Root } from "native-base";//Permet d'avoir des toasts

import { UserProvider } from './src/context/UserContext'
import { FirebaseProvider } from './src/context/FireBaseContext'
import AppStackScreens from './src/stacks/AppStackScreens'


export default App = () => {
  return (
      <FirebaseProvider>
        <UserProvider>
          <NavigationContainer>
            <Root>
              <AppStackScreens />
            </Root>
          </NavigationContainer>
        </UserProvider>
      </FirebaseProvider>
  )
}