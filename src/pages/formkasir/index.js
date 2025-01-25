import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Input from '../../component/input';
import Label from '../../component/label';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setForm } from '../../redux/action';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../../config';

const { width: DWidth, height: DHeight } = Dimensions.get('window');

const Formkasir = ({ route }) => {
  const params = route.params.data;
  const navigation = useNavigation();
  const FormReducer = useSelector((state) => state.FormReducer);
  const dispatch = useDispatch();

  const [Check, setCheck] = useState(false);
  const [modalVisibleCategory, setModalVisibleCategory] = useState(false);
  const [Datakateogri, setDatakateogri] = useState([]);
  const [errors, setErrors] = useState({});

  const handleBackButtonClick = () => {
    navigation.goBack();
    dispatch({ type: 'RM_FORM' });
    return true;
  };

  const get = async () => {
    dispatch({ type: 'RM_FORM' })
    const token = await AsyncStorage.getItem('tokenAccess');
    try {
      const res = await axios.get(`${BASE_URL}/kategori`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDatakateogri(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!FormReducer.form.namaproduk || FormReducer.form.namaproduk.trim() === '') {
      newErrors.namaproduk = 'Nama produk harus diisi';
    }
    if (!FormReducer.form.hargaproduk || isNaN(FormReducer.form.hargaproduk)) {
      newErrors.hargaproduk = 'Harga produk harus berupa angka';
    }
    if (FormReducer.form.stokproduk && isNaN(FormReducer.form.stokproduk)) {
      newErrors.stokproduk = 'Stok produk harus berupa angka';
    }
    if (!FormReducer.form.kategoriproduk || FormReducer.form.kategoriproduk.trim() === '') {
      newErrors.kategoriproduk = 'Kategori produk harus dipilih';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onPress = async () => {
    if (!validateInputs()) return;

    try {
      const token = await AsyncStorage.getItem('tokenAccess');
      const response = await axios.post(
        `${BASE_URL}/produk`,
        {
          id_toko: params.id_toko,
          nama_produk: FormReducer.form.namaproduk,
          harga: FormReducer.form.hargaproduk,
          stok: FormReducer.form.stokproduk,
          kode_kategori: FormReducer.form.idkategori,
          is_stock_managed: FormReducer.form.stokproduk > 0 ? 1 : 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === 'success') {
        dispatch({ type: 'RM_FORM' });
        navigation.goBack();
        setCheck(!Check);
      }
    } catch (error) {
      console.log(error.response)
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const onInputChange = (value, input) => {
    dispatch(setForm(input, value));
    setErrors((prev) => ({ ...prev, [input]: null }));
  };

  useEffect(() => {
    get();
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, [Check]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Form Tambah Produk</Text>
        <View style={styles.card}>
          <View style={styles.wrapCard}>
            <Label label="Nama Produk" />
            <View style={styles.formGroup}>
              <Input
                input="Nama Produk"
                value={FormReducer.form.namaproduk}
                onChangeText={(value) => onInputChange(value, 'namaproduk')}
              />
            </View>
            {errors.namaproduk && <Text style={styles.errorText}>{errors.namaproduk}</Text>}

            <Label label="Harga Produk" />
            <View style={styles.formGroup}>
              <Input
                input="Harga Produk"
                value={FormReducer.form.hargaproduk}
                onChangeText={(value) => onInputChange(value, 'hargaproduk')}
                keyboardType="number-pad"
              />
            </View>
            {errors.hargaproduk && <Text style={styles.errorText}>{errors.hargaproduk}</Text>}

            <Label label="Stok Produk" />
            <View style={styles.formGroup}>
              <Input
                input="Stok Produk"
                value={FormReducer.form.stokproduk}
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
                {FormReducer.form.kategoriproduk || 'Pilih Kategori'}
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
    </View>
  );
};

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

export default Formkasir;