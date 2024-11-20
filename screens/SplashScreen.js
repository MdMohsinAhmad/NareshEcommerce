import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect } from 'react';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Use 'replace' to ensure the SplashScreen is replaced in the stack
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timeout); // Cleanup timeout if the component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/nobglogo.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: Set background color for the splash screen
  },
  image: {
    width: 450,
    height: 450,
    resizeMode: 'contain', // Ensures the image scales properly
  },
});

export default SplashScreen;
