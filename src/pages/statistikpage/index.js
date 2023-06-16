import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ChartTransaksi from '../../component/charttransaksi';
import { useIsFocused } from '@react-navigation/native';

const StatistikPage = () => {
    const isFocused = useIsFocused();
    const [Data, setData] = useState([])
    const get = async () => {
        const sheetid = await AsyncStorage.getItem('TokenSheet');
        const token = await AsyncStorage.getItem('tokenAccess');
        // setModalVisibleLoading(true);
        await axios
            .get(
                'https://sheets.googleapis.com/v4/spreadsheets/' +
                sheetid +
                '/values/Transaksi',
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
            )
            .then(res => {
                const datas = res.data.values
                const uniqueIdtrx = new Set(datas.map((transaksi) => transaksi[0]));
                const dataTransaksiUnik = [...uniqueIdtrx].map((idtrx) => {
                    return datas.find((transaksi) => transaksi[0] === idtrx);
                });
                setData(dataTransaksiUnik)
                // console.log(res.data.values)
            })
            .catch(error => {
                console.log(error)
                // if (error.response) {
                //   // The request was made and the server responded with a status code
                //   // that falls out of the range of 2xx
                //   console.log(error.response.data);
                //   console.log(error.response.status);
                //   console.log(error.response.headers);
                // //   alert(error.message);
                // //   setRefreshing(false);
                // } else if (error.request) {
                //   // The request was made but no response was received
                //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                //   // http.ClientRequest in node.js
                //   console.log(error.request);
                //   alert(error.message);
                //   setRefreshing(false);
                // } else {
                //   // Something happened in setting up the request that triggered an Error
                //   console.log('Error', error.message);
                //   alert(error.message);
                //   setRefreshing(false);
                // }
                // console.log(error.config);
            });
    };


    useEffect(() => {
        get();
    }, [isFocused]);

    return (
        Data.length > 0 ?
          
                <ChartTransaksi dataTransaksi={Data} />
           
            : <View></View>

    )
}

export default StatistikPage

const styles = StyleSheet.create({
    wrap:{
        marginHorizontal:12
    }
})