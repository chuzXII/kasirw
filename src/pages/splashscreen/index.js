import { ImageBackground, StyleSheet, Text, View,Dimensions, Image } from 'react-native'
import React from 'react'
import { logosplash, splashscreen } from '../../assets'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'

const Splashscreen = ({navigation}) => {
    const [timePassed, setTimePassed] = useState(false);
    const get=async()=>{
        const cek = await AsyncStorage.getItem('TokenSheet')
       
            if(cek){
                setTimeout(()=>{
                    navigation.replace('Routestack')
                },3000)
            }
            else{
                setTimeout(()=>{
                    navigation.replace('GuidePage')
                },3000)
            }
      

       
        
       
    }
    useEffect(()=>{
        get()
    },[])
  return (
    <View style={{height:Dimensions.get('screen').height}}>
      <ImageBackground source={splashscreen} style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems:'center',justifyContent:'center'}}>
        <Image source={logosplash}/>
        <Text style={{marginTop:16,fontSize:42,color:'#fff',fontFamily:'InknutAntiqua-Regular'}}>Chill POS</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Splashscreen

const styles = StyleSheet.create({})