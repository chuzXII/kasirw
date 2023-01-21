import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ItemDiskon from '../../component/ItemDiskon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';

const DiskonPage = ({navigation}) => {
  const [Data, setData] = useState(null);
  const [SelectData, setSelectData] = useState({});
  const [Index, setIndex] = useState();
  const [EditNama, setEditNama] = useState('');
  const [EditDiskon, setEditDiskon] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [Cek, setCek] = useState(true);
  const [isEnabled, setIsEnabled] = useState();
  const [LengthIndex, setLengthindex] = useState();

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    setEditDiskon('');
  };


  const isFocused = useIsFocused();

  const get = async () => {
    await AsyncStorage.getItem('formdiskon').then(res => {
      setData(JSON.parse(res));
    });
  };
  const onPress = ({item, i}) => {
    setModalVisible(true);
    setIndex(i);
    setEditNama(item.nama);
    setEditDiskon(item.diskon.split('-')[0]);
    setLengthindex(item.diskon.split('-').length)
    setSelectData(item);
    {item.diskon.split('-').length<=1?setIsEnabled(true):setIsEnabled(false)}
  };
  const onPressedit = async () => {
    if (
     EditNama == '' ||
     EditNama == null ||
      EditDiskon == '' ||
      EditDiskon == null
    ) {
      alert('Tidak Boleh Kosong');
    }
    else{
    if(!isEnabled){
      //persen
      if (EditDiskon <= 0 || EditDiskon > 100) {
        alert('Nominal Diskon 1-100');
      } else {
      const newIngredients = Data.slice();
      newIngredients[Index] = {
        ...newIngredients[Index],
        nama: EditNama,
        diskon: EditDiskon+'-%',
      };
      await AsyncStorage.setItem('formdiskon', JSON.stringify(newIngredients));
      setModalVisible(!modalVisible);
      setCek(!Cek)
    }
  }
    else{
      //decimal
      if (EditDiskon <= 0) {
        alert('Nominal Diskon Tidak Bisa Nol Atau Negatif');
      }else{
      const newIngredients = Data.slice();
      newIngredients[Index] = {
        ...newIngredients[Index],
        nama: EditNama,
        diskon: EditDiskon,
      };
      await AsyncStorage.setItem('formdiskon', JSON.stringify(newIngredients));
      setModalVisible(!modalVisible);
      setCek(!Cek)
    }
    }
  }
   
  };
  const onLongPress =(index) => {
    Alert.alert('Hapus','Yakin Mau Menghapus Data',[
      {text:'Cancel',onPress:()=>console.log('cancel')},
        {text:'OK',onPress:()=>onpressdelete(index)}
    ],{cancelable:false})
    
  }
  const onpressdelete=async(index)=>{
      Data.splice(index,1)
      await AsyncStorage.setItem('formdiskon', JSON.stringify(Data));
      setCek(!Cek)
      alert('Berhasil')
  }
  useEffect(() => {
    get();
  }, [isFocused,Cek]);
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <View style={{flex:1,marginHorizontal: 16}}>
        <Text style={{color: '#000', marginTop: 8}}>List Diskon</Text>
        <ScrollView style={{flex:1}}>
          {Data &&
            Data.map((item, i) => {
              return (
                <View style={{marginVertical: 12}} key={i}>
                  <ItemDiskon
                    namadiskon={item.nama}
                    diskon={item.diskon}
                    onPress={() => onPress({item, i})}
                    onLongPress={()=>onLongPress(i)}
                  />
                </View>
              );
            })}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={{backgroundColor: '#9B5EFF', padding: 18, alignItems: 'center'}}
        onPress={() => navigation.navigate('formdiskon')}>
        <Text style={{color: '#fff', fontSize: 18, fontWeight: '500'}}>
          Tambah Diskon
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        key={SelectData.iddiskon}>
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
            justifyContent: 'center',
          }}>
          <View style={styles.modalView}>
            <View style={styles.wrapcard}>
              <Text
                style={{
                  color: '#000',
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: '500',
                }}>
                Edit
              </Text>

              <Text
                style={{
                  color: '#000',
                  fontSize: 19,
                  fontWeight: '500',
                  marginVertical: 12,
                }}>
                Nama Diskon
              </Text>
              <TextInput
                placeholderTextColor={'#000'}
                placeholder={'Nama Diskon'}
                value={EditNama}
                onChangeText={value => setEditNama(value)}
                style={{
                  color: '#000',
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#18AECF',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                }}
              />
              <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
          <Text
            style={{
              color: '#000',
              fontSize: 18,
              fontWeight: '500',
              marginVertical: 12,
            }}>
            Diskon
          </Text>
          <View style={{flexDirection: 'row',alignItems:'center'}}>
            <Text
              style={{
                color: '#000',
                fontSize: 14,
                marginVertical: 12,
              }}>
              Ganti Format
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#9B5EFF' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        {isEnabled?
        <View style={{paddingHorizontal: 12,borderColor: '#18AECF', borderWidth: 1,borderRadius: 12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{color: '#000'}}>Rp.</Text>
               <TextInput
               keyboardType='number-pad'
                 placeholder={'Nama Diskon'}
                 value={EditDiskon}
                 style={{
                   color: '#000',
                   fontSize: 16,
                   flex:1
                 }}
                 placeholderTextColor={'#000'}
                 onChangeText={value => setEditDiskon(value)}
               />
             
             </View>
: <View style={{borderColor: '#18AECF', borderWidth: 1,borderRadius: 12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
               
<TextInput
keyboardType='number-pad'
  placeholder={'Nama Diskon'}
  value={EditDiskon}
  style={{
    color: '#000',
    fontSize: 16,
    paddingLeft: 12,
    flex:1
  }}
  placeholderTextColor={'#000'}
  onChangeText={value => setEditDiskon(value)}
/>
<Text style={{color: '#000',marginRight:12}}>%</Text>
</View>
}
             
              <TouchableOpacity
                style={{
                  padding: 12,
                  backgroundColor: '#9B5EFF',
                  marginTop: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => onPressedit()}>
                <Text style={{color: '#FFF', fontSize: 18, fontWeight: '500'}}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DiskonPage;

const styles = StyleSheet.create({
  modalView: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 2,
  },
  wrapcard: {
    margin: 14,
  },
});
