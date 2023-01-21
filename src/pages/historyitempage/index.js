import {
  ActivityIndicator,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
moment.suppressDeprecationWarnings = true;
const HistoryItemPage = ({route}) => {
  const [Data, setData] = useState([]);
  const [DataTotal, setDataTotal] = useState([]);
  const [modalVisibleLoading, setModalVisibleLoading] = useState(false);

  const [Date, setDate] = useState([]);
  const [Tunai, setTunai] = useState();
  const [IdTrx, setIdTrx] = useState();
  const [Owner, setOwner] = useState();
  const [Pesan, setPesan] = useState();


  const [NamaDiskon, setNamaDiskon] = useState('');
  const [Diskon, setDiskon] = useState(0);
  const [DiskonPersen, setDiskonPersen] = useState(0);

  const [SubTotal, setSubTotal] = useState(0);
  const [Total, setTotal] = useState(0);

  const currency = new Intl.NumberFormat('id-ID');
  const isFocused = useIsFocused();
  const {idtrx} = route.params;
  const onPressprint = async () => {
    let columnWidths = [10, 12, 10];
    try {
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      // await BluetoothEscposPrinter.printPic(chiilLogo, { width: 100, left:250 });
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.setBlob(3);
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['WIJAYA VAPE'],
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Deket Sama Bundaran Polres, Jl. KIS Mangunsarkoro, Kali Nangkaan, Dabasah, Kec. Bondowoso, Kabupaten Bondowoso, Jawa Timur 68216'],
        {},
      );
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText(
        '================================',
        {},
      );

      // await BluetoothEscposPrinter.printColumn(
      //   [16,16],
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //   ["082140083902",'IG:Chill_idn.co'],
      //   {},
      // );

      await BluetoothEscposPrinter.printColumn(
        [10, 22],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Transaksi', IdTrx],
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
        ['Kasir', Owner],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Whatsapp', '081333768128'],
        {},
      );
      // await BluetoothEscposPrinter.printColumn(
      //   [16, 16],
      //   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      //   ['Instagram', 'Chill_idn.co'],
      //   {},
      // );
      // await BluetoothEscposPrinter.printColumn(
      //   [32],
      //   [BluetoothEscposPrinter.ALIGN.LEFT],
      //   ['WA : 082140083902'],
      //   {},
      // );
      // await BluetoothEscposPrinter.printColumn(
      //   [32],
      //   [BluetoothEscposPrinter.ALIGN.LEFT],
      //   ['IG : Chill_idn.co'],
      //   {},
      // );
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printColumn(
        [11, 11, 11],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['==========', 'Pesanan', '=========='],
        {},
      );
      // CartReducer.cartitem.map(async(items,index)=>{
      for (let a = 0; a < Data.length; a++) {
        await BluetoothEscposPrinter.printColumn(
          [32],
          [BluetoothEscposPrinter.ALIGN.LEFT],
          [Data[a].produk],
          {},
        ),
          await BluetoothEscposPrinter.printColumn(
            [16, 16],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              (
                Data[a].data[0][2] +
                'x Rp.' +
                currency.format(Data[a].data[0][3])
              ).toString(),
              (
                'Rp.' +
                currency.format(
                  parseInt(Data[a].data[0][3]) * parseInt(Data[a].data[0][2]),
                )
              ).toString(),
            ],
            {},
          );
      }
      await BluetoothEscposPrinter.printText(
        '================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Subtotal', 'Rp.' + currency.format(SubTotal).toString()],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Diskon', DiskonPersen + '%'],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================',
        {},
      );
      await BluetoothEscposPrinter.setBlob(3);
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Total', 'Rp.' + currency.format(Total).toString()],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Tunai', 'Rp.' + currency.format(Tunai).toString()],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [16, 16],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Kembalian', 'Rp.' + currency.format(Tunai - Total).toString()],
        {},
      );
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['"' + 'Terimakasih Atas Pembeliannya' + '"'],
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
    } catch (e) {
      alert(e.message || 'ERROR');
    }
  };
  const onPressKirim = () => {
    let url = `whatsapp://send?text=${`CHILL\n\nJl.kol sugino,Gang Pepabri,Kec.Kademangan,Kab.Bondowoso\n======================================\nTransaksi\t\t\t\t\t\t\t\t\t\t\t\t\t\t${IdTrx}\n${
      Date[0]
    }\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${
      Date[1]
    }\nWhatsapp\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t081333768128\n\n=============== Pesanan ===============\n\n`} &phone=6281333768128`;
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Make sure Whatsapp installed on your device');
      });
  };
  const msg = () => {
    console.log(Data);
    Data.map((item, index) => {
      return item.produk;
    });
  };

  const get = async () => {
    const sheetid = await AsyncStorage.getItem('TokenSheet');
    const token = await AsyncStorage.getItem('tokenAccess');
    setModalVisibleLoading(true);
    await axios
      .get(
        'https://sheets.googleapis.com/v4/spreadsheets/' +
          sheetid +
          '/values/Sheet1',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(res => {
        const j = res.data.values.filter(fill => fill[0] == idtrx);
        setDataTotal(j);
        const srawdate = j[0][5].split(' ');
        const [day, month, year] = srawdate[0].split('-');
   
        const rawdate = moment(year+'-'+month+'-'+day)
          .format('DD MMM yyyy')
          .concat('T' + srawdate[1]);
        setDate(rawdate.split('T'));
        setTunai(j[0][4]);
        setIdTrx(j[0][0]);
        setOwner(j[0][9]);
        setPesan(j[0][8]);
        const rawdiskon = j[0][7].split(' ');
        let sDiskon;
        let Total;
        const subtotal = j.reduce(
          (result, item) => parseInt(item[3]) * parseInt(item[2]) + result,
          0,
        );
        if (rawdiskon.length == 1) {
          setDiskon(rawdiskon[0]);
          setDiskonPersen(rawdiskon[0]);
          Total = (subtotal - rawdiskon[0]);
        } else {
          if(rawdiskon[1].split('-').length<=1){
            setNamaDiskon(rawdiskon[0]);
            setDiskon(rawdiskon[1].split('-')[0]);
            setDiskonPersen(rawdiskon[1].split('-'));
            Total = (subtotal - rawdiskon[1].split('-')[0] )
          }else{
            setNamaDiskon(rawdiskon[0]);
            setDiskon(rawdiskon[1].split('-')[0] / 100);
            setDiskonPersen(rawdiskon[1].split('-'));
            Total = subtotal-(subtotal * rawdiskon[1].split('-')[0] ) / 100;
          }
         
        }

       
        setSubTotal(subtotal);
        setTotal(Total);

        var result = [];
        j.forEach(
          (indices => v => {
            if (v in indices) result[indices[v]]++;
            else indices[v] = result.push(1) - 1;
          })({}),
        );
        // const a = res.data.values.filter(
        //   (value, index, self) =>
        //     index === self.findIndex(t => t[0] === value[0]),
        // );
        const groups = j.reduce((groups, data) => {
          const produk = data[1];
          // if (!groups[date]&&!groups[timestamp]) {

          if (!groups[produk]) {
            // groups[date] = [];
            groups[produk] = [];
          }

          groups[produk].push(data);
          return groups;
        }, {});

        let f = 0;
        const groupArrays = Object.keys(groups).map(produk => {
          return {
            produk,
            data: groups[produk],
          };
        });
        setData(groupArrays);
        setModalVisibleLoading(false);
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          alert(error.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };
  useEffect(() => {
    get();
  }, [isFocused]);
  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <View style={{marginHorizontal: 14}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
          }}>
          <View>
            <Text style={{color: '#000', fontFamily: 'InknutAntiqua-Regular'}}>
              {idtrx}
            </Text>
            <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Light'}}>
              {Date[0]+' '+Date[1]}
            </Text>
          </View>
          <View>
            <Text style={{color: '#000', fontFamily: 'InknutAntiqua-Regular'}}>
              Rp.
              {currency.format(Total)}
            </Text>
            <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Light'}}>
              {Owner}
            </Text>
          </View>
        </View>
        <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Bold',paddingTop:6,fontSize:16}}>Catatan :</Text>
        <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Regular',paddingTop:4,paddingBottom:16,fontSize:14}}>{Pesan}</Text>


        <View
          style={{
            borderStyle: 'dashed',
            borderBottomWidth: 1,
            borderColor: '#C3C3C3',
          }}></View>
        <View
          style={{
            backgroundColor: '#EEFFFC',
            marginTop: 22,
            paddingVertical: 16,
            borderRadius: 4,
          }}>
          <View style={{marginHorizontal: 14}}>
            {DataTotal.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems:'center',
                    paddingVertical: 4,
                  }}
                  key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 4,
                    
                    }}>
                   
                   <View>
                   <Text
                      style={{
                        color: '#000',
                        fontFamily: 'TitilliumWeb-Regular',
                      }}>
                 
                      {item[1]}
                    </Text>
                   <Text
                      style={{
                        color: '#000',
                        fontFamily: 'TitilliumWeb-Regular',
                      }}>
                      {item[2]}x Rp.{item[3]}
                    </Text>
                    </View>

                    
                  </View>

                  <Text
                    style={{color: '#000', fontFamily: 'TitilliumWeb-Regular'}}>
                    Rp.{currency.format(parseInt(item[3]) * item[2])}
                  </Text>
                </View>
              );
            })}

            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#000',
                marginVertical: 12,
              }}></View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Regular'}}>
                Subtotal
              </Text>
              <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Regular'}}>
                Rp.
                {currency.format(SubTotal)}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Regular'}}>
                Diskon
              </Text>
              {DiskonPersen.length==1?<Text style={{color: '#000', fontFamily: 'TitilliumWeb-Regular'}}>
                -Rp.{DiskonPersen}
              </Text>:<Text style={{color: '#000', fontFamily: 'TitilliumWeb-Regular'}}>
                {DiskonPersen}
              </Text>}
              
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
            marginBottom: 12,
            marginHorizontal: 14,
          }}>
          <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Bold'}}>
            Total
          </Text>
          <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Bold'}}>
            Rp.
            {currency.format(Total)}
          </Text>
        </View>
        <View
          style={{
            borderStyle: 'dashed',
            borderBottomWidth: 1,
            borderColor: '#C3C3C3',
          }}></View>
        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 14,
          }}>
          <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Bold'}}>
            Tunai
          </Text>
          <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Bold'}}>
            Rp.{currency.format(Tunai)}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 14,
          }}>
          <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Bold'}}>
            Kembalian
          </Text>
          <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Bold'}}>
            Rp.{currency.format(Tunai - Total)}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => onPressprint()}
            style={{
              borderWidth: 1,
              alignItems: 'center',
              padding: 14,
              borderRadius: 12,
              width: '50%',
            }}>
            <Text style={{color: '#000', fontFamily: 'TitilliumWeb-Bold'}}>
              Cetak
            </Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity onPress={() => onPressKirim()}>
          <Text style={{color: '#000'}}>Kirim</Text>
        </TouchableOpacity> */}
      </View>
      <Modal transparent={true} visible={modalVisibleLoading}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}>
          <ActivityIndicator size={100} color={'#44dfff'} />
        </View>
      </Modal>
    </View>
  );
};

export default HistoryItemPage;

const styles = StyleSheet.create({});
