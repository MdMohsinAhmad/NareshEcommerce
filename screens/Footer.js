import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
    const navigation = useNavigation()
    const year = new Date().getFullYear();
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('policy')}>
                <Text style={styles.text}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('contentpolicy')}>
                <Text style={styles.text}>Content Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('termsservices')}>
                <Text style={styles.text}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} >
                <Text style={styles.text1}>Contact Us :</Text>
                <Text style={styles.text}>orderkarokrp@gmail.com</Text>
            </TouchableOpacity>
            <Text style={styles.copyRight}>© {year} [Order Karo]. All rights reserved.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    link: {
        marginVertical: 5,flex:1,justifyContent:'space-between',flexDirection:'row',gap:5
    },
    text1: {
        color: '#2d3436',
        fontSize: 17,fontWeight:'bold'
    },
    text: {
        color: '#007BFF',
        fontSize: 16,
    },
    copyRight: {
        marginTop: 10,
        fontSize: 14,
        color: '#555',
    },
});

export default Footer;
