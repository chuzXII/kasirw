import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { bgdrawer } from '../../assets';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const CustomDrawer = props => {
  const [user,setUser] = useState({})
 
  const get=async()=>{
    const user= JSON.parse(await AsyncStorage.getItem('usergooglesignin'))
setUser(user)
  }
  useEffect(()=>{
    get()
  },[])
  return (
    <View style={{flex:1}}>
   
        <ImageBackground source={bgdrawer} style={{height:150,justifyContent:'center',}}>
          <View style={{alignItems:'center',flexDirection:'row'}}>
          <Image source={{uri:user.photo}} style={{height:65,width:65,borderRadius:50,marginLeft:12}}/>
          <View style={{marginLeft:12}}>
          <Text style={{color:'#fff',fontSize:18,fontFamily:'TitilliumWeb-Bold'}}>{user.name}</Text>
          <Text style={{color:'#fff',fontSize:14,fontFamily:'TitilliumWeb-Regular'}}>{user.email}</Text>
          </View>
          
          </View>
         

        </ImageBackground>
        

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{alignItems:'center',backgroundColor:'#27AE60'}}>
        <Text style={{color:'#fff',marginTop:8,fontWeight:'500',fontFamily:'TitilliumWeb-Bold'}}>Create By Me</Text>
        <Text style={{color:'#fff',marginBottom:8,fontWeight:'500',fontFamily:'TitilliumWeb-Bold'}}>Copyright@2022</Text>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
