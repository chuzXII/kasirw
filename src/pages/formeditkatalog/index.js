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
    deskproduk: '',
  });

  const onPress = async () => {
    try {
      const cekdir = await RNFS.exists(
        RNFS.DownloadDirectoryPath + '/dataimg/',
      );

      if (cekdir == false) {
        RNFS.mkdir(RNFS.DownloadDirectoryPath + '/dataimg/');
      }
      var newimgname
      if(FileImgOri!=undefined){
        newimgname=NameImg
      }
      else{
        newimgname=urlimg
      }

      dbConn.transaction(tx => {
        tx.executeSql(
          'UPDATE produk SET namaproduk=?, hargaproduk=?, deskproduk=?, imgname=? WHERE id_produk=?',
          [
            Form.namaproduk,
            Form.hargaproduk,
            Form.deskproduk,
            newimgname,
            params.id
          ],
          (tx, rs) => {
            if(FileImgOri!=undefined){
                var path = RNFS.DownloadDirectoryPath+'/dataimg/' + urlimg;
                RNFS.unlink(path).then(()=>{
                    RNFS.copyFile(
                        FileImgOri,
                        RNFS.DownloadDirectoryPath + '/dataimg/' + NameImg,
                      );
                })
              }
            navigation.navigate('dashboard');
          },
          (tx, e) => {
            console.log(tx.message);
          },
        );
      });
      // console.log(FormReducer.imgdirori)
      
     
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
  const onPressimg = async () => {
    await launchImageLibrary({mediaType: 'photo', saveToPhotos: true}, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.errorCode) {
        console.log('ImagePicker Error: ', res.errorMessage);
      } else {
        const a = res.assets[0].type.split('/');
        setFileImgOri(res.assets[0].uri);
        setNameImg(Form.namaproduk + '.' + a[1]);
      
      }
    });
  };

  const get =() => {
    try {
      dbConn.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM produk WHERE id_produk=?',
          [params.id],
          (tr, result) => {
            var rows = result.rows;
            var total = 0;
            var data = [];
            for (let i = 0; i < rows.length; i++) {
              let item = rows.item(i);
              data.push(item);
              total += parseInt(data[i].hargaproduk);
            }

            setForm({
              id: params.id,
              namaproduk: data[0].namaproduk,
              hargaproduk: data[0].hargaproduk,
              deskproduk: data[0].deskproduk,
            });
            setUrlImg(data[0].imgname)
          },
        );
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
      <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop: 14}}>
        <View style={styles.card}>
          <View style={styles.warpcard}>
            <Label label={'Nama Produk'} />
            <Input
              input={'Nama Produk'}
              numberOfLines={1}
              value={Form.namaproduk}
              onChangeText={value => onInputChange(value, 'namaproduk')}
            />
            <Label label={'Harga Produk'} />
            <Input
              input={'Harga Produk'}
              numberOfLines={1}
              value={Form.hargaproduk}
              onChangeText={value => onInputChange(value, 'hargaproduk')}
              keyboardType={'number-pad'}
            />
            <Label label={'Deskripsi Produk'} />
            <Input
              input={'Deskripsi Produk'}
              numberOfLines={4}
              value={Form.deskproduk}
              onChangeText={value => onInputChange(value, 'deskproduk')}
            />
            <View style={styles.wrapbutton}>
              <View style={styles.wrapimg}>
                {Form.namaproduk == null ||
                Form.namaproduk
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
                      source={{uri:FileImgOri==undefined? 'file://' +RNFS.DownloadDirectoryPath +'/dataimg/' +urlimg:FileImgOri}}
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
              </View>
              {Form.namaproduk == null ||
              Form.namaproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ||
                Form.hargaproduk == null ||
              Form.hargaproduk
                .replace(/^\s+/, '')
                .replace(/\s+$/, '') == '' ||
                Form.deskproduk == null ||
                Form.deskproduk
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
