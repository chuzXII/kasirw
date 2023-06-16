import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AbstractChart, BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";
// import { useState } from 'react';
const ChartTransaksi = ({ dataTransaksi }) => {
    const totalHargaPerBulan = {};
    // console.log(dataTransaksi)

    dataTransaksi.forEach((transaksi) => {
        const harga_total = parseInt(transaksi[4]);
        const timestamp = parseInt(transaksi[6]);
        const tglPembelian = new Date(timestamp);
        const namaBulan = tglPembelian.toLocaleString('default', { month: 'long' }); // Menggunakan nama bulan

        if (totalHargaPerBulan[namaBulan]) {
            totalHargaPerBulan[namaBulan] += harga_total;
        } else {
            totalHargaPerBulan[namaBulan] = harga_total;
        }
    });
    // Pisahkan bulan dan total harga ke dalam array terpisah
    // const bulan = Object.keys(totalHargaPerBulan);
    // const totalHarga = Object.values(totalHargaPerBulan).map((harga) =>
    //     harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    // );

    const bulan = Object.keys(totalHargaPerBulan)
    const totalHarga = Object.values(totalHargaPerBulan)
    console.log(totalHarga)

    // Konfigurasi chart
    const chartConfig = {
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        },
        minValue: 0, // Nilai minimum sumbu Y
        maxValue: 100, // Nilai maksimum sumbu Y
        labelCount: 2, 
        strokeWidth: 2,
        

    };
    return (
        
            <AbstractChart
                data={{
                    labels: ["January", "February", "March", "April", "May", "June"],
                    datasets: [
                        {
                            data: [20, 45, 28, 80, 99, 43]
                        }
                    ]
                }}
                width={300}
        height={200}
        chartConfig={chartConfig}
        
        style={{ marginVertical: 8, borderRadius: 16 }}
            // style={{ marginLeft: 30 }}// Memformat label sumbu Y dengan tanda titik sebagai pemisah ribuan
            />



    )
}

export default ChartTransaksi
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({})