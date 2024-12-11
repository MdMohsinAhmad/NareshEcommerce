import React from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const OrderedItemHistorry = ({ route }) => {
    const [product, item] = route.params
    console.log(item)
    const date = new Date(item.createdAt);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // For 12-hour clock
    };
    const formattedDate = date.toLocaleString("en-US", options);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                {/* Product Image */}
                <Image source={{ uri: product.image }} style={styles.image} />

                {/* Product Details */}
                <View style={styles.details}>
                    <Text style={styles.title}>Item : {product?.name}</Text>
                    <Text style={styles.price}>Price : ₹{product?.price}</Text>
                    <Text style={styles.quantity}>Quantity: {product?.Quantity}</Text>
                    <Text style={styles.quantity}>Qty: x{product?.quantity}</Text>
                    <Text style={styles.orderid}>Order Id: {product?.uniqueId}</Text>
                    {item?.paymentId && <Text style={styles.orderid}>PaymentId: <Text style={{ color: '#0097e6' }}>{item?.paymentId}</Text></Text>}
                    <Text style={styles.orderid}>Payment Mode: <Text style={{ color: '#0097e6' }}>{item?.paymentMethod}</Text></Text>
                    <Text style={[styles.status, product.orderStatus === "pending" ? styles.pending : product?.orderStatus === "canceled" ? styles.packed : styles.completed]}>
                        Status: {product?.orderStatus}
                    </Text>
                </View>

                {/* Total Price */}
                <View style={styles.totalPriceContainer}>
                    <Text style={styles.totalPriceLabel}>Total Bill <Text style={{ fontSize: 10, color: '#e84118' }}>(excluded delivery charges)</Text> :</Text>
                    <Text style={styles.totalPrice}>₹{product?.totalPrice}</Text>
                </View>
                <View style={{ paddingHorizontal: 16 }}>

                    <Text style={styles.titleDdress}>Delivery  Address</Text>
                    <Text style={styles.orderDate}>Orderd at : {formattedDate}</Text>
                    <Text style={styles.Address}>Name : {item?.shippingAddress?.name}</Text>

                    <Text style={styles.Address}>House No : {item?.shippingAddress?.houseNo}</Text>
                    <Text style={styles.Address}>landmark : {item?.shippingAddress?.landmark}</Text>
                    <Text style={styles.Address}>Village/Area : {item?.shippingAddress?.street}</Text>
                    <Text style={styles.Address}>Phone No : {item?.shippingAddress?.mobileNo}</Text>
                    <Text style={styles.Address}>City : {item?.shippingAddress?.street}</Text>
                    <Text style={styles.Address}>Pincode : {item?.shippingAddress?.postalCode}</Text>
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
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 20, justifyContent: 'center', marginTop: 10
    },
    image: {
        width: "100%",
        height: 150,
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
    titleDdress: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1e272e",
        marginBottom: 8,
        textDecorationLine: "underline",
        textAlign: 'center',
        marginBottom: 15
    },
    Address: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#485460",
        marginBottom: 8,
    },
    orderDate: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#e84118",
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
        fontSize: 16,
        color: "#000",
        marginBottom: 8, fontWeight: 'bold'
    },
    status: {
        fontSize: 16,
        fontWeight: "bold",
    },
    pending: {
        color: "#e67e22", fontSize: 20
    },
    completed: {
        color: "#2ecc71", fontSize: 20
    },
    packed: {
        color: "red", fontSize: 20
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
