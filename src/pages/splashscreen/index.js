import { ImageBackground, StyleSheet, Text, View,Dimensions, Image } from 'react-native'
import React from 'react'
import { logosplash, splashscreen } from '../../assets'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'

const Splashscreen = ({navigation}) => {
    const [timePassed, setTimePassed] = useState(false);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };
    const [Oriented, setOriented] = useState(isPortrait() ? 'portrait' : 'landscape');

   
    Dimensions.addEventListener('change', () => {
     setOriented(isPortrait() ? 'portrait' : 'landscape');
    });
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
    <View style={{height:Dimensions.get('window').height,flex:1}}>
      <ImageBackground source={splashscreen} style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems:'center',justifyContent:'center'}}>
        <Image source={logosplash} style={{marginHorizontal:12,width:Oriented=='portrait'?Dimensions.get('screen').width*0.9:Dimensions.get('screen').width*0.28,height:Oriented=='portrait'?Dimensions.get('screen').height*0.42:Dimensions.get('screen').height*0.7}}/>
        <Text style={{marginTop:16,fontSize:Oriented=='portrait'?42:22,color:'#fff',fontFamily:'InknutAntiqua-Regular'}}>Wijaya POS</Text>
    

        </View>
      </ImageBackground>
    </View>
  )
}

export default Splashscreen

const styles = StyleSheet.create({})