import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import ProductInfoScreen from '../screens/ProductInfoScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import AddressScreen from '../screens/AddressScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import OrderScreen from '../screens/OrderSuccessScreen';
import YourAccount from '../Dashboard/YourAccount';
import OrderHistory from '../Dashboard/YourOrders';
import CustomHeader from './orderHeader';
import HomeHeader from './HomeHeader';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ResetPassword from '../screens/ResetPassword';
import RequestResetPassword from '../screens/RequestResetPassword';
import { useSelector } from 'react-redux';
import OrderFailureScreen from '../screens/OrderFailureScreen';
import { StatusBar } from 'react-native';
import SelectedItems from '../screens/SelectedItems';
import RestaurantFood from '../screens/RestaurantFood';
import SplashScreen from '../screens/SplashScreen';
import FoodDetails from '../screens/FoodDetails';
import RestaurentList from '../screens/RestaurentList';
import ContactUs from '../screens/ContactUs';
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    const cart = useSelector((state) => state.cart.cart);

    return (
      <Tab.Navigator >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarLabelStyle: { color: '#0a3d62' },
            header: () => <HomeHeader title="Home" />,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#0a3d62" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown:false,
            tabBarLabelStyle: { color: '#0a3d62' },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="#0a3d62" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: 'Cart',
            tabBarLabelStyle: { color: '#0a3d62' },
            header: () => <CustomHeader title="Cart" />,
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', position: 'relative' }}>
                {cart.length > 0 && (
                  <Text style={{ color: 'white', fontSize: 13, position: 'absolute', top: -5, right: -10, fontWeight: 'bold', backgroundColor: 'gray', borderRadius: 50, width: 18, textAlign: 'center' }}>{cart.length}</Text>
                )}
                {focused ? (
                  <FontAwesome5 name="shopping-cart" size={20} color="#0a3d62" />
                ) : (
                  <AntDesign name="shoppingcart" size={24} color="black" />
                )}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='splashscreen'>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RequestPassword"
          component={RequestResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Info"
          component={ProductInfoScreen}
          options={{
            headerTitle: 'Item Information'
          }}
        />
        <Stack.Screen
          name="Address"
          component={AddAddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add"
          component={AddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Confirm"
          component={ConfirmationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderFailure"
          component={OrderFailureScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="yourOrder"
          component={OrderHistory}
          options={{
            headerTitle: 'Order History'
          }}
        />
        <Stack.Screen
          name="yourAccount"
          component={YourAccount}
          options={{ headerShown: true,headerTitle: 'Account', }}
        />
        <Stack.Screen
          name="selecteditems"
          component={SelectedItems}
          options={{ headerShown: true, headerTitle: 'Items List' }}
        />
        <Stack.Screen
          name="restaurants"
          component={RestaurantFood}
          options={{ headerShown: true, headerTitle: 'Restaurent Items' }}
        />
        <Stack.Screen
          name="splashscreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="fooddetails"
          component={FoodDetails}
          options={{ headerShown: true, headerTitle: 'Food Details' }}
        />
        <Stack.Screen
          name="restaurantlist"
          component={RestaurentList}
          options={{ headerShown: true, headerTitle: 'Restaurents List' }}
        />
        <Stack.Screen
          name="contactUs"
          component={ContactUs}
          options={{ headerShown: true, headerTitle: 'Contact Us' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
