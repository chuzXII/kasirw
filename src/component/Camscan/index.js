import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, } from 'react-native'
import React, { useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const Camscan = (addchart) => {
  const [barcodes, setBarcodes] = useState('')
  const Navigation = useNavigation()
  const dispatch = useDispatch();
  const TRXReducer = useSelector(state => state.TRXReducer);
  const setCart = (item, idpproduk, count, harga, id_tensaksi) => {
    var ids = '';
    if (TRXReducer.id_produk == null) {
      ids = id_tensaksi;
    } else {
      ids = TRXReducer.id_produk;
    }

    let cart = {
      idtrx: ids,
      item: item,
      id: idpproduk,
      count: count,
      subTotal: harga,
    };
    dispatch({ type: 'CART', value: cart });
  };
  const setidproduk = id => {
    dispatch({ type: 'IDPRODUK', value: id });
  };

  const onSuccess = async (e) => {
    setBarcodes(e.data)
    if (addchart.route.params) {
      const sheetid = await AsyncStorage.getItem('TokenSheet');
      const token = await AsyncStorage.getItem('tokenAccess');
      await axios
        .get(
          'https://sheets.googleapis.com/v4/spreadsheets/' +
          sheetid +
          '/values/Produk',
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then(res => {
          const item = res.data.values.filter(fill => fill[4] != null ? fill[4] == e.data : null)[0]
          const rawdate = new Date();
          const date = moment(rawdate).format('DD-MM-YY').split('-');
          const id_tensaksi =
            'TRX-' +
            date[0] +
            date[1] +
            date[2] +
            Math.floor(Math.random() * 1000000) +
            1;
          setidproduk(id_tensaksi);
          var idpproduk = item[0];
          var harga = item[2];
          var count = 1;
          setCart(item, idpproduk, count, harga, id_tensaksi);
          Navigation.navigate('Routestack')

        })
    }
  }
  const handleLayoutMeasured = (event) => {
    const { layout, target } = event.nativeEvent;
    // Access layout properties such as width, height, x, y
    console.log('Barcode Mask Layout:', layout, target);
  };
  return (
    <KeyboardAvoidingView style={styles.root}>
      <View style={styles.upperSection}>
        <QRCodeScanner
          onRead={e => onSuccess(e)}
          markerStyle={<View><Text>sadasd</Text></View>}
          bottomContent={<View><Text style={styles.textBold}>{barcodes}</Text></View>} />
        {/* <BarcodeMask width={300} height={100} edgeColor={'#db6e37'} animatedLineColor={'#db6e37'} lineAnimationDuration={1000} onLayoutMeasured={handleLayoutMeasured}/> */}
      </View>
    </KeyboardAvoidingView>
  )
}

export default Camscan

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  upperSection: {
    flex: 1
  },
  lowerSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  camera: {
    height: '100%',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
})