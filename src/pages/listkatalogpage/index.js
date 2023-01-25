import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import dbConn from '../../sqlite';
import {useState} from 'react';
import ItemKatalog from '../../component/itemkatalog';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ListKatalog = ({navigation}) => {
  const [Data, setData] = useState([]);
  const isFocused = useIsFocused();

  const get = async () => {
    try {
      const sheetid = await AsyncStorage.getItem('TokenSheet');
      const token = await AsyncStorage.getItem('tokenAccess');
      await axios
        .get(
          'https://sheets.googleapis.com/v4/spreadsheets/' +
            sheetid +
            '/values/Sheet3',
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then(res => {
          if (res.data.values == undefined) {
            setData([]);
            // setRefreshing(false);
            // setModalVisibleLoading(false);
          } else {
            setData(res.data.values);
            // setRefreshing(false);
            // setModalVisibleLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const onpressdelete = id => {
    try {
      dbConn.transaction(tx => {
        tx.executeSql(
          'DELETE FROM produk WHERE id_produk=?',
          [id],
          (tr, result) => {
            if (result.rowsAffected > 0) {
              alert('Berhasil Menghapus');
            }
          },
        );
      });
    } catch (error) {
      console.log(er);
    }
  };
  const onLongPress = id => {
    Alert.alert(
      'Hapus',
      'Yakin Mau Mgrhapus Data',
      [
        {text: 'Cancel', onPress: () => console.log('cancel')},
        {text: 'OK', onPress: () => onpressdelete(id)},
      ],
      {cancelable: false},
    );
  };
  useEffect(() => {
    get();
  }, [isFocused]);
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1, marginHorizontal: 12}}>
        {Data.map((item, i) => {
          return (
            <View style={{marginVertical: 12}} key={i}>
              <ItemKatalog
                item={item}
                onLongPress={() => onLongPress(item[0])}
                onPress={() =>
                  navigation.navigate('formedit', {id: item[0],data:item})
                }
              />
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={{backgroundColor: '#9B5EFF', padding: 18, alignItems: 'center'}}
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
