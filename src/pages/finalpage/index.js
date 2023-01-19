import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import {Logo} from '../../assets';
import {useDispatch, useSelector} from 'react-redux';
import { Iprinter } from '../../assets/icon';
import printer from '../printerpage';
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import moment from 'moment'
import { useEffect } from 'react';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FinalPage = ({navigation}) => {
  const currency = new Intl.NumberFormat('id-ID');
  const CartReducer = useSelector(state => state.CartReducer);
  const TRXReducer = useSelector(state => state.TRXReducer);
  const Date = moment().format("DD MMM yyyyTHH:mm").split("T")
  const TunaiReducer = useSelector(state => state.TunaiReducer);
  const DiskonReducer = useSelector(state => state.DiskonReducer);
  const [currencystate,setCurrencystate] = useState({
    subtotal:0,
    diskonpersen:0,
    diskon:0,
    total:0,
    tunai:0,
    kembalian:0,
  })
  const [user,setUser] = useState({})

  const dispatch = useDispatch()
  const setup=async()=>{
    let columnWidths = [10, 12, 10];
    try {
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      // await BluetoothEscposPrinter.printPic(chiilLogo, { width: 100, left:250 });
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.setBlob(3);
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['CHILL'],
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Perum Tegal Asri Blok D22, RT.007/RW.002, Ds.karanganyar, Kec.Tegalampel, Kab.Bondowoso'],
        {},
      );
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText(
        '================================',
        {},
      );
  
      await BluetoothEscposPrinter.printColumn(
        [10, 22],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Transaksi',  TRXReducer.id_produk],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [Date[0], Date[1]],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Kasir', user.name],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Whatsapp', '082140083902'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Instagram', 'Chill_idn.co'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [11, 11, 11],
        [BluetoothEscposPrinter.ALIGN.LEFT,BluetoothEscposPrinter.ALIGN.CENTER,BluetoothEscposPrinter.ALIGN.RIGHT],
        ['==========', 'PESANAN','=========='],
        {},
      );
      // CartReducer.cartitem.map(async(items,index)=>{
        for(let a = 0;a<CartReducer.cartitem.length;a++){
        // await BluetoothEscposPrinter.printColumn(
        //     columnWidths,
        //     [
        //       BluetoothEscposPrinter.ALIGN.LEFT,
        //       BluetoothEscposPrinter.ALIGN.CENTER,
        //       BluetoothEscposPrinter.ALIGN.RIGHT,
        //     ],
        //     [items.item.namaproduk,(items.count+'x '+currency.format(items.subTotal)).toString(), ('Rp.'+currency.format(items.count * items.item.hargaproduk)).toString()],
        //     {},
        //   );
        
          // console.log(items.item.namaproduk)
          // console.log((items.count+'x Rp.'+currency.format(items.subTotal)).toString())
        await BluetoothEscposPrinter.printColumn(
          [32],
          [BluetoothEscposPrinter.ALIGN.LEFT],
          [CartReducer.cartitem[a].item.namaproduk],
          {},
        ),
        await BluetoothEscposPrinter.printColumn(
          [16, 16],
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          [(CartReducer.cartitem[a].count+'x Rp.'+currency.format(CartReducer.cartitem[a].subTotal)).toString(), ('Rp.'+currency.format(CartReducer.cartitem[a].count * CartReducer.cartitem[a].item.hargaproduk)).toString()],
          {},
        )}
      await BluetoothEscposPrinter.printText(
        '================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Subtotal','Rp.'+currency.format(currencystate.subtotal).toString()],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Diskon',currencystate.diskonpersen+'%'],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================',
        {},
      );
      await BluetoothEscposPrinter.setBlob(3)
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Total', 'Rp.'+currency.format(currencystate.total).toString()],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Tunai','Rp.'+currency.format(currencystate.tunai).toString()],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Kembalian','Rp.'+currency.format(currencystate.kembalian).toString()],
        {},
      );
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      await BluetoothEscposPrinter.printColumn(
          [32],
          [BluetoothEscposPrinter.ALIGN.CENTER],
          ['"'+'Terimakasih Atas Pesanan Anda'+'"'],
          {},
        );
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
  
    } catch (e) {
      alert(e.message || 'ERROR');
    }
  
  }
  const Submit=async()=>{
    dispatch({type:'REMOVEALL'})
    dispatch({type:'NOMINAL',value:null})
    dispatch({type:'RMIDPRODUK',value:null})
    dispatch({type:'DISKON',valuenama:'',valuediskon:0})
    navigation.navigate('Routestack')
  }
  const renderitem = items => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={{color: '#000', flex: 3}}>{items.item.namaproduk}</Text>
        <Text style={{color: '#000', flex: 1}}>{items.count}</Text>
        <Text style={{color: '#000', flex: 2}}>Rp.{currency.format(items.subTotal)}</Text>
      </View>
    );
  };
  const get=async()=>{
    const subtotal =CartReducer.cartitem.reduce((result, item) => item.count * item.subTotal + result,0, )
    const diskonpersen =DiskonReducer.diskon;
    const diskon = subtotal * (DiskonReducer.diskon/100)
    const total =subtotal-diskon
    const tunai = TunaiReducer.nominal
    const kembalian  =tunai-total
    setCurrencystate({
      subtotal:subtotal,
      diskonpersen:diskonpersen,
      diskon:diskon,
      total:total,
      tunai:tunai,
      kembalian:kembalian,
    })
    const user= JSON.parse(await AsyncStorage.getItem('usergooglesignin'))
    setUser(user)
  }
  useEffect(()=>{
    get()
  },[])
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#000',fontSize:28,marginVertical:16,fontFamily:'InknutAntiqua-Regular'}}>BERHASIL</Text>
          <Image source={Logo} />
        </View>

        <View style={{backgroundColor: '#fff', marginHorizontal: 25,borderRadius:8,elevation:6}}>
          <View style={{marginHorizontal: 12, marginVertical: 12}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#000', flex: 3,fontFamily:'TitilliumWeb-Bold'}}>Items</Text>
              <Text style={{color: '#000', flex: 1,fontFamily:'TitilliumWeb-Bold'}}>Qty</Text>
              <Text style={{color: '#000', flex: 2,fontFamily:'TitilliumWeb-Bold'}}>Harga</Text>
            </View>
            {CartReducer.cartitem.map((items, index) => {
              return <View style={{paddingVertical:12}}  key={index}>
                {renderitem(items)}
                <View style={{ borderBottomWidth: StyleSheet.hairlineWidth,marginTop:6}}></View>
              </View>;
            })}

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#000', flex: 4,fontFamily:'TitilliumWeb-Regular'}}>SubTotal</Text>

              <Text style={{color: '#000', flex: 2,fontFamily:'TitilliumWeb-Regular'}}>
                Rp.
                {currency.format(currencystate.subtotal)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#000', flex: 4,fontFamily:'TitilliumWeb-Regular'}}>Diskon</Text>

              <Text style={{color: '#000', flex: 2,fontFamily:'TitilliumWeb-Regular'}}>
              -Rp.{currency.format(currencystate.diskon)}
              </Text>
            </View>
            <View style={{ borderBottomWidth: StyleSheet.hairlineWidth,marginVertical:6}}></View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#000', flex: 4,fontFamily:'TitilliumWeb-Bold'}}>Total</Text>

              <Text style={{color: '#000', flex: 2,fontFamily:'TitilliumWeb-Bold'}}>
                Rp.{currency.format(currencystate.total)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#000', flex: 4,fontFamily:'TitilliumWeb-Bold'}}>Tunai</Text>

              <Text style={{color: '#000', flex: 2,fontFamily:'TitilliumWeb-Bold'}}>
                Rp.{currency.format(currencystate.tunai)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#000', flex: 4,fontFamily:'TitilliumWeb-Bold'}}>Kembalian</Text>

              <Text style={{color: '#000', flex: 2,fontFamily:'TitilliumWeb-Bold'}}>
                Rp.
                {currency.format(currencystate.kembalian)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{alignItems: 'center',marginVertical:12}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#18AECF',
            width: 50,
            height: 50,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={()=>setup()}>
         <Iprinter/>
        </TouchableOpacity>
      </View>
      </ScrollView>
      
      

      <TouchableOpacity style={{backgroundColor: '#18AECF',padding:16, alignItems: 'center',
            justifyContent: 'center',borderTopEndRadius:24,borderTopLeftRadius:24}} onPress={()=>Submit()}>
        <Text style={{color: '#fff',fontSize:18,fontFamily:'TitilliumWeb-Bold'}}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FinalPage;

const styles = StyleSheet.create({});
