import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Label from '../../component/label';
import Input from '../../component/input';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../../../config';
import { setForm } from '../../redux/action';

const Formtoko = () => {
    const navigation = useNavigation();
    const FormReducer = useSelector((state) => state.FormTokoReducer);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});

    const validate = () => {
        let valid = true;
        let tempErrors = {};

        if (!FormReducer.form.namatoko || FormReducer.form.namatoko.trim() === '') {
            tempErrors.namatoko = 'Nama Toko harus diisi';
            valid = false;
        }

        if (!FormReducer.form.alamattoko || FormReducer.form.alamattoko.trim() === '') {
            tempErrors.alamattoko = 'Alamat Toko harus diisi';
            valid = false;
        }

        setErrors(tempErrors);
        return valid;
    };

    const onPress = async () => {
        if (!validate()) {
            // Alert.alert('Error', 'Mohon isi semua kolom dengan benar.');
            return;
        }

        const token = await AsyncStorage.getItem('tokenAccess');

        try {
            await axios.post(
                `${BASE_URL}/toko`,
                {
                    nama_toko: FormReducer.form.namatoko,
                    alamat_toko: FormReducer.form.alamattoko,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                }
            );
            Alert.alert('Sukses', 'Data berhasil disimpan.');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal menyimpan data. Coba lagi nanti.');
        }
    };

    const onInputChange = (value, input) => {
        dispatch(setForm(input, value));
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            >
                <View style={styles.card}>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>Form Toko</Text>
                    </View>
                    <View style={styles.warpcard}>
                        <Label label={'Nama Toko'} />
                        <View style={styles.formgroup}>
                            <Input
                                placeholder={'Nama Toko'}
                                value={FormReducer.form.namatoko}
                                onChangeText={(value) => onInputChange(value, 'namatoko')}
                            />

                        </View>
                        {errors.namatoko && <Text style={styles.errorText}>{errors.namatoko}</Text>}
                        <Label label={'Alamat Toko'} />
                        <View style={styles.formgroup}>
                            <Input
                                placeholder={'Alamat Toko'}
                                value={FormReducer.form.alamattoko}
                                onChangeText={(value) => onInputChange(value, 'alamattoko')}
                            />

                        </View>
                        {errors.alamattoko && <Text style={styles.errorText}>{errors.alamattoko}</Text>}

                        <View style={styles.wrapbutton}>
                            <TouchableOpacity style={styles.button} onPress={onPress}>
                                <Text style={styles.buttontxt}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const DWidth = Dimensions.get('window').width;
const DHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    card: {
        borderRadius: 15,
        backgroundColor: '#fff',
        width: DWidth * 0.9,
        elevation:2,
        paddingVertical: 20,
    },
    titleWrapper: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#151B25',
    },
    warpcard: {
        marginHorizontal: DWidth * 0.05,
        justifyContent: 'center',
    },
    formgroup: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 0,
        padding: 4,
    },
    wrapbutton: {
        marginTop: 14,
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        width: DWidth * 0.7,
        height: DHeight / 15,
        backgroundColor: '#151B25',
    },
    buttontxt: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export default Formtoko;
