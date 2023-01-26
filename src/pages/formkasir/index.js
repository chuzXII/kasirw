import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import React, {useEffect, useState} from 'react';
import dbConn from '../../sqlite';
import Input from '../../component/input';
import Label from '../../component/label';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setForm} from '../../redux/action';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Formkasir = () => {
  const navigation = useNavigation();
  const FormReducer = useSelector(state => state.FormReducer);
  const dispatch = useDispatch();
  const [ID, setid] = useState(0);
  const [Check, setCheck] = useState(false);

  const get=async()=>{
    const sheetid = await AsyncStorage.getItem('TokenSheet');
    const token = await AsyncStorage.getItem('tokenAccess');
    axios.get('https://sheets.googleapis.com/v4/spreadsheets/' +
    sheetid + '/values/Sheet3',
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },).then((res)=>{
      if(res.data.values==undefined){
        setid(0)
      }
      else{
        setid(res.data.values.splice(res.data.values.length-1)[0][0])

      }
    })
  }
  const onPress = async () => {
    try {
      const sheetid = await AsyncStorage.getItem('TokenSheet');
      const token = await AsyncStorage.getItem('tokenAccess');
    const data=[[parseInt(ID)+1,FormReducer.form.namaproduk,FormReducer.form.hargaproduk,0,FormReducer.form.stokproduk]]
      
      axios.post('https://sheets.googleapis.com/v4/spreadsheets/' +
    sheetid +
    '/values/Sheet3!A1:append?valueInputOption=USER_ENTERED', JSON.stringify({
      values: data,
    }),
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    },).then(()=>{
      navigation.navigate('dashboard');
      setCheck(!Check)
    })
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
  useEffect(()=>{
    get()
  },[Check])
  return (
    <View style={styles.conatiner}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
      <View style={styles.card}>
      
        <View style={styles.warpcard}>
          <Label label={'Nama Produk'} />
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
          <Label label={'Stok Produk'} />
          <Input
            input={'Stok Produk'}
            numberOfLines={1}
            value={FormReducer.stokproduk}
            onChangeText={value => onInputChange(value, 'stokproduk')}
            keyboardType={'number-pad'}/>
          {/* <Label label={'Deskripsi Produk'} /> */}
          {/* <Input
            input={'Deskripsi Produk'}
            numberOfLines={4}
            value={FormReducer.deskproduk}
            onChangeText={value => onInputChange(value, 'deskproduk')}
          /> */}
          <View style={styles.wrapbutton}>
            {/* <View style={styles.wrapimg}>
              {FormReducer.form.namaproduk == null ||
              FormReducer.form.namaproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ? (
                <View
                  style={[
                    styles.buttonimg,
                    {backgroundColor: 'rgba(37,150,190,0.5)'},
                  ]}>
                  <Text style={styles.buttontxt}>Image</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.buttonimg}
                  onPress={() => onPressimg()}>
                  <Text style={styles.buttontxt}>Image</Text>
                </TouchableOpacity>
              )}

              {urlimg == null ? (
                <View style={styles.prvimg}>
                  <Text style={{color: '#000', fontSize: 28}}>Image</Text>
                </View>
              ) : (
                <View
                  style={{
                    elevation: 4,
                    width: 130,
                    height: 130,
                    borderRadius: 20,
                    marginLeft: 12,
                  }}>
                  <Image
                    source={{uri: urlimg}}
                    style={{
                      width: 130,
                      height: 130,
                      borderWidth: 1,
                      borderColor: '#000',
                      borderRadius: 20,
                    }} 
                  />
                </View>
              )}
            </View> */}
            {FormReducer.form.namaproduk == null ||
            FormReducer.form.namaproduk
              .replace(/^\s+/, '')
              .replace(/\s+$/, '') == '' ||
            FormReducer.form.hargaproduk == null ||
            FormReducer.form.hargaproduk
              .replace(/^\s+/, '')
              .replace(/\s+$/, '') == '' ||
              FormReducer.form.stokproduk == null ||
              FormReducer.form.stokproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' 
            // || FormReducer.form.deskproduk == null ||
            // FormReducer.form.deskproduk
            //   .replace(/^\s+/, '')
            //   .replace(/\s+$/, '') == '' ? 
            ?(
              <View style={styles.wrapbuttonsub}>
                <View
                  style={[styles.button,{backgroundColor: 'rgba(127, 17, 224, 0.5)'}]}>
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

export default Formkasir;
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
    backgroundColor: '#9B5EFF',
  },
  buttontxt: {
    color: '#fff',
    fontSize: 20,
  },
});
