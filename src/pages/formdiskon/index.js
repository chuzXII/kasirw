import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormDiskon = ({navigation}) => {
  const [namadiskon, setnamadiskon] = useState('');
  const [diskon, setdiskon] = useState('');

  const [form, setForm] = useState({
    id: 0,
    namadiskon: '',
    diskon: '',
  });
  const onInputChange = (value, input) => {
    setForm({
      ...form,
      [input]: value,
    });
  };

  const onPressSubmit = async () => {
    if (
      namadiskon == '' ||
      namadiskon == null ||
      diskon == '' ||
      diskon == null
    ) {
      alert('Tidak Boleh Kosong');
    } else {
      if (diskon <= 0 || diskon > 100) {
        alert('Nominal Diskon 1-100');
      } else {
        await AsyncStorage.getItem('iddiskon').then(async contacts => {
          const id = 0;
          if (contacts == null) {
            const u = id + 1;
            AsyncStorage.setItem('iddiskon', JSON.stringify(u));
          } else {
            AsyncStorage.setItem(
              'iddiskon',
              JSON.stringify(parseInt(contacts) + 1),
            );
          }
          await AsyncStorage.getItem('formdiskon').then(async contacts => {
            const id = await AsyncStorage.getItem('iddiskon');
            const c = contacts ? JSON.parse(contacts) : [];
            c.push({iddiskon: id, nama: namadiskon, diskon: diskon});
            AsyncStorage.setItem('formdiskon', JSON.stringify(c));
          });
          alert('berhasil');
          navigation.navigate('diskonpage')
        });
      }
    }
  };

  return (
    <View style={{justifyContent: 'space-between', flex: 1}}>
      <View style={{marginHorizontal: 18, marginTop: 12}}>
        <Text
          style={{
            color: '#000',
            fontSize: 18,
            fontWeight: '400',
            marginVertical: 12,
          }}>
          Nama Diskon
        </Text>
        <TextInput
          placeholder="Masukan Nama Diskon"
          style={{
            color: '#000',
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingLeft: 12,
            elevation: 4,
          }}
          placeholderTextColor={'#000'}
          value={namadiskon}
          onChangeText={value => setnamadiskon(value)}
        />
        <Text
          style={{
            color: '#000',
            fontSize: 18,
            fontWeight: '400',
            marginVertical: 12,
          }}>
          Diskon
        </Text>

        <TextInput
          placeholder="Masukan Diskon"
          keyboardType="number-pad"
          style={{
            color: '#000',
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingLeft: 12,
            elevation: 4,
          }}
          placeholderTextColor={'#000'}
          value={diskon}
          onChangeText={value => setdiskon(value)}
        />
      </View>

      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#18AECF',
          padding: 18,
        }}
        onPress={() => {
          onPressSubmit();
        }}>
        <Text style={{color: '#fff', fontSize: 18, fontWeight: '500'}}>
          Simpan
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormDiskon;

const styles = StyleSheet.create({});
