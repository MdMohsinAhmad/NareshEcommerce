import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Order Karo',
    description: 'Shop for fresh groceries and essentials from the comfort of your home.',
    image: require('../assets/1.png'), // Replace with your image path
  },
  {
    title: 'Fast Delivery',
    description: 'Get your orders delivered quickly, right to your doorstep.',
    image: require('../assets/2.png'), // Replace with your image path
  },
  {
    title: 'Track Your Orders',
    description: 'Stay updated on your order status and delivery progress.',
    image: require('../assets/3.png'), // Replace with your image path
  },
];

const IntroSlider = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true); // State to track loading
  const [hasSeenIntro, setHasSeenIntro] = useState(false); // Flag to track intro visibility

  useEffect(() => {
    const checkFirstTime = async () => {
      const hasViewedIntro = await AsyncStorage.getItem('hasViewedIntro');
      if (hasViewedIntro === 'true') {
        // If the intro has been viewed before, set a brief delay before navigating
        setTimeout(() => {
          setLoading(false);
          navigation.replace('Login'); // Navigate to Login after the short delay
        }, 1000); // Show intro for 1 second before navigating (adjust as needed)
      } else {
        // Show intro slides for the first time
        setLoading(false);
      }
    };
    checkFirstTime();
  }, [navigation]);

  const onSwipeLeft = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const onSwipeRight = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasViewedIntro', 'true'); // Mark the intro as viewed
    navigation.replace('Login'); // Navigate to the Login screen
  };

  if (loading) {
    // Show a loading spinner while waiting for the brief delay
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F70E6" />
      </View>
    );
  }

  return (
    <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} style={styles.container}>
      <View style={styles.slide}>
        <Image
          source={slides[currentSlide].image ? slides[currentSlide].image : require('../assets/loading.gif')}
          style={styles.image}
        />
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
      </View>
      <View style={styles.footer}>
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: currentSlide === index ? '#FF6347' : '#ccc' },
              ]}
            />
          ))}
        </View>
        {/* Button */}
        {currentSlide === slides.length - 1 ? (
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={onSwipeLeft}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: width * 1.2,
    height: height * 0.5,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default IntroSlider;
