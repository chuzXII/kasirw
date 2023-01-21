import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ItemDiskon = ({namadiskon,diskon,...props}) => {
  return (
   <TouchableOpacity {...props} style={{justifyContent:'space-between',flexDirection:'row',backgroundColor:'#fff',elevation:4,marginHorizontal:2,padding:12,borderRadius:8}} >
        <Text style={{color: '#000'}}>{namadiskon}</Text>
        <Text style={{color: '#000'}}>{diskon.split('-').length<=1?'Rp.'+diskon.split('-')[0]:diskon.split('-')[0]+'%'}</Text>
   </TouchableOpacity>
  )
}

export default ItemDiskon

const styles = StyleSheet.create({})