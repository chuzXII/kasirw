import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RNFS from 'react-native-fs';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ItemKatalog = ({item,...res}) => {
  return (
    <TouchableOpacity style={{backgroundColor: '#fff',borderRadius: 6,elevation:4}} {...res}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image
          source={{
            uri:
              'file://' +
              RNFS.DownloadDirectoryPath +
              '/dataimg/' +
              item.imgname+ '?' + new Date()
          }}
          style={{borderBottomLeftRadius:6,borderTopLeftRadius:6, height: 80,width:80}}
        />
        <View style={{flex:5,marginLeft:12}}>
          <Text style={{color:'#000',fontFamily:'TitilliumWeb-Bold'}}>{item.namaproduk}</Text>
          <Text style={{color:'#000',fontFamily:'TitilliumWeb-Light'}}>{item.deskproduk}</Text>
        </View>
        
        <View style={{marginRight:12}}>
        <Text style={{color:'#000',fontFamily:'TitilliumWeb-Regular'}}>Rp.{item.hargaproduk}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemKatalog;

const styles = StyleSheet.create({});
