import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import dbConn from '../../sqlite';
import {useState} from 'react';
import ItemKatalog from '../../component/itemkatalog';
import { useIsFocused } from '@react-navigation/native';

const ListKatalog = ({navigation}) => {
  const [Data, setData] = useState([]);
  const isFocused= useIsFocused()

  const get = () => {
    
    try {
      dbConn.transaction(tx => {
        tx.executeSql('SELECT * FROM produk', [], (tr, result) => {
          var rows = result.rows;
          var data = [];
          for (let i = 0; i < rows.length; i++) {
            let item = rows.item(i);
            data.push(item);
          }
          setData(data);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onpressdelete=(id)=>{
    try {
      dbConn.transaction(tx=>{
        tx.executeSql('DELETE FROM produk WHERE id_produk=?',[id],(tr, result) => {
          if (result.rowsAffected > 0) {
            alert('Berhasil Menghapus')
          }
        })
      })
    } catch (error) {
      console.log(er)
    }
   
  }
  const onLongPress = (id)=>{
    Alert.alert('Hapus','Yakin Mau Mgrhapus Data',[
      {text:'Cancel',onPress:()=>console.log('cancel')},
        {text:'OK',onPress:()=>onpressdelete(id)}
    ],{cancelable:false})
  }
  useEffect(() => {
    get();
  }, [isFocused,onpressdelete]);
  return (
    <View style={{flex:1}}>
 <ScrollView style={{flex:1,marginHorizontal:12}}>
      {Data.map((item, i) => {
        return(
        <View style={{marginVertical:12}} key={i}>
         <ItemKatalog item={item} onLongPress={()=>onLongPress(item.id_produk)} onPress={()=>navigation.navigate('formedit',{id:item.id_produk})}/>
        </View>
        )
      })}
    </ScrollView>
     <TouchableOpacity
     style={{backgroundColor: '#18AECF', padding: 18, alignItems: 'center'}}
     onPress={() => navigation.navigate('formkasir')}>
     <Text style={{color: '#fff', fontSize: 18, fontWeight: '500'}}>
       Tambah Katalog
     </Text>
   </TouchableOpacity>
    </View>
  );
};

export default ListKatalog;

const styles = StyleSheet.create({});
