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
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import 'react-native-reanimated';



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
      await AsyncStorage.setItem('usergooglesignin', JSON.stringify(user.user))

      const address = await AsyncStorage.getItem('bltaddress');
      if (address != null || address != '') {
        Activasionblt(address)
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        RNRestart.Restart()
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
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
  const Permassion = async () => {
    try {
      let isPermitedLocation = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (Platform.Version >= 31) {
        let isPermitedBluetooth = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        do {
          const grant = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          ]).then(result => {
            if (
              result['android.permission.ACCESS_FINE_LOCATION'] &&
              result['android.permission.BLUETOOTH_CONNECT'] &&
              result['android.permission.BLUETOOTH_SCAN'] &&
              result['android.permission.BLUETOOTH_ADVERTISE'] ===
              PermissionsAndroid.RESULTS.GRANTED
            ) {
              Activasionblt();
              isPermitedLocation = true;
              isPermitedBluetooth = true;
            } else {
              console.log('gagal');
            }
          });
        } while (!isPermitedLocation || !isPermitedBluetooth);
      } else {
        // if (!isPermitedExternalStorage) {
        // Ask for permission
        do {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]).then(result => {
            if (
              result['android.permission.ACCESS_FINE_LOCATION'] ===
              PermissionsAndroid.RESULTS.GRANTED
            ) {
              console.log('berhasil');
              Activasionblt();
              isPermitedLocation = true;
            } else {
              console.log('gagal');
            }
          });
          // break;
        } while (!isPermitedLocation);
      }
    } catch (e) {
      console.log('Error while checking permission');
      console.log(e);
    }
  };
  const Activasionblt = async (address) => {  
    if (address) {
      try {
        BluetoothManager.connect(address)
          .then(
            s => {
              console.log('Paired ' + s);
            },
            e => {
              console.log(JSON.stringify(e));
              alert(e);
            },
          )
      } catch (e) {
        console.log(e)
      }

    }
  };
  useEffect(() => {
    settoken()
  }, [])


  return (
    <Provider store={store}>

      <StatusBar backgroundColor={'#4D5AFF'} animated={true} barStyle="light-content" />
      <NavigationContainer >
        <Routes />
      </NavigationContainer>
    </Provider>

  )
}

export default App

const styles = StyleSheet.create({})