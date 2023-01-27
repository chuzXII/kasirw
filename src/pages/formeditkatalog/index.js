import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import dbConn from '../../sqlite';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import Label from '../../component/label';
import Input from '../../component/input';
import {useDispatch, useSelector} from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormEdit = ({route, navigation}) => {
  const params = route.params;
  const isFocused = useIsFocused();
  const [Data, setData] = useState();
  const FormReducer = useSelector(state => state.FormReducer);
  const dispatch = useDispatch();
  const [NameImg, setNameImg] = useState();
  const [FileImgOri, setFileImgOri] = useState();
  const [urlimg, setUrlImg] = useState();
  const [Form, setForm] = useState({
    id: '',
    namaproduk: '',
    hargaproduk: '',
    stokterjual:'',
    stok: '',
  });

  const onPress = async () => {
    try {
      const sheetid = await AsyncStorage.getItem('TokenSheet');
      const token = await AsyncStorage.getItem('tokenAccess');
      axios.post(
        'https://sheets.googleapis.com/v4/spreadsheets/' +
          sheetid +
          '/values:batchUpdate',
        JSON.stringify({
          data: {
            values: [[Form.id, Form.namaproduk,Form.hargaproduk,Form.stokterjual,Form.stok]],
            range: 'Produk!A' + Form.id,
          },
          valueInputOption: 'USER_ENTERED',
        }),
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        },
      ) .then(res => {
       navigation.navigate('dashboard');  
      })  
     
    } catch (e) {
      console.log('EE' + e);
    }
  };
  const onInputChange = (value, input) => {
    setForm({
      ...Form,
      [input]: value,
    });
  };
  // const onPressimg = async () => {
  //   await launchImageLibrary({mediaType: 'photo', saveToPhotos: true}, res => {
  //     if (res.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (res.errorCode) {
  //       console.log('ImagePicker Error: ', res.errorMessage);
  //     } else {
  //       const a = res.assets[0].type.split('/');
  //       setFileImgOri(res.assets[0].uri);
  //       setNameImg(Form.namaproduk + '.' + a[1]);
      
  //     }
  //   });
  // };

  const get =() => {
    try {
            setForm({
              id: params.id,
              namaproduk: params.data[1],
              hargaproduk:params.data[2],
              stokterjual:params.data[3],
              stok: params.data[4],
            });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    get();
  }, [isFocused]);
  return (
    <View style={styles.conatiner}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
        <View style={styles.card}>
          <View style={styles.warpcard}>
            <Label label={'Nama Produk'} />
            <Input
              input={'Nama Produk'}
              value={Form.namaproduk}
              onChangeText={value => onInputChange(value, 'namaproduk')}
            />
            <Label label={'Harga Produk'} />
            <Input
              input={'Harga Produk'}
              value={Form.hargaproduk}
              onChangeText={value => onInputChange(value, 'hargaproduk')}
              keyboardType={'number-pad'}
            />
            <Label label={'Stok'} />
            <Input
             keyboardType={'number-pad'}
              input={'Stok'}
              value={Form.stok}
              onChangeText={value => onInputChange(value, 'stok')}
            />
            <View style={styles.wrapbutton}>
              {Form.namaproduk == null ||
              Form.namaproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ||
                Form.hargaproduk == null ||
              Form.hargaproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ||
                Form.stok == null ||
                Form.stok
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ? (
                <View style={styles.wrapbuttonsub}>
                  <View
                    style={[
                      styles.button,
                      {backgroundColor: 'rgba(37,150,190,0.5)'},
                    ]}>
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

export default FormEdit;
const DWidth = Dimensions.get('window').width;
const DHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,

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
  prvimg: {
    width: DWidth * 0.331,
    height: DWidth * 0.331,
    backgroundColor: '#bdbbbb',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 3,
  },

  button: {
    marginBottom: 14,
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
