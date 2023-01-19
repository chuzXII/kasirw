import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  FlatList,
  Image,
  LogBox,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Cardcatalog from '../../component/CardCatalog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import dbConn from '../../sqlite';
import RNFS from 'react-native-fs';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {emptyproduct} from '../../assets/image';
import moment from 'moment';


const Dashboard = () => {
  const [item, setItems] = useState([]);
  const [Total, setTotal] = useState();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const CartReducer = useSelector(state => state.CartReducer);
  const currency = new Intl.NumberFormat('id-ID');


  const get = async () => {
    const rawdate = new Date()
    console.log(moment(rawdate).format('DD-MM-YY').split('-'))
    
    // await AsyncStorage.removeItem('iddiskon')
    // await AsyncStorage.removeItem('formdiskon')
    // await AsyncStorage.removeItem('cartt')
    // console.log(JSON.parse(await AsyncStorage.getItem('cartt')))

    // SQLite.DEBUG(true);
    // SQLite.enablePromise(false);
    try {
      dbConn.transaction(tx => {
        // tx.executeSql('DROP TABLE IF EXISTS produk')
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS produk(id_produk INTEGER PRIMARY KEY AUTOINCREMENT,namaproduk VARCHAR(100) NOT NULL,hargaproduk VARCHAR(50) NOT NULL,deskproduk VARCHAR(255) NOT NULL,imgname VARCHAR(255) NOT NULL);',
        );
      });
      dbConn.transaction(tx => {
        tx.executeSql('SELECT * FROM produk', [], (tr, result) => {
          // console.log('exe berhasil')
          var rows = result.rows;
          var total = 0;
          var data = [];
          for (let i = 0; i < rows.length; i++) {
            let item = rows.item(i);
            data.push(item);
            total += parseInt(data[i].hargaproduk);
          }
          setItems(data);
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onlongpress = () => {
    dispatch({type:'REMOVEALL'})
  };
  const renderitem=()=>{
    
  }

  useEffect(() => {
    get();
  }, [isFocused]);

  return (
    <View style={styles.wrap}>
      <ScrollView
        style={styles.ScrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.CardKatalog}>
          {item == 0 ? (
            <View style={styles.imgContainerStyle}>
              <View style={styles.imgwarpStyle}>
                <Image style={styles.imageStyle} source={emptyproduct} />
              </View>
            </View>
          ) : (item.map((itemw, i) => {
              return  (<View key={i}><Cardcatalog item={itemw} /></View> );
            })
          )}
        </View>
      </ScrollView>

      {CartReducer.cartitem.reduce((result, item) => item.count + result, 0) ? (
        <TouchableOpacity
          style={styles.buttonChart}
          onLongPress={() => onlongpress()}
          onPress={() => navigation.navigate('cartpage')}>
          <View style={styles.wrapChart}>
            <View style={styles.row}>
              {/* <Icart /> */}
              <Text style={styles.textButtonChart}>
                {currency.format(
                  CartReducer.cartitem.reduce(
                    (result, item) => item.count + result,
                    0,
                  ),
                )}{' '}
                items
              </Text>
            </View>
            <View>
              <Text style={styles.textButtonChart}>
                Bayar Rp.
                {currency.format(
                  CartReducer.cartitem.reduce(
                    (result, item) => item.count * item.subTotal + result,
                    0,
                  ),
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Dashboard;
const Dwidth = Dimensions.get('window').width;
const Dheight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 10,
    marginHorizontal: Dwidth * 0.02,
  },
  wrapCard: {
    marginHorizontal: 4.2,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#8C8C8C',
  },
  wrapImg: {
    width: Dwidth * 0.27,
    height: Dheight * 0.2,
    backgroundColor: '#A19A9A',
  },
  wrapHeadRiwayat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapContentCard: {
    marginHorizontal: 8,
  },
  wrapChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CardKatalog: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginHorizontal: Dwidth * 0.005,
  },
  ScrollView: {},

  textinputSearch: {
    marginRight: 2,
    paddingVertical: 2,
    paddingLeft: 14,
    flex: 1,
    borderWidth: 1.5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    fontSize: 14,
  },
  buttonOutline: {
    marginTop: 8,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonChart: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#18AECF',
    borderRadius: 15,
  },
  wrapTextTra: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  rowform: {
    flexDirection: 'row',
    flex: 1,
  },
  semiHeader: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  iconSearch: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  iconMenu: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  iconMoney: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },

  padding: {
    padding: 4,
  },

  fontHeader: {
    color: '#000',
    fontSize: 24,
    fontFamily: 'TitilliumWeb-Regular',
  },
  textButton: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'TitilliumWeb-Regular',
  },
  textButtonChart: {
    color: '#fff',
    fontSize: 22,
    fontWeight:'500',
    fontFamily: 'TitilliumWeb-Bold',
  },
  textTitle: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'TitilliumWeb-Regular',
  },
  textTgl: {
    color: '#000',
    fontSize: 13,

    fontFamily: 'TitilliumWeb-Regular',
  },
  textMD: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'TitilliumWeb-Regular',
    textAlign: 'right',
  },
  textGeneral: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'TitilliumWeb-Regular',
  },

  color: {
    color: '#000',
  },
  color2nd: {
    color: '#18AECF',
  },
  hairline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  imgContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgwarpStyle: {
    marginHorizontal: Dwidth * 0.06,
    marginTop: Dheight / 4.5,
    height: Dheight / 2.5,
    width: Dwidth / 1.2,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
  },
});
