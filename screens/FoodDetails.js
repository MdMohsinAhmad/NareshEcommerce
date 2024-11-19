import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const FoodDetails = ({ route }) => {
    const { item } = route.params; // Destructure params

    const handleAddToCart = () => {
        // Logic to add the item to the cart
        alert(`${item.name} added to cart!`);
    };

    const handleBuyNow = () => {
        // Logic to proceed to the checkout or purchase the item
        alert(`Proceeding to buy ${item.name}!`);
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: item.imageurl }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>Rs {item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* Add to Cart Button */}
            <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>

            {/* Buy Now Button */}
            <TouchableOpacity style={[styles.button, styles.buyNowButton]} onPress={handleBuyNow}>
                <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FoodDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',marginTop:25
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#FF6347', // Tomato color for price
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    button: {
        width: '80%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#4CAF50', // Green color for add to cart
        borderRadius: 8,
        alignItems: 'center',
    },
    buyNowButton: {
        backgroundColor: '#FF6347', // Tomato red color for buy now
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});
