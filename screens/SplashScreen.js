import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect } from 'react';

const SplashScreen = ({ navigation }) => {


    // Set a timeout for the splash screen display, then check login status
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Login')
        }, 2000);
    }, []);

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
    },
    image: {
        width: 350,
        height: 350,
    },
});

export default SplashScreen;
