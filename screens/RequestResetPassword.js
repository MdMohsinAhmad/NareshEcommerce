// RequestResetPassword.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const RequestResetPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)

    const handleRequestReset = async () => {
        setLoading(true)
        try {
            await axios.post('http://192.168.31.155:8800/requestpassword/token', { email });
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
