import { StatusBar, StyleSheet, Text, View, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Routes from './routes'
import { Provider } from 'react-redux'
import { store } from './redux'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNRestart from 'react-native-restart';
import 'react-native-gesture-handler';



const App = () => {
  const token = async () => {
    try {
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

      if (!isPermitedExternalStorage) {
        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );


        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          settoken()
          console.log("Permission granted");
        } else {
          // Permission denied
          do {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
          } while (!isPermitedExternalStorage);
        }
      } else {
        settoken()
      }
    } catch (e) {
      console.log('Error while checking permission');
      console.log(e);

    }




  }
  const settoken = async () => {
    try {
      await GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
        // offlineAccess: true,
        // webClientId: '641860633048-0j7pkd8o67rqibpstbrua29b1hpt11jg.apps.googleusercontent.com'
      })
      const cek = await AsyncStorage.getItem('tokenAccess')
      const isSignedIn = await GoogleSignin.isSignedIn()
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn()
      const res = await GoogleSignin.getTokens()
      console.log(res)
      await AsyncStorage.setItem('tokenAccess', res.accessToken)
      const user = await GoogleSignin.getCurrentUser()
      await AsyncStorage.setItem('usergooglesignin',JSON.stringify(user.user))
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        RNRestart.Restart()
      }else if(error.code === statusCodes.SIGN_IN_REQUIRED){
        await GoogleSignin.signIn()
      }
      else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('sign progress')
      }
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated')
        // play services not available or outdated
      }
      else {
        RNRestart.Restart()
        console.log(error)
        console.log(error.code)

      }
    }
  }
  useEffect(() => {
    token()
  }, [])


  return (
    <Provider store={store}>
      
      <StatusBar backgroundColor={'#53DE35'} animated={true} barStyle="dark-content" />
      <NavigationContainer >
        <Routes />
      </NavigationContainer>
    </Provider>

  )
}

export default App

const styles = StyleSheet.create({})