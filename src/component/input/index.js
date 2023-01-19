import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'

const Input = ({input,...rest}) => {
    return (
        <View style={styles.formgroup}>
            <TextInput placeholder={input} 
            multiline={true}
            placeholderTextColor={'#000'}
            style={{color:'#000'}}
            {...rest}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    formgroup: {
        borderWidth:1,
        borderColor:'#a9e893',
        borderRadius: 12,
        backgroundColor: '#f4fff0',
        
    },
})