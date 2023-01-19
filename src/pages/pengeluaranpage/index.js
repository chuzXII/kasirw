import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Button
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import dbConn from '../../sqlite';
  import Input from '../../component/input';
  import Label from '../../component/label';
  import {useNavigation} from '@react-navigation/native';
  import {useDispatch, useSelector} from 'react-redux';
  import {setForm} from '../../redux/action';
  import {launchImageLibrary} from 'react-native-image-picker';
  import RNFS from 'react-native-fs';
  import DatePicker from 'react-native-modern-datepicker';

  
  const PengeluaranPage = () => {
    const navigation = useNavigation();
    const FormReducer = useSelector(state => state.FormReducer);
    const dispatch = useDispatch();
    const [NameImg, setNameImg] = useState();
    const [FileImgOri, setFileImgOri] = useState();
    const [urlimg, setUrlImg] = useState();
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
  
    const onPress = async () => {
      try {
        const cekdir = await RNFS.exists(
          RNFS.DownloadDirectoryPath + '/dataimg/',
        );
  
        if (cekdir == false) {
          RNFS.mkdir(RNFS.DownloadDirectoryPath + '/dataimg/');
        }
        console.log('res');
  
        dbConn.transaction(tx => {
          tx.executeSql(
            'INSERT INTO produk (namaproduk, hargaproduk, deskproduk, imgname) VALUES(?,?,?,?);',
            [
              FormReducer.form.namaproduk,
              FormReducer.form.hargaproduk,
              FormReducer.form.deskproduk,
              NameImg,
            ],
            (tx, rs) => {
              navigation.navigate('dashboard');
            },
            (tx, e) => {
              console.log(tx.message);
            },
          );
        });
        // console.log(FormReducer.imgdirori)
  
        RNFS.copyFile(
          FileImgOri,
          RNFS.DownloadDirectoryPath + '/dataimg/' + NameImg,
        );
      } catch (e) {
        console.log('EE' + e);
      }
    };
    const onInputChange = (value, input) => {
      // setForm({
      //     ...form,
      //     [input]:value
      // })
      dispatch(setForm(input, value));
    };
    const onPressimg = async () => {
      await launchImageLibrary({mediaType: 'photo', saveToPhotos: true}, res => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.errorCode) {
          console.log('ImagePicker Error: ', res.errorMessage);
        } else {
          const a = res.assets[0].type.split('/');
          setFileImgOri(res.assets[0].uri);
          setNameImg(FormReducer.form.namaproduk + '.' + a[1]);
          setUrlImg(res.assets[0].uri);
        }
      });
    };
    return (
      <View style={styles.conatiner}>
        <View>
          
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
        <View style={styles.card}>
        
          <View style={styles.warpcard}>
          <Label label={'Tanggal'} />
            <TouchableOpacity>
                <Text>12-01-23</Text>
            </TouchableOpacity>
     
            <Label label={'Nama Barang'} />
            <Input
              input={'Nama Produk'}
              numberOfLines={1}
              value={FormReducer.namaproduk}
              onChangeText={value => onInputChange(value, 'namaproduk')}
            />
            <Label label={'Harga Produk'} />
            <Input
              input={'Harga Produk'}
              numberOfLines={1}
              value={FormReducer.hargaproduk}
              onChangeText={value => onInputChange(value, 'hargaproduk')}
              keyboardType={'number-pad'}
            />
            <Label label={'Jumlah'} />
            <Input
              input={'Harga Produk'}
              numberOfLines={1}
              value={FormReducer.hargaproduk}
              onChangeText={value => onInputChange(value, 'hargaproduk')}
              keyboardType={'number-pad'}
            />
            <Label label={'Keterangan'} />
            <Input
              input={'Deskripsi Produk'}
              numberOfLines={4}
              value={FormReducer.deskproduk}
              onChangeText={value => onInputChange(value, 'deskproduk')}
            />
            <View style={styles.wrapbutton}>
              {FormReducer.form.namaproduk == null ||
              FormReducer.form.namaproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ||
              FormReducer.form.hargaproduk == null ||
              FormReducer.form.hargaproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ||
              FormReducer.form.deskproduk == null ||
              FormReducer.form.deskproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ? (
                <View style={styles.wrapbuttonsub}>
                  <View
                    style={[styles.button,{backgroundColor: 'rgba(37,150,190,0.5)'}]}>
                    <Text style={styles.buttontxt}>Simpan</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.wrapbuttonsub}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => onPress()}>
                    <Text style={styles.buttontxt}>Simpan</Text>
                  </TouchableOpacity>
                </View>
              )}
  
            </View>
          </View>
  
        </View>
        </ScrollView>
  
       
      </View>
    );
  };
  
  export default PengeluaranPage;
  const DWidth = Dimensions.get('window').width;
  const DHeight = Dimensions.get('window').height;
  
  const styles = StyleSheet.create({
    conatiner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
  
      elevation: 24,
    },
    card: {
      borderRadius: 15,
      backgroundColor: '#fff',
      width: DWidth * 0.9,
      
    },
    warpcard: {
  
      marginHorizontal: DWidth * 0.05,
      justifyContent: 'center',
    },
    wrapbutton: {
      marginTop: 14,
    },
    wrapbuttonsub: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    wrapimg: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    buttonimg: {
      marginVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: '#18AECF',
      width: DWidth * 0.3,
      height: DHeight / 20,
    },
    prvimg:{
        width: DWidth*0.331,
        height: DWidth*0.331,
        backgroundColor: '#bdbbbb',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        elevation: 3,
    },
  
    button: {
      marginBottom:14,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      width: DWidth * 0.7,
      height: DHeight / 15,
      backgroundColor: '#18AECF',
    },
    buttontxt: {
      color: '#fff',
      fontSize: 20,
    },
  });
  