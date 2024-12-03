// RequestResetPassword.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import axios from 'axios';
import URL_path from '../URL';
const RequestResetPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)

    const handleRequestReset = async () => {
        setLoading(true)
        try {
            await axios.post(`${URL_path}/requestpassword/token`, { email });
            Alert.alert('Success', 'Check your email for the reset link.');
            setTimeout(() => {
                navigation.navigate('Login')
            }, 1000)
            setLoading(false)
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong.');
            setLoading(false)
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Request Password Reset</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                required
            />
            {loading ? <Button title="Sending reset link..." /> :
                <Button title="Request Reset" onPress={handleRequestReset} />}
            <Pressable onPress={()=>navigation.navigate('Login')} style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', width: '100%', padding: 10, borderRadius: 10, fontSize: 16, fontWeight: 'bold' }}>
                <Text style={{ color:'white',fontSize: 17, fontWeight: 'bold' ,backgroundColor:'#0984e3',paddingVertical:10,borderRadius:6,paddingHorizontal:20}}>Home</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
});

export default RequestResetPassword;
