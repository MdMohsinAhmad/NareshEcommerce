import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
 
const RestaurantCard = ({ navigation, item }) => {
    const { name, image, address, rating } = item;

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('restaurants', { restaurantId: item })}

            style={styles.card}
        >
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.address}>{address}</Text>
                <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const RestaurantList = ({ route, navigation }) => {
    const restaurants = route.params;

    return (
        <FlatList
            data={restaurants}
            renderItem={({ item }) => (
                <RestaurantCard 
                    navigation={navigation}
                    item={item}
                />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 4, // Adds shadow for Android
        shadowColor: '#000', // Adds shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    image: {
        height: 150,
        width: '100%',resizeMode:"cover"
    },
    infoContainer: {
        padding: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    address: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    rating: {
        fontSize: 16,
        color: '#FFD700', // Gold color for rating
        fontWeight: '600',
    },
});

export default RestaurantList;
