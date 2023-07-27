import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Formkasir from '../pages/formkasir';
import Dashboard from '../pages/dashboard';
import { useNavigation } from '@react-navigation/native';
import Cartpage from '../pages/cartpage';
import Setupage from '../pages/setup';
import GuidePage from '../pages/guide';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Iabout, Idiskon, Idrawer, Ihistory, Ihome, Ilist, Isexcel, Isprint, Ichart, Iscan } from '../assets/icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import SetupPrinter from '../pages/setupprinter';
import CustomDrawer from '../component/customdrawer';
import AboutPage from '../pages/aboutpage';
import FinalPage from '../pages/finalpage';
import Splashscreen from '../pages/splashscreen';
import HistoryPage from '../pages/historypage';
import HistoryItemPage from '../pages/historyitempage';
import DiskonPage from '../pages/diskonpage';
import FormDiskon from '../pages/formdiskon';
import ListKatalog from '../pages/listkatalogpage';
import FormEdit from '../pages/formeditkatalog';
import PengeluaranPage from '../pages/pengeluaranpage';
import StatistikPage from '../pages/statistikpage';
import Camscan from '../component/Camscan';



const Routes = ({ navigation }) => {
  const Stack = createNativeStackNavigator();
  const Navigation = useNavigation()
  const Drawer = createDrawerNavigator()
  const [cek, setCek] = useState(false)
  const get = async () => {
    const cek = await AsyncStorage.getItem('TokenSheet')
    if (cek) {
      setCek(true)
    }
  }
  useEffect(() => {
    get()
  }, [])
  const Routestack = () => {
    return (
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ drawerLabelStyle: { fontFamily: 'TitilliumWeb-Bold' } }}>
        <Drawer.Screen name='dashboard' component={Dashboard} options={({ navigation }) => ({
          drawerIcon: ({ focused, size }) => (<Ihome />),
          title: 'Home', headerStyle: {
            backgroundColor: '#A5ACFF',

          }, headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 12 }}>
              <Idrawer />
            </TouchableOpacity>
          ), headerRight: () => (
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={() => Navigation.navigate('camscan',true)} style={{alignItems:'center',justifyContent:'center'}}>
                <Iscan/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Navigation.navigate('formkasir')} style={{ borderRadius: 15, backgroundColor: '#9B5EFF', width: 85, height: 30, alignItems: 'center', justifyContent: 'center', marginHorizontal: 12 }}>
                <Text style={{ color: '#fff' }}>KATALOG</Text>
              </TouchableOpacity>
            </View>

          ),
        })} />
        <Drawer.Screen name='listkatalog' component={ListKatalog} options={{ title: 'Daftar Katalog', drawerIcon: ({ focused, size }) => (<Ilist />) }} />
        <Drawer.Screen name='historypage' component={HistoryPage} options={{ title: 'Riwayat Transaksi', drawerIcon: ({ focused, size }) => (<Ihistory />) }} />
        <Drawer.Screen name='diskonpage' component={DiskonPage} options={{ title: 'Diskon', drawerIcon: ({ focused, size }) => (<Idiskon />) }} />
        <Drawer.Screen name='pengeluaranpage' component={PengeluaranPage} options={{ title: 'Pengeluaran', drawerIcon: ({ focused, size }) => (<Ilist />) }} />
        <Drawer.Screen name='statistikpage' component={StatistikPage} options={{ title: 'Statistik', gesturesEnabled: true, drawerIcon: ({ focused, size }) => (<Ichart />) }} />
        <Drawer.Screen name='setupage' component={Setupage} options={{ title: 'Setup Spreedsheet', headerShown: false, drawerIcon: ({ focused, size }) => (<Isexcel />) }} />
        <Drawer.Screen name='SetupPrinter' component={SetupPrinter} options={{ title: 'Setup Printer', headerShown: false, drawerIcon: ({ focused, size }) => (<Isprint />) }} />
        <Drawer.Screen name='aboutpage' component={AboutPage} options={{ title: 'About', headerShown: false, drawerIcon: ({ focused, size }) => (<Iabout />) }} />


      </Drawer.Navigator>
    )
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name='splashscreen' component={Splashscreen} options={{ headerShown: false }} />
      {cek == false ? <Stack.Screen name='GuidePage' component={GuidePage} options={{ headerShown: false }} /> : null}
      <Stack.Screen name='Routestack' component={Routestack} options={{ headerShown: false }} />
      <Stack.Screen name='formkasir' component={Formkasir} options={{ title: 'Tambah Katalog' }} />
      <Stack.Screen name='camscan' component={Camscan} options={{ }} />
      <Stack.Screen name='setupage' component={Setupage} />
      <Stack.Screen name='cartpage' component={Cartpage} options={{ title: 'Keranjang' }} />
      <Stack.Screen name='historyitempage' component={HistoryItemPage} options={{ title: 'Detail History' }} />
      <Stack.Screen name='formdiskon' component={FormDiskon} options={{ title: 'Tambah Diskon' }} />
      <Stack.Screen name='formedit' component={FormEdit} options={{ title: 'Edit Menu' }} />
      <Stack.Screen name='finalpage' component={FinalPage} options={{ headerShown: false }} />

    </Stack.Navigator>

  )
}

export default Routes

const styles = StyleSheet.create({})