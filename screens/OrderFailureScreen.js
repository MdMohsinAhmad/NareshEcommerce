import { StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

const OrderFailureScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Main');
    }, 2000);
  }, []); 


  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <LottieView
        source={require('../assets/paymentfailed.json')}
        style={{
          height: 280,
          width: 320,
          alignSelf: 'center',
          marginTop: 40,
          justifyContent: 'center',
        }}
        autoPlay
        loop={false}
        speed={0.7}
      />
      <Text
        style={{
          marginTop: 20,
          fontSize: 19,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        Your Order Has been Failed
      </Text>
      
    </SafeAreaView>
  );
};

export default OrderFailureScreen;

const styles = StyleSheet.create({});
