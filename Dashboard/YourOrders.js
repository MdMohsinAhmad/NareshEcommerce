import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { UserType } from '../UserContext';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const { userId } = useContext(UserType);

    useEffect(() => {
        // Fetch order history when the component mounts
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://192.168.31.155:8800/orders/${userId}`);
                setOrders(response.data.orders); // Adjust based on your API response structure
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]); // Run effect when userId changes

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <Image source={{ uri: item.products[0].image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.itemName}>{item.products[0].name}</Text>
                <Text style={styles.itemDetails}>Qty: {item.products[0].quantity}</Text>
                <Text style={styles.itemDetails}>Price: ₹ {item.products[0].price}</Text>
                <Text style={styles.itemDetails}>Delivered: {item.orderStatus ? "Delivered" : 'Pending'}</Text>
                <Text style={styles.orderDate}>Ordered on: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Order History</Text> */}
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
                showsVerticalScrollIndicator={false} // Hide vertical scroll bar
                showsHorizontalScrollIndicator={false} // Hide horizontal scroll bar
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 16,
        paddingTop: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    orderCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginVertical: 8,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemDetails: {
        fontSize: 14,
        color: '#666',
        marginVertical: 2,
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default OrderHistory;
