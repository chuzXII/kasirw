import { StyleSheet, Text, View,Dimensions,TouchableOpacity,Image} from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RNFS from 'react-native-fs'
import moment from 'moment';
import { useState } from 'react';

const Cardcatalog = ({item,oriented}) => {
  const dispatch = useDispatch()
  const currency= new Intl.NumberFormat('id-ID')

  const TRXReducer = useSelector(state=>state.TRXReducer)

  const setCart = (item, idpproduk, count, harga,id_tensaksi) => {
    var ids="";
    if (TRXReducer.id_produk==null){
      ids = id_tensaksi
    }
    else{
      ids = TRXReducer.id_produk
    }
  
    let cart ={
      idtrx:ids,
      item:item,
      id:idpproduk,
      count:count,
      subTotal:harga,
    }
    dispatch({type:'CART',value:cart})
  }
  const setidproduk = (id) => { 
    dispatch({type:'IDPRODUK',value:id})
  }
  const handdlebutton= ()=>{
    const rawdate = new Date()
    const date = moment(rawdate).format('DD-MM-YY').split('-')
    const id_tensaksi =
      'TRX-' +
      date[0]+date[1]+date[2]+
      Math.floor(Math.random() * 1000000) +
      1;
      setidproduk(id_tensaksi)
      var idpproduk = item[0];
      var harga = item[2]
      var count = 1
      setCart(item,idpproduk,count,harga,id_tensaksi)
  }
  return (
    <TouchableOpacity style={styles.wrapCard(oriented)} onPress={()=>handdlebutton()}>
      <View style={styles.wrapImg(oriented)}>
        {item[6]==undefined?item[1].split(' ').length<=1?
         <View style={{flex:1,borderRadius: 6,backgroundColor:'#252525',alignItems:'center',justifyContent:'center'}}>
         <Text style={{fontSize:32,fontWeight:'bold'}}>{item[1].slice(0,1).toUpperCase()+item[1].slice(1,2).toUpperCase()}</Text>
        </View>: <View style={{flex:1,borderRadius: 6,backgroundColor:'#252525',alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:32,fontWeight:'bold'}}>{item[1].split(' ')[0].slice(0,1).toUpperCase()+item[1].split(' ')[1].slice(0,1).toUpperCase()}</Text>
        </View>:<Image  source={{uri:item[6]}} style={{flex:1,borderRadius: 6}}></Image> 
        }
       
      </View>
   
    <View style={styles.wrapContentCard}>
      <Text style={styles.textTitle}>{item[1]}</Text>
      <Text style={styles.textStok}>Stok : {item[4]}</Text>
      <Text style={styles.textHarga}>Rp.{currency.format(item[2])}</Text>
      


    </View>
  </TouchableOpacity>
  )
}

export default Cardcatalog
const Dwidth = Dimensions.get('window').width;
const Dheight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    wrapCard :(Oriented)=>({
      maxWidth:Oriented=='portrait'? Dwidth * 0.47: Dwidth * 0.5,
        marginLeft: 8,
        marginTop: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#626262',
        backgroundColor:'#fff',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        
        elevation: 6,    
    }),
    wrapImg: (Oriented)=>({
        width:Oriented=='portrait'? Dwidth * 0.44:Dwidth * 0.48,
        height:Oriented=='portrait'? Dheight * 0.2:Dheight * 0.28,
        
    }),
    wrapContentCard: {
        marginHorizontal: 8,
    },textTitle: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'TitilliumWeb-Bold',
    },
    textStok: {
        marginBottom: 18,
        color: '#000',
        fontSize: 14,
        fontFamily: 'TitilliumWeb-Light',
    },
    textHarga: {
        marginBottom: 8,
        color: '#000',
        fontSize: 14,
        textAlign: 'right',
        fontFamily: 'TitilliumWeb-Regular',
    },
})