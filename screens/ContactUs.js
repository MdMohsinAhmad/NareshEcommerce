import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import URL_path from '../URL';

const ContactUs = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        if (!name || !email || !message) {
            Alert.alert('Error', 'Please fill out all fields!');
            return;
        }

        await axios.post(`${URL_path}/contactus`, { name, email, message })
            .then(() => {
                Alert.alert("Congrats", "Your message sent ")
                setName('');
                setEmail('');
                setMessage('');
            })
            .catch(() => {
                Alert.alert("Error", "Please try again ")

            })
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{
                    uri: 'https://img.freepik.com/free-vector/contact-us-concept-illustration_114360-2299.jpg',
                }}
                style={styles.banner}
            />
            <Text style={styles.heading}>Contact Us</Text>
            <Text style={styles.subheading}>
                Have questions or feedback? We'd love to hear from you!
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Your Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Your Message"
                placeholderTextColor="#aaa"
                value={message}
                onChangeText={(text) => setMessage(text)}
                multiline={true}
                numberOfLines={4}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f4f4f9',
        alignItems: 'center',
    },
    banner: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subheading: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 22,
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        width: '100%',
        backgroundColor: '#ff6347',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ContactUs;
