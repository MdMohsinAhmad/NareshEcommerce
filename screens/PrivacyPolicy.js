import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Privacy Policy</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to [Order Karo]! This Privacy Policy explains how we
          collect, use, and protect your personal information when you use our
          app to order groceries online.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.text}>
          We collect the following information to provide better service:
          {"\n"}- Personal information: Name, email, phone number, and address
          {"\n"}- Payment information: Credit/debit card details or other
          payment methods
          {"\n"}- Usage data: App activity, device type, and location for
          delivery accuracy
        </Text>

        <Text style={styles.sectionTitle}>
          3. How We Use Your Information
        </Text>
        <Text style={styles.text}>
          We use your information to:
          {"\n"}- Process and deliver your orders
          {"\n"}- Communicate updates about your orders
          {"\n"}- Improve our app and user experience
          {"\n"}- Send promotional offers, if you opt-in
        </Text>

        <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
        <Text style={styles.text}>
          Your information may be shared with:
          {"\n"}- Delivery personnel to ensure accurate order delivery
          {"\n"}- Payment gateways for secure transactions
          {"\n"}- Partners for promotional activities (with your consent)
          {"\n"}We do not sell your personal information to third parties.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.text}>
          We prioritize your data security by implementing:
          {"\n"}- Encryption of sensitive information
          {"\n"}- Regular security audits
          {"\n"}- Restricted access to your personal data
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          {"\n"}- Access and update your information
          {"\n"}- Request deletion of your account
          {"\n"}- Opt-out of promotional communications
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions or concerns about our Privacy Policy, feel
          free to contact us:
          {"\n"}Email: orderkarokrp@gmail.com
         
        </Text>

        <Text style={styles.footer}>
          This Privacy Policy is effective as of [06/12/2024] and is subject to
          changes. Please review this page periodically for updates.
        </Text>
        <Footer/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    fontSize: 14,
    marginTop: 20,
    color: '#555',
    textAlign: 'center',
  },
});

export default PrivacyPolicy;
