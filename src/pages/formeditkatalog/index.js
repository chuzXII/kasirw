import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Label from '../../component/label';
import Input from '../../component/input';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Iscan, Iscand } from '../../assets/icon';
import BASE_URL from '../../../config';

const FormEdit = ({ route, navigation }) => {

  const params = route.params;
  const isFocused = useIsFocused();
  const [modalVisibleCategory, setModalVisibleCategory] = useState(false);
  const [Datakateogri, setDatakateogri] = useState([]);
  const [errors, setErrors] = useState({});
  const [Form, setForm] = useState({
    id: '',
    namaproduk: '',
    hargaproduk: '',
    stokproduk: '',
  });

  const validateInputs = () => {
    const newErrors = {};
    if (!Form.namaproduk || Form.namaproduk.trim() === '') {
      newErrors.namaproduk = 'Nama produk harus diisi';
    }
    if (!Form.hargaproduk || isNaN(Form.hargaproduk)) {
      newErrors.hargaproduk = 'Harga produk harus berupa angka';
    }
    if (Form.stokproduk && isNaN(Form.stokproduk)) {
      newErrors.stokproduk = 'Stok produk harus berupa angka';
    }
    if (!Form.kategoriproduk || Form.kategoriproduk.trim() === '') {
      newErrors.kategoriproduk = 'Kategori produk harus dipilih';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const onPress = async () => {
    try {
      if (!validateInputs()) return;
      const token = await AsyncStorage.getItem('tokenAccess');
      const response = await axios.put(`${BASE_URL}/produk/${params.id}`, {
        id_toko: params.id_toko,
        nama_produk: Form.namaproduk,
        harga: Form.hargaproduk,
        stok: Form.stokproduk,
        kode_kategori: Form.idkategori,
        is_stock_managed: Form.stokproduk > 0 || Form.stokproduk == null ? 1 : 0,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      navigation.goBack();


    } catch (e) {
      console.log(e.response);
    }
  };

  const onInputChange = (value, input) => {
    setForm({
      ...Form,
      [input]: value,
    });
  };


  const get = async () => {
    try {
      const token = await AsyncStorage.getItem('tokenAccess');
      await axios.get(`${BASE_URL}` + '/kategori',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      ).then(res => {

      })
      console.log(params.data)
      setForm({
        id: params.id,
        namaproduk: params.data.nama_produk,
        hargaproduk: params.data.harga,
        stokproduk: params.data.stok,
        kategoriproduk: params.data.kategori.nama_kategori,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      get()
    }, [])
  );
  return (
    <View style={styles.conatiner}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Form Tambah Produk</Text>
        <View style={styles.card}>
          <View style={styles.wrapCard}>
            <Label label="Nama Produk" />
            <View style={styles.formGroup}>
              <Input
                input="Nama Produk"
                value={Form.namaproduk}
                onChangeText={(value) => onInputChange(value, 'namaproduk')}
              />
            </View>
            {errors.namaproduk && <Text style={styles.errorText}>{errors.namaproduk}</Text>}

            <Label label="Harga Produk" />
            <View style={styles.formGroup}>
              <Input
                input="Harga Produk"
                value={String(Form.hargaproduk)}
                onChangeText={(value) => onInputChange(value, 'hargaproduk')}
                keyboardType="number-pad"
              />
            </View>
            {errors.hargaproduk && <Text style={styles.errorText}>{errors.hargaproduk}</Text>}

            <Label label="Stok Produk" />
            <View style={styles.formGroup}>
              <Input
                input="Stok Produk"
                value={String(Form.stokproduk==null?'':Form.stokproduk)}
                onChangeText={(value) => onInputChange(value, 'stokproduk')}
                keyboardType="number-pad"
              />
            </View>
            {errors.stokproduk && <Text style={styles.errorText}>{errors.stokproduk}</Text>}

            <Label label="Kategori Produk" />
            <TouchableOpacity
              style={styles.formGroup}
              onPress={() => setModalVisibleCategory(true)}
            >
              <Text style={{ color: '#000', padding: 8 }}>
                {Form.kategoriproduk || 'Pilih Kategori'}
              </Text>
            </TouchableOpacity>
            {errors.kategoriproduk && <Text style={styles.errorText}>{errors.kategoriproduk}</Text>}

            <View style={styles.wrapButton}>
              <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal transparent={true} visible={modalVisibleCategory}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setModalVisibleCategory(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Category</Text>
              <ScrollView style={{ flex: 1, marginBottom: 42 }}>
                {Datakateogri && Datakateogri.length > 0 ? (
                  Datakateogri.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.btnitemcategory}
                      onPress={() => {
                        dispatch(setForm('kategoriproduk', item.nama_kategori));
                        dispatch(setForm('idkategori', item.kode_kategori));
                        setModalVisibleCategory(false);
                      }}
                    >
                      <Text style={{ color: '#000', textAlign: 'center' }}>{item.nama_kategori}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ color: '#000', textAlign: 'center' }}>Tidak Ada Data Kategori</Text>
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
      <Modal transparent={true} visible={modalVisibleCategory}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisibleCategory(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Category</Text>
            <ScrollView style={{ flex: 1, marginBottom: 42 }}>
              {Datakateogri && Datakateogri.length > 0 ? (
                Datakateogri.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.btnitemcategory}
                    onPress={() => {
                      dispatch(setForm('kategoriproduk', item.nama_kategori));
                      dispatch(setForm('idkategori', item.kode_kategori));
                      setModalVisibleCategory(false);
                    }}
                  >
                    <Text style={{ color: '#000', textAlign: 'center' }}>{item.nama_kategori}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: '#000', textAlign: 'center' }}>Tidak Ada Data Kategori</Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default FormEdit;
const DWidth = Dimensions.get('window').width;
const DHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  wrapCard: {
    marginVertical: 8,
  },
  formGroup: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 8,
  },
  wrapButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: DWidth / 1.2,
    height: DHeight / 3.5,
    borderRadius: 12,
  },
  modalTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 12,
  },
  btnitemcategory: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
});
