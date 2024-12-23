import { Pressable, ScrollView, StyleSheet, Text, View, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserType } from '../UserContext';
import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { cleanCart } from '../redux/CartReducer';
import { TouchableOpacity } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay'
import URL_path from '../URL'

const ConfirmationScreen = () => {
  const steps = [
    { title: 'Address', content: 'Address Form' },
    { title: 'Delivery', content: 'Delivery Options' },
    { title: 'Payment', content: 'Payment Details' },
    { title: 'Place Order', content: 'Order Summary' },
  ];
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [refreshing, setRefreshing] = useState(false);
  const [PushToken, setPushToken] = useState([])
  const [paying, setPaying] = useState(false)
  const cart = useSelector((state) => state.cart.cart);
  const deliverycharges = 40
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [options, setOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState('');
  const [pageLoad, setPageLoad] = useState(true)

  const [data, setData] = useState([]);
  const [validationResult, setValidationResult] = useState(false); // To store validation status

  const valid = (code) => {
    if (!code) {
      setValidationResult(false);
      return;
    }
  
    if (!Array.isArray(data)) {
      setValidationResult(false);
      return;
    }

    // Ensure code is a number
    const parsedCode = Number(code);
    if (isNaN(parsedCode)) {
      setValidationResult(false);
      return;
    }
  
    // Validate against the `postalCode` property in objects
    const isValid = data.some(item => {
      // console.log(`Comparing ${item.postalCode} with ${parsedCode}`);
      return item.postalCode === parsedCode;
    });
  
    if (isValid) {
      console.log("Postal code is valid");
      setValidationResult(true);
    } else {
      console.log("Postal code is invalid");
      setValidationResult(false);
    }
  };
  
  const SelectedAddress = (item) => {
    setSelectedAddress(item);
    valid(item.postalCode); // Validate the postal code
  };

  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  useEffect(() => {
    fetchAddresses();
    setOptions(false)
    setSelectedAddress('')
    setSelectedOptions('')
  }, [cart]);

  const FetchALLDeliveryTOKEN = async () => {
    try {
      const response = await axios.get(`${URL_path}/deliveryboy/token`);
      const tokens = response.data.All_Push_Tokens.map(item => item.pushToken);
      setPushToken(tokens);
    } catch (error) {
      console.error('Error fetching tokens', error);
    }
  };

  useEffect(() => {
    FetchALLDeliveryTOKEN();
  }, []);


  const fetchAddresses = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${URL_path}/addresses/${userId}`);
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log('Error', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchAddresses();  // Trigger a refresh of addresses when user pulls down
  };



  useEffect(() => {
    setTimeout(() => {
      setPageLoad(false)
    }, 800)
  }, [])

  const handlePlaceOrderCod = async () => {
    setPaying(true)
    if (!validationResult) {
      Alert.alert('Not Deliverable Location', 'The location you provided is not deliverable,try other location')
      setPaying(false)
      return
    }
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total + deliverycharges,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOptions,
        orderStatus: false,
        PushToken: PushToken,
        paymentId: null
      };
      const response = await axios.post(
        `${URL_path}/orders`,
        orderData
      );

      if (response.status === 200) {
        setOptions(false)
        setAddresses('')
        setSelectedOptions('')
        setPaying(false)
        navigation.navigate('Order');
        dispatch(cleanCart());
      } else {
        setPaying(false)
        console.log('Error creating order');
      }
    } catch (error) {
      setPaying(false)
      console.log('Error', error);
    }
  };
  const handlePlaceOrder = async (paymentId) => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total + deliverycharges,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOptions,
        orderStatus: false,
        PushToken: PushToken,
        paymentId: paymentId || null
      };
      const response = await axios.post(
        `${URL_path}/orders`,
        orderData
      );

      if (response.status === 200) {
        setOptions(false)
        setSelectedOptions('')
        setAddresses('')
        setPaying(false)
        navigation.navigate('Order');
        dispatch(cleanCart());
      } else {
        console.log('Error creating order');
        setPaying(false)
      }
    } catch (error) {
      console.log('Error', error);
      setPaying(false)
    }
  };

  // create order and send to backend
  const createOrder = async (amount, currency) => {
    try {
      const response = await fetch(`${URL_path}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  // pay with card or UPI
  const initiatePayment = async () => {
    setPaying(true)
    if (!validationResult) {
      setPaying(false)
      Alert.alert('Not Deliverable Location', 'The location you provided is not deliverable,try other location')
      return
    }
    // Amount in INR, e.g., 500 INR
    const amount = total + deliverycharges
    const currency = 'INR';

    const order = await createOrder(amount, currency);

    if (!order?.id) {
      Alert.alert('Order Creation Failed');
      return;
    }

    const options = {
      description: cart[0]?.title || "You have added some items to buy",
      image: './assets/nobglogo.png', // Optional, can be customized
      currency: order.currency,
      key: 'rzp_test_iTNeVvGBP2UtGJ', // Replace with your Razorpay Key ID
      amount: order.amount, // Amount in paise (e.g., 5000 paise = INR 50)
      name: 'Order Karo',
      order_id: order.id,//Replace this with an order_id created using Orders API.

      prefill: {
        email: `${selectedAddress.name}@gmail.com`, // Prefilled email
        contact: selectedAddress.mobileNo, // Prefilled phone number
        name: selectedAddress.name // Prefilled name
      },
      theme: { color: '#0a3d62' } // Customize the theme color
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        handlePlaceOrder(data.razorpay_payment_id)

      })
      .catch(() => {
        navigation.replace('OrderFailure')
        setPaying(false)
      });
  };
  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    setOptions(false)
    setSelectedOptions('')
    setSelectedAddress('')
    setTimeout(() => {
      setRefresh(false)
    }, 1000)
  }, [])

  // Function to fetch data from the backend
  const fetchPostalCode = async () => {
    try {
      const response = await axios.get(`${URL_path}/api/postalcode`);

      // Check if the response data is structured correctly
      if (Array.isArray(response.data.PostalCodes)) {
        setData(response.data.PostalCodes);

      } else {
        console.error('Invalid data format:', response.data);
        Alert.alert('Error', 'Unexpected data format received.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data from the server.');
    } finally {
      // You can add any cleanup or finalization code here if needed
    }
  };


  useEffect(() => {
    fetchPostalCode();
  }, []);


  if (refresh) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="#0F70E6" />
      </View>
    )
  }




  if (pageLoad) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0F70E6" />

      </View>
    )
  }
  return (
    <ScrollView style={{ marginTop: 15 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: deliverycharges }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            justifyContent: 'space-between',
          }}
        >
          {steps?.map((step, index) => (
            <View
              key={index}
              style={{ justifyContent: 'center', alignItems: 'center' }}
            >
              {index > 0 && (
                <View
                  style={[
                    { flex: 1, height: 2, backgroundColor: 'green' },
                    index <= currentStep && { backgroundColor: 'green' },
                  ]}
                />
              )}
              <View
                style={[
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: '#ccc',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  index < currentStep && { backgroundColor: 'green' },
                ]}
              >
                {index < currentStep ? (
                  <Text
                    style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
                  >
                    &#10003;
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={{ textAlign: 'center', marginTop: 8 }}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {currentStep == 0 && (
        <View style={{ marginHorizontal: 20 }}>
          <Pressable
            onPress={() => navigation.navigate('Add')}
            style={styles.addAddressButton}
          >
            <Text style={styles.addAddressText}>Add a new address</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#000" />
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Select Delivery Address
          </Text>

          {addresses.length !== 0 ? <View>
            {addresses.map((item, index) => (
              <Pressable
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: '#D0D0D0',
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingBottom: 17,
                  marginVertical: 7,
                  borderRadius: 6,
                }}
              >
                {selectedAddress && selectedAddress._id === item?._id ? (
                  <FontAwesome5 name="dot-circle" size={20} color="#008897" />
                ) : (
                  <Entypo
                    onPress={() => SelectedAddress(item)}
                    name="circle"
                    size={24}
                    color="gray"
                  />
                )}

                <View style={{ marginLeft: 6 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                      {item.name}
                    </Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>
                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    {item.houseNo}, {item.landmark}
                  </Text>
                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    {item.street}
                  </Text>
                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    {item.state}, India
                  </Text>
                  <Text style={{ fontSize: 15, color: '#181818' }}>
                    Phone No : {item.mobileNo}
                  </Text>
                  <Text style={{ fontSize: 15, color: '#181818' }} t>
                    Pin code : {item.postalCode}
                  </Text>
                  <View>
                    {selectedAddress && selectedAddress._id === item?._id && (
                      <Pressable
                        onPress={() => setCurrentStep(1)}
                        style={{
                          backgroundColor: '#008897',
                          padding: 10,
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ textAlign: 'center', color: 'white' }}>
                          Deliver to this address
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View> : <TouchableOpacity style={{ backgroundColor: "#2e86de", padding: 20, borderRadius: 10, marginTop: 20 }} onPress={() => navigation.navigate('Add')}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>Add Address</Text>
          </TouchableOpacity>}
        </View>
      )}

      {currentStep == 1 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Choose your delivery options
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 8,
              gap: 7,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            {options ? (
              <FontAwesome5
                onPress={() => setOptions(!options)}
                name="dot-circle"
                size={20}
                color="#008397"
              />
            ) : (
              <Entypo
                onPress={() => setOptions(!options)}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ flex: 1 }}>
              <Text style={{ color: 'green', fontWeight: '500' }}>
                Delivery timing are
              </Text>
              - From 6:00 AM to 10:00 AM and 6:00 PM to 8:00 PM for Diary products and for other items it will be deliverd soon.
            </Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(2)}
            disabled={!options}
            style={options ? styles.ontimingContinue : styles.timingContinue}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2d3436', paddingVertical: 4 }}>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep == 2 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Select your payment Method
          </Text>

          <View
            style={{
              backgroundColor: '#fff',
              padding: 18,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginTop: 25, borderRadius: 5,
            }}
          >
            {selectedOptions == 'cash' ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedOptions('cash')}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Cash on Delivery</Text>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              padding: 18,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginTop: 12, borderRadius: 5
            }}
          >
            {selectedOptions == 'card' ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => {
                  setSelectedOptions('card');
                }}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>UPI / Credit or Debit card</Text>
          </View>
          <Pressable
            onPress={() => setCurrentStep(3)}
            disabled={selectedOptions === ''}
            style={selectedOptions === '' ? {
              backgroundColor: 'gray',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15, paddingVertical: 15
            } : {
              backgroundColor: '#27ae60',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15, paddingVertical: 15
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Continue</Text>
          </Pressable>
        </View>
      )}

      {/* on selected cash on delivery */}
      {currentStep == 3 && selectedOptions === 'cash' && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Order Now</Text>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Shipping to {selectedAddress?.name}</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'gray' }}>
                Items (x{cart.length})
              </Text>
              <Text style={{ color: 'gray', fontSize: 16 }}>₹{total}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'gray' }}>
                Delivery charges
              </Text>
              <Text style={{ color: 'gray', fontSize: 16 }}>₹{deliverycharges}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Order Total
              </Text>
              <Text
                style={{ color: '#c60c30', fontSize: 17, fontWeight: 'bold' }}
              >
                ₹{total + deliverycharges}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: 'gray' }}>Pay with</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 7 }}>
              Pay on delivery (Cash)
            </Text>
          </View>
          <Pressable
            onPress={handlePlaceOrderCod}
            disabled={paying} // Correctly set the disabled prop here
            style={{
              backgroundColor: paying ? 'gray' : '#FFC72C',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              opacity: paying ? 0.5 : 1, // Optional: Add visual feedback when disabled
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              {paying ? 'Please wait ...' : 'Place your order'}
            </Text>
          </Pressable>

        </View>
      )}

      {/* on option selected pay with card */}
      {currentStep == 3 && selectedOptions === 'card' && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Order Now</Text>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Shipping to {selectedAddress?.name}</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'gray' }}>
                Items (x{cart.length})
              </Text>
              <Text style={{ color: 'gray', fontSize: 16 }}>₹{total}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'gray' }}>
                Delivery charges
              </Text>
              <Text style={{ color: 'gray', fontSize: 16 }}>₹{deliverycharges}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Order Total
              </Text>
              <Text
                style={{ color: '#c60c30', fontSize: 17, fontWeight: 'bold' }}
              >
                ₹{total + deliverycharges}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: 'gray' }}>Pay with</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 7 }}>
              Pay Online with any payment method
            </Text>
          </View>
          <Pressable
            onPress={initiatePayment}
            disabled={paying}
            style={{
              backgroundColor: '#FFC72C',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              opacity: paying ? 0.5 : 1
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{paying ? "Please wait..." : "Place your order"}</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  step: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActiveCircle: {
    backgroundColor: '#16A34A',
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  stepTitle: {
    textAlign: 'center',
    marginTop: 8,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  addressOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  addressText: {
    fontSize: 15,
    color: '#374151',
  },
  actionButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },
  primaryButton: {
    backgroundColor: '#FFC72C',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 15,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 12,
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 15,
  },
  ontimingContinue: {
    backgroundColor: '#fdcb6e',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  timingContinue: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15, color: 'white'
  }, addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFC72C',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 1,
  },
  addAddressText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

