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
  RefreshControl,
  ActivityIndicator,
  Modal,
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
import axios from 'axios';
import {
  DataProvider,
  GridLayoutManager,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview';

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [item, setItems] = useState([]);
  const [Total, setTotal] = useState();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const CartReducer = useSelector(state => state.CartReducer);
  const currency = new Intl.NumberFormat('id-ID');
  const [modalVisibleLoading, setModalVisibleLoading] = useState(false);
  const ViewTypes = {
    FIRST: 0,
    SECOND: 1,
    THIRD: 2,
    FOURTH: 3,
    FIVETH: 4,
    SIXTH: 5,
  };
  const layoutProvider = new LayoutProvider(
    index => {
      var a = item.filter(item => item[0] == index + 1);
      if (a[0][1].length >= 20 && a[0][1].length <= 21) {
        return ViewTypes.SECOND;
      } else if (a[0][1].length >= 22 && a[0][1].length <= 32) {
        return ViewTypes.THIRD;
      } else if (a[0][1].length >= 34) {
        return ViewTypes.FOURTH;
      } else {
        return ViewTypes.FIRST;
      }
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.FIRST:
          dim.width = Dwidth / 2.08;
          dim.height = 260;
          break;
        case ViewTypes.SECOND:
          dim.width = Dwidth / 2.08;
          dim.height = 245;
          break;
        case ViewTypes.THIRD:
          dim.width = Dwidth / 2.08;
          dim.height = 280;
          break;
        case ViewTypes.FOURTH:
          dim.width = Dwidth / 2.08;
          dim.height = 300;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );
  const dataDataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(item);

  const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };
  const [Oriented, setOriented] = useState(
    isPortrait() ? 'portrait' : 'landscape',
  );

  Dimensions.addEventListener('change', () => {
    setOriented(isPortrait() ? 'portrait' : 'landscape');
  });

  const get = async () => {
    setModalVisibleLoading(true);
    try {
      // dbConn.transaction(tx => {
      //   // tx.executeSql('DROP TABLE IF EXISTS produk')
      //   tx.executeSql(
      //     'CREATE TABLE IF NOT EXISTS produk(id_produk INTEGER PRIMARY KEY AUTOINCREMENT,namaproduk VARCHAR(100) NOT NULL,hargaproduk VARCHAR(50) NOT NULL,deskproduk VARCHAR(255) NOT NULL,imgname VARCHAR(255) NOT NULL);',
      //   );
      // });
      // dbConn.transaction(tx => {
      //   tx.executeSql('SELECT * FROM produk', [], (tr, result) => {
      //     // console.log('exe berhasil')
      //     var rows = result.rows;
      //     var total = 0;
      //     var data = [];
      //     for (let i = 0; i < rows.length; i++) {
      //       let item = rows.item(i);
      //       data.push(item);
      //       total += parseInt(data[i].hargaproduk);
      //     }
      //     setItems(data);
      //   });
      // });
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
          // const a = res.data.values.filter(item=>item[0]==3)
          // console.log(a[0][1].length)
          if (res.data.values == undefined) {
            setItems([]);
            setRefreshing(false);

            setModalVisibleLoading(false);
          } else {
            setItems(res.data.values);
            setRefreshing(false);

            setModalVisibleLoading(false);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };
  // navigation.addListener('focus', get)

  const onlongpress = () => {
    dispatch({type: 'REMOVEALL'});
  };
  const renderitem = (type, data, index) => {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <Cardcatalog item={data} oriented={Oriented} />
      </View>
    );
  };
  const onRefresh = () => {
    setRefreshing(true);
    get();
  };

  useEffect(() => {
    get();
  }, [1]);

  return (
    <View style={styles.wrap}>
      <View style={{backgroundColor: '#000', width: '100%', height: 50}}></View>
      {/* <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor={'#252525'}
            colors={['#79D1F1', '#D358FF']}
          />
        }
        style={styles.ScrollView}
        showsVerticalScrollIndicator={false}> */}
      <View style={styles.CardKatalog}>
        {item == 0 ? (
          <View style={styles.imgContainerStyle}>
            <View style={styles.imgwarpStyle}>
              <Image style={styles.imageStyle} source={emptyproduct} />
            </View>
          </View>
        ) : (
          // <FlatList
          // initialNumToRender={4}
          // keyExtractor={item => item[0]}
          // data={item}
          // horizontal={false}
          // numColumns={2}
          // scrollEventThrottle={4}
          // maxToRenderPerBatch={4}
          // contentContainerStyle={{ paddingBottom:120}}
          // renderItem={renderitem}/>
          <RecyclerListView
            rowRenderer={(type, data, index) => renderitem(type, data, index)}
            dataProvider={dataDataProvider}
            layoutProvider={layoutProvider}
            style={{flex: 1}}
            column={2}

            // scrollViewProps={{
            //   refreshControl: (
            //     <RefreshControl
            //       refreshing={loading}
            //       onRefresh={async () => {
            //         this.setState({ loading: true });
            //         analytics.logEvent('Event_Stagg_pull_to_refresh');
            //         await refetchQueue();
            //         this.setState({ loading: false });
            //       }}
            //     />
            //   )
            // }}
          />
        )}
      </View>
      {/* </ScrollView> */}

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
      <Modal transparent={true} visible={modalVisibleLoading}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}>
          <ActivityIndicator size={100} color={'#9B5EFF'} />
        </View>
      </Modal>
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
  wrapContentCard: {
    marginHorizontal: 8,
  },
  wrapChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CardKatalog: {
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    // flexBasis: '50%',
    flex: 1,
  },
  ScrollView: {
    paddingTop: 10,
  },

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
    // position: 'absolute',
    // bottom: 0,
    marginTop:8,
    width: '100%',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#9B5EFF',
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
    fontWeight: '500',
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
