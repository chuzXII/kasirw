import { StyleSheet, Text, View,Dimensions,TouchableOpacity,Image} from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RNFS from 'react-native-fs'
import moment from 'moment';

const Cardcatalog = ({item}) => {
  
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
      var idpproduk = item.id_produk;
      var harga = item.hargaproduk
      var count = 1
      setCart(item,idpproduk,count,harga,id_tensaksi)
  }
  return (
    <TouchableOpacity style={styles.wrapCard} onPress={()=>handdlebutton()}>
      <View style={styles.wrapImg}>
        <Image  source={{
            uri:
              'file://' +
              RNFS.DownloadDirectoryPath +
              '/dataimg/' +
              item.imgname+ '?' + new Date()
          }} style={{flex:1,borderRadius: 6,}}></Image>
      </View>
   
    <View style={styles.wrapContentCard}>
      <Text style={styles.textTitle}>{item.namaproduk}</Text>
      <Text style={styles.textStok}>{item.deskproduk}</Text>
      <Text style={styles.textHarga}>Rp.{currency.format(item.hargaproduk)}</Text>
    </View>
  </TouchableOpacity>
  )
}

export default Cardcatalog
const Dwidth = Dimensions.get('window').width;
const Dheight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    wrapCard: {
      maxWidth: Dwidth * 0.46,
        marginHorizontal: 5,
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
        
        
    },
    wrapImg: {
        width: Dwidth * 0.44,
        height: Dheight * 0.2,
        
    },
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