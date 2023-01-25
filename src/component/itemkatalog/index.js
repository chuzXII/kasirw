import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RNFS from 'react-native-fs';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ItemKatalog = ({item,...res}) => {
  return (
    <TouchableOpacity style={{backgroundColor: '#fff',borderRadius: 6,elevation:4}} {...res}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
      {item[5]==undefined?item[1].split(' ').length<=1?
         <View style={{borderBottomLeftRadius:6,backgroundColor:'#252525',borderTopLeftRadius:6, height: 80,width:80,alignItems:'center',justifyContent:'center'}}>
         <Text style={{fontSize:32,fontWeight:'bold'}}>{item[1].slice(0,1).toUpperCase()+item[1].slice(1,2).toUpperCase()}</Text>
        </View>: <View style={{borderBottomLeftRadius:6,backgroundColor:'#252525',borderTopLeftRadius:6, height: 80,width:80,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:32,fontWeight:'bold'}}>{item[1].split(' ')[0].slice(0,1).toUpperCase()+item[1].split(' ')[1].slice(0,1).toUpperCase()}</Text>
        </View>:<Image  source={{uri:item[5]}} style={{flex:1,borderRadius: 6}}></Image> 
        }
        <View style={{flex:5,marginLeft:12}}>
          <Text style={{color:'#000',fontFamily:'TitilliumWeb-Bold'}}>{item[1]}</Text>
          <Text style={{color:'#000',fontFamily:'TitilliumWeb-Light'}}>Stok : {item[4]}</Text>
        </View>
        
        <View style={{marginRight:12}}>
        <Text style={{color:'#000',fontFamily:'TitilliumWeb-Regular'}}>Rp.{item[2]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemKatalog;

const styles = StyleSheet.create({});
