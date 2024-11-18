import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const RestaurantFood = ({ route }) => {
    const { restaurantId } = route.params; // Destructure params
    const { name, address, image, rating } = restaurantId;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name}</Text>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.address}>{address}</Text>
            <Text style={styles.rating}>Rating: {rating} ⭐</Text>
        </View>
    );
};

export default RestaurantFood;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',marginTop:20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    address: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    rating: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
    },
});
