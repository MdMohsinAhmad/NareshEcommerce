import React from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const OrderedItemHistorry = ({route}) => {
    const { product } = route.params
    console.log(product)
   
    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                {/* Product Image */}
                <Image source={{ uri: product.image }} style={styles.image} />

                {/* Product Details */}
                <View style={styles.details}>
                    <Text style={styles.title}>Item : {product.name}</Text>
                    <Text style={styles.price}>Price : ₹{product.price}</Text>
                    <Text style={styles.quantity}>Quantity: {product.quantity}</Text>
                    <Text style={styles.orderid}>Order Id: {product.uniqueId}</Text>
                    <Text style={[styles.status, product.orderStatus === "pending" ? styles.pending : styles.completed]}>
                        Status: {product.orderStatus}
                    </Text>
                </View>

                {/* Total Price */}
                <View style={styles.totalPriceContainer}>
                    <Text style={styles.totalPriceLabel}>Total Price:</Text>
                    <Text style={styles.totalPrice}>₹{product.totalPrice}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 16,
        
    },
    card: {
        flex:1,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 20,justifyContent:'center',marginTop:10
    },
    image: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
    },
    details: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: "600",
        color: "#27ae60",
        marginBottom: 8,
    },
    quantity: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
    },
    orderid: {
        fontSize: 18,
        color: "#000",
        marginBottom: 8,fontWeight:'bold'
    },
    status: {
        fontSize: 16,
        fontWeight: "bold",
    },
    pending: {
        color: "#e67e22",fontSize:20
    },
    completed: {
        color: "#2ecc71",fontSize:20
    },
    totalPriceContainer: {
        backgroundColor: "#f5f5f5",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalPriceLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#555",
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
});

export default OrderedItemHistorry;