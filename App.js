import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'

import { UserProvider } from './src/context/UserContext'
import { FirebaseProvider } from './src/context/FireBaseContext'
import AppStackScreens from './src/stacks/AppStackScreens'
import Store from './src/redux/Store'

export default App = () => {
  return (
    <FirebaseProvider>
      <Provider store={Store}>
        <UserProvider>
          <NavigationContainer>
            <AppStackScreens />
          </NavigationContainer>
        </UserProvider>
      </Provider>
    </FirebaseProvider>
  )
}