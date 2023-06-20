import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import { useState } from 'react';

// import { useState } from 'react';
const ChartTransaksi = ({ dataTransaksi }) => {
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [selectedBulan, setSelectedBulan] = useState(null);
    const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());
    const [modalVisible, setModalVisible] = useState(false);
    const currentYear = new Date().getFullYear();
    const currency = new Intl.NumberFormat('id-ID');

    // Menghasilkan daftar tahun mulai dari 1950 hingga tahun saat ini
    const yearOptions = Array.from({ length: currentYear - 1950 + 1 }, (_, index) =>
        (currentYear - index).toString()
    );
    const filteredData = dataTransaksi.filter((fill) => {
        const timestamp = fill[6];
        const timestampYear = new Date(parseInt(timestamp)).getFullYear();
        return timestampYear === parseInt(selectedTahun);
    });

    const totalHargaPerBulan = {};
    filteredData.forEach((transaksi) => {
        const harga_total = parseInt(transaksi[4]);
        const tglPembelian = new Date(parseInt(transaksi[6]));
        const namaBulan = tglPembelian.toLocaleString('default', { month: 'long' }); // Menggunakan nama bulan

        if (totalHargaPerBulan[namaBulan]) {
            // Jika sudah ada, tambahkan harga_total pada bulan tersebut
            totalHargaPerBulan[namaBulan] += harga_total;
        } else {
            // Jika belum ada, inisialisasi dengan harga_total pada transaksi tersebut
            totalHargaPerBulan[namaBulan] = harga_total;
        }
    });

    const bulan = Object.keys(totalHargaPerBulan)
    const totalHarga = Object.values(totalHargaPerBulan)



    const handleDataPointClick = (data) => {

        setSelectedDataset(data.value);
        setSelectedBulan(bulan[data.index])

    }
    // Konfigurasi chart
    const chartConfig = {
        backgroundColor: "#5700e2",
        backgroundGradientFrom: "#4D5AFF",
        backgroundGradientTo: "#9B5EFF",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#4096f7"
        },
        propsForBackgroundLines: {
            strokeDasharray: 5, // Gaya garis (misalnya '5, 10' untuk garis putus-putus)
            strokeWidth: 0.5, // Lebar garis
            stroke: '#ddd', // Warna garis
        },

    };



    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>Statistik Pemasukan</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View>
                    <Text style={styles.bulan}>Bulan : {selectedDataset !== null ? selectedBulan : '-'}</Text>
                    <Text style={styles.total}>Total   : {selectedDataset !== null ? 'Rp.' + currency.format(selectedDataset) : '-'}</Text>
                </View>
                <View>
                    <TouchableOpacity style={{borderWidth:1,borderRadius:4,padding:8}} onPress={() => {
                        setModalVisible(true);
                    }}>
                        <Text style={{ color: '#000',fontSize:16,fontFamily:'TitilliumWeb-Regular',alignItems:'center' }}>{selectedTahun}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {bulan.length > 0 ?
                <LineChart
                    data={{
                        labels: bulan,
                        datasets: [
                            {
                                data: totalHarga
                            }
                        ]
                    }}
                    width={screenWidth * 0.94}
                    height={250}
                    chartConfig={chartConfig}
                    onDataPointClick={handleDataPointClick}
                    yAxisLabel={'Rp'}
                    horizontalLabelRotation={-50}
                    verticalLabelRotation={5}
                    yLabelsOffset={5}
                    fromZero={true}
                    segments={3}
                    formatYLabel={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Memformat label sumbu Y dengan tanda titik sebagai pemisah ribuan
                    style={{
                        borderRadius: 12,
                    }}
                /> : <LineChart

                    data={{

                        labels: ['januari'],
                        datasets: [
                            {
                                data: [0]
                            }
                        ]
                    }}
                    width={screenWidth * 0.94}
                    height={250}
                    chartConfig={chartConfig}
                    yAxisLabel={'Rp'}
                    horizontalLabelRotation={-50}
                    verticalLabelRotation={5}
                    yLabelsOffset={5}
                    fromZero={true}
                    segments={3}
                    style={{
                        borderRadius: 12,
                    }}
                />}
            <Modal transparent={true} visible={modalVisible}>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                    }}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            width: screenWidth / 1.2,
                            height: Dheight / 2.5,
                            borderRadius: 12,

                        }}>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    color: '#000',
                                    fontSize: 20,
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    marginVertical: 12,
                                }}>
                                Category
                            </Text>
                            <ScrollView style={{ flex: 1, marginBottom: 42 }}>
                                {yearOptions.map((item, i) => {
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            style={styles.btnitemcategory}
                                            onPress={() => { setSelectedTahun(item), setModalVisible(!modalVisible) }}>
                                            <Text style={{ color: '#000', textAlign: 'center' }}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default ChartTransaksi
const screenWidth = Dimensions.get("window").width;
const Dheight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    wrap: {

        // marginHorizontal: 12
    },
    title: {
        textAlign: 'center',
        fontSize: 21,
        color: '#000',
        fontFamily: 'TitilliumWeb-Bold'
    },
    bulan: {
        fontSize: 18,
        color: '#000',
        fontFamily: 'TitilliumWeb-Regular'
    },
    total: {
        fontSize: 18,
        color: '#000',
        fontFamily: 'TitilliumWeb-Regular',
        marginBottom: 12
    },
    btnitemcategory: {
        padding: 18,
        backgroundColor: '#ededed',
    },
})