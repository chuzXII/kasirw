import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
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
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import { emptyproduct } from '../../assets/image';

const ListKatalog = ({navigation}) => {
  const [Data, setData] = useState([]);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2,
  };

  const renderitem = (type, data, index) => {
    return (
      <View>
        <ItemKatalog
      item={data}
      // onLongPress={() => onLongPress(item[0])}
      onPress={() =>
        navigation.navigate('formedit', {id: data[0],data:data})
      }
    />
      </View>
    );
  };
  const layoutProvider = new LayoutProvider(
    () => 0,
    (type, dim) => {
      dim.width = Dwidth;
      dim.height = 100;
    },
  );
  const dataDataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(Data);

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
          setData(res.data.values);
          // setRefreshing(false);
          // setModalVisibleLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    get();
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
  }, [1]);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1,marginHorizontal:8}}>
      {Data == 0 ? (
          <View style={styles.imgContainerStyle}>
            <View style={styles.imgwarpStyle}>
              <Image style={styles.imageStyle} source={emptyproduct} />
            </View>
          </View>
        ) : (
      <RecyclerListView
        rowRenderer={(type, data, index) => renderitem(type, data, index)}
        dataProvider={dataDataProvider}
        layoutProvider={layoutProvider}
        style={{paddingTop:12}}

        // scrollViewProps={{
        //   refreshControl: (
        //     <RefreshControl
        //       refreshing={refreshing}
        //       onRefresh={onRefresh}
        //     />
        //   )
        // }}
      />)}
      </View>
       

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
const Dwidth = Dimensions.get('window').width;
const Dheight = Dimensions.get('window').height;
const styles = StyleSheet.create({});
