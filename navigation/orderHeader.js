// CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomHeader = ({ title }) => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 100, // Set the desired height here
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
        backgroundColor: '#f9f9f9', // Background color
        elevation: 5, // Optional: Add shadow for Android
    },
    headerTitle: {
        fontSize: 24, // Adjust font size as needed
        fontWeight: 'bold',
        color: '#333',
    },
});

export default CustomHeader;
