import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity, Linking, PermissionsAndroid, Platform, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { BottomModal, SlideAnimation, ModalContent } from 'react-native-modals';
import Entypo from '@expo/vector-icons/Entypo';
import URL_path from '../URL';
import AntDesign from '@expo/vector-icons/AntDesign';

const HomeHeader = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [permission, setPermission] = useState(false)
    const [permissionDrawer, setPermissionDrawer] = useState(false)

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
        setOpen(!open);
    };
    const togglePermissionDrawer = () => {
        setPermissionDrawer(!permissionDrawer);
    };

    useEffect(() => {
        getLocation();
    }, []);


    const getLocation = async () => {

        try {
            // setPermission(true)
            // Check location permissions
            let { status } = await Location.getForegroundPermissionsAsync();

            // Request location permissions if not already granted
            if (status !== 'granted') {
                setPermission(true)
                // For Android
                if (Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        // {
                        //     title: 'Location Access Required',
                        //     message: 'Order Karo needs access to your location to automatically fetch your address.',
                        //     buttonNeutral: 'Ask Me Later',
                        //     buttonNegative: 'Cancel',
                        //     buttonPositive: 'OK',
                        // }
                    );

                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        setPermission(true)
                        await AsyncStorage.setItem('locationPrompted', 'true'); // Mark as prompted
                        return setPermissionDrawer(true)
                        //   Alert.alert(
                        //     'Permissions Required',
                        //     'Location permission is denied. To enable it, go to your device settings.',
                        //     [

                        //         { text: 'Open Settings', onPress: () => Linking.openSettings() },
                        //     ]
                        // );
                    }
                }
                // For iOS/Expo
                else {
                    setPermission(false)
                    const { status: newStatus } = await Location.requestForegroundPermissionsAsync();

                    if (newStatus !== 'granted') {
                        setPermission(true)
                        await AsyncStorage.setItem('locationPrompted', 'true'); // Mark as prompted
                        return setPermissionDrawer(true)
                        //  Alert.alert(
                        //     'Permissions Required',
                        //     'Location permission is denied. To enable it, go to your device settings.',
                        //     [
                        //         { text: 'Cancel', style: 'default' },
                        //         { text: 'Open Settings', onPress: () => Linking.openSettings() },
                        //     ]
                        // );
                    }
                    setPermission(false)
                }
            }
            // setPermission(false)
            // Fetch the current location
            const currentLocation = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = currentLocation.coords;

            // Reverse geocode the location
            const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (result) {
                const formattedAddress = `${result.street || ''}, ${result.city || ''}, ${result.region || ''}, ${result.country || ''} - ${result.postalCode || ''}`;
                setAddress(formattedAddress);
                setPincode({ postalCode: result.postalCode, city: result.city });
            } else {
                Alert.alert('Error', 'Unable to retrieve address.');
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'Unable to fetch location.');
        }
    };

    const OnpressLocationGrant = () => {
        Linking.openSettings()
    }
    // Trigger location request on app launch
    const checkAndRequestLocation = async () => {
        const wasPrompted = await AsyncStorage.getItem('locationPrompted');

        if (wasPrompted !== 'true') {
            // If the user wasn't prompted before or accepted, try to fetch location
            await getLocation();
        } else {
            console.log('Location permission previously denied, waiting for user action.');
        }
    };

    useEffect(() => {
        checkAndRequestLocation();
    }, []);

    const { userId, setUserId } = useContext(UserType);

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [userId, modalVisible]);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`${URL_path}/addresses/${userId}`);
            const { addresses } = response.data;
            setAddresses(addresses);
            // console.log(addresses)
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
        };
        fetchUser();
    }, []);

    const clearAuthToken = async () => {
        await AsyncStorage.removeItem('authToken');
        navigation.replace('Login');
    };

    const handleBarsButton = (num) => {
        if (num == 1) {
            setDrawerOpen(!drawerOpen);
            navigation.navigate('Cart')
            return
        }
        if (num == 2) {
            setDrawerOpen(!drawerOpen);
            navigation.navigate('yourAccount')
            return

        }
        if (num == 3) {
            setDrawerOpen(!drawerOpen);
            navigation.navigate('yourOrder')
            return

        }
        if (num == 4) {
            setDrawerOpen(!drawerOpen);
            clearAuthToken();
            return
        }
        if (num == 5) {
            setDrawerOpen(!drawerOpen);
            navigation.navigate('Address')
            return
        }
        if (num == 6) {
            setDrawerOpen(!drawerOpen);
            navigation.navigate('contactUs')
            return
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => setModalVisible(!modalVisible)} style={styles.addressButton}>
                    <Ionicons name="location" size={28} color="#005aa8" />
                    {selectedAddress ? (
                        <Text style={styles.selectedAddressText}>
                            Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                        </Text>
                    ) : (
                        <View>
                            <Text style={styles.postalCodeText}>{pincode != 0 ? pincode.postalCode : 'Auto fetching'}</Text>
                            <Text style={styles.cityText}>{pincode != 0 ? pincode.city : 'address ...'}</Text>
                        </View>
                    )}
                </Pressable>

                <FontAwesome
                    name={drawerOpen ? "bars" : "bars"}
                    size={29}
                    color="#005aa8"
                    onPress={toggleDrawer}
                    style={styles.barsIcon}
                />
            </View>

            {/* handle location and address add */}
            <BottomModal
                onBackdropPress={() => setModalVisible(!modalVisible)}
                swipeDirection={['up', 'down']}
                swipeThreshold={200}
                modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
                onHardwareBackPress={() => setModalVisible(!modalVisible)}
                visible={modalVisible}
                onTouchOutside={() => setModalVisible(!modalVisible)}
            >
                <ModalContent style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Choose your Location</Text>
                        <Text style={styles.modalSubtitle}>
                            Select a delivery location to see product availability and delivery options
                        </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {addresses?.map((item, index) => (
                            <Pressable
                                // onPress={() => setSelectedAddress(item)}
                                key={index}
                                style={[styles.addressCard, selectedAddress === item && styles.selectedCard]}
                            >
                                <View style={styles.addressRow}>
                                    <Text style={styles.addressName}>{item?.name}</Text>
                                    <Entypo name="location-pin" size={24} color="red" />
                                </View>
                                <Text style={styles.addressDetail} numberOfLines={1}>
                                    {item?.houseNo}, {item?.landmark}
                                </Text>
                                <Text style={styles.addressDetail} numberOfLines={1}>
                                    {item?.street}
                                </Text>
                                <Text style={styles.addressDetail} numberOfLines={1}>
                                    India, {item?.state}
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Address');
                            }}
                            style={styles.addAddressCard}
                        >
                            <Text style={styles.addAddressText}>
                                Add an Address
                            </Text>
                        </Pressable>
                    </ScrollView>
                    <View style={styles.pincodeSection}>

                        <View style={styles.pincodeRow}>
                            <Ionicons name="locate-sharp" size={22} color="#0066B2" />
                            <Text style={styles.pincodeText} onPress={getLocation}>
                                Use My Current Location
                            </Text>
                        </View>

                    </View>
                </ModalContent>
            </BottomModal>


            {permission && <BottomModal
                onBackdropPress={() => togglePermissionDrawer(!permissionDrawer)}
                swipeDirection={['up', 'down']}
                swipeThreshold={200}
                modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
                visible={permissionDrawer}
            >
                <ModalContent style={styles.modalContentLocation}>
                    <Text style={styles.modalTitlelocation}>Location permission has been denied.</Text>
                    <Text style={styles.modalTitlelocation}>We need your permission to fetch your current location.</Text>
                    <View style={styles.modalHeaderlocation}>
                        <Pressable style={{ backgroundColor: '#0984e3', padding: 20, borderRadius: 12, marginTop: -70 }}>

                            <Text onPress={OnpressLocationGrant} style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Grant access</Text>
                        </Pressable>
                    </View>

                </ModalContent>
            </BottomModal>}


            {drawerOpen && (

                <View style={{ backgroundColor: 'white', height: 900, width: 390, position: 'absolute', right: 0, top: 0 }}>
                    <View style={{
                        width: 400, height: 120, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: 'black',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.7,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        <MaterialIcons onPress={() => toggleDrawer(!drawerOpen)} style={{ position: 'absolute', left: 25, fontWeight: 'bold' }} name="arrow-back-ios-new" size={24} color="black" />
                        <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Settings</Text>

                    </View>
                    <View style={styles.underline1} />

                    <View style={{
                        paddingTop: 50,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        paddingLeft: 30,
                        gap: 20
                    }}>
                        <TouchableOpacity onPress={() => handleBarsButton(1)} style={styles.menuItem}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                <Ionicons name="cart" size={24} color="#227093" />
                                <Text style={styles.menuText}>Cart</Text>
                            </View>
                            <AntDesign name="right" size={20} color="#227093" />
                        </TouchableOpacity>
                        <View style={styles.underline} />

                        <TouchableOpacity onPress={() => handleBarsButton(2)} style={styles.menuItem}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                <FontAwesome name="user-circle" size={24} color="#227093" />
                                <Text style={styles.menuText}>Profile</Text>
                            </View>
                            <AntDesign name="right" size={20} color="#227093" />

                        </TouchableOpacity>
                        <View style={styles.underline} />

                        <TouchableOpacity onPress={() => handleBarsButton(3)} style={styles.menuItem}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                <SimpleLineIcons name="handbag" size={24} color="#227093" />
                                <Text style={styles.menuText}>Orders</Text>
                            </View>
                            <AntDesign name="right" size={20} color="#227093" />

                        </TouchableOpacity>
                        <View style={styles.underline} />
                        <TouchableOpacity onPress={() => handleBarsButton(5)} style={styles.menuItem}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                <Ionicons name="location" size={24} color="#227093" />
                                <Text style={styles.menuText}>Add Address</Text>
                            </View>
                            <AntDesign name="right" size={20} color="#227093" />

                        </TouchableOpacity>
                        <View style={styles.underline} />
                        <TouchableOpacity onPress={() => handleBarsButton(6)} style={styles.menuItem}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>

                                <MaterialIcons name="connect-without-contact" size={24} color="#227093" />
                                <Text style={styles.menuText}>Contact Us</Text>
                            </View>
                            <AntDesign name="right" size={20} color="#227093" />

                        </TouchableOpacity>
                        <View style={styles.underline} />

                        <TouchableOpacity onPress={() => handleBarsButton(4)} style={[styles.menuItem, { marginTop: 40, }]}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                <MaterialCommunityIcons name="logout" size={24} color="red" />
                                <Text style={styles.menuText1}>LogOut</Text>
                            </View>
                            <AntDesign name="right" size={20} color="#227093" />

                        </TouchableOpacity>
                    </View>

                </View>
            )}
        </View>
    );
};

export default HomeHeader;

const styles = StyleSheet.create({
    backgroundImage: {
        // flex: 1,
        resizeMode: 'cover',
    },
    container: {
        // flex: 1,
    },
    header: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: 35,
    },
    addressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    postalCodeText: {
        fontWeight: 'bold',
        color: 'green',
    },
    cityText: {
        fontWeight: '200',
        fontSize: 12,
        color: '#005aa8',
    },
    selectedAddressText: {
        fontSize: 13,
        fontWeight: '500',
    },
    barsIcon: {
        paddingRight: 10,
    },
    dropdownContainer: {
        width: '40%',
        alignSelf: 'flex-end',
        zIndex: 1000, marginTop: -15, marginRight: 4,
    },
    menuItem: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        borderRadius: 6,
        width: '100%',
        paddingVertical: 4,
        paddingHorizontal: 8, justifyContent: 'space-between'
    },
    menuText: {
        fontSize: 18,
        color: '#227093', fontWeight: 'bold'
    },
    menuText1: {
        fontSize: 18,
        color: 'red', fontWeight: 'bold'
    },
    underline: {
        borderBottomColor: '#f3f3f3',
        borderBottomWidth: 1,
        width: '100%',
    },
    underline1: {
        borderBottomColor: '#c7c7c7',
        borderBottomWidth: 0.7,
        width: '100%',
    }, header: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: 35,
    },
    addressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    postalCodeText: {
        fontWeight: 'bold',
        color: 'green',
    },
    cityText: {
        fontWeight: '200',
        fontSize: 12,
        color: '#005aa8',
    },
    selectedAddressText: {
        fontSize: 13,
        fontWeight: '500',
    },
    placeholderText: {
        fontSize: 13,
        fontWeight: '500',
    },
    barsIcon: {
        paddingRight: 10,
    },
    modalContent: {
        width: '100%',
        height: 420, backgroundColor: '#fff'
    },
    modalContentLocation: {
        width: '100%',
        height: 300, backgroundColor: '#fff'
    },
    modalHeader: {
        marginBottom: 8,

    },
    modalHeaderlocation: {
        marginBottom: 8,
        display: 'flex',
        height: '100%',
        borderRadius: 4, justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '500', fontWeight: 'bold', textAlign: 'center', lineHeight: 29
    },
    modalTitlelocation: {
        fontSize: 18,
        fontWeight: '500', fontWeight: 'bold',
         textAlign: 'center', lineHeight: 29,color:'#2c3e50'
    },
    modalSubtitle: {
        marginTop: 5,
        fontSize: 16,
        color: 'gray',
    },
    addressCard: {
        margin: 5,
        backgroundColor: '#EAF0F1',
        borderRadius: 8,
        padding: 10,
        width: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10, height: 110,
        elevation: 5,
    },
    // 
    selectedCard: {
        borderColor: '#005aa8',
        borderWidth: 2,
    },
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addressName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    addressDetail: {
        fontSize: 12,
        color: '#555',
    },
    addAddressCard: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'lightblue',
        borderRadius: 8,
        marginVertical: 5, height: 112,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10, height: 110,

        // Android shadow
        elevation: 5,
    },
    addAddressText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    pincodeSection: {
        marginTop: 10,
        paddingVertical: 15,
    },
    pincodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    pincodeText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#555',
    },
    sidebarContent: {
        width: '80%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
});
