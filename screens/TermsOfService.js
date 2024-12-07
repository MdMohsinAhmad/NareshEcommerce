import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Footer from './Footer';

const TermsOfService = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Terms of Service</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By using [Order Karo] (the "App"), you agree to comply with and be
          bound by these Terms of Service. If you do not agree to these terms,
          do not use the App.
        </Text>

        <Text style={styles.sectionTitle}>2. Account Registration</Text>
        <Text style={styles.text}>
          To use certain features of the App, you may need to register for an
          account. You are responsible for providing accurate and up-to-date
          information and for maintaining the security of your account.
        </Text>

        <Text style={styles.sectionTitle}>3. Use of the App</Text>
        <Text style={styles.text}>
          You agree to use the App only for lawful purposes and in accordance
          with our Content Policy. You must not use the App to:
          {"\n"}- Engage in illegal or unauthorized activities
          {"\n"}- Post content that violates our guidelines or infringes on
          others' rights
          {"\n"}- Disrupt or interfere with the functioning of the App or its
          servers
        </Text>

        <Text style={styles.sectionTitle}>4. Privacy</Text>
        <Text style={styles.text}>
          Your use of the App is also governed by our Privacy Policy. By using
          the App, you consent to our collection and use of your information as
          described in the Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>5. Payment and Orders</Text>
        <Text style={styles.text}>
          When you place an order through the App, you agree to pay the amount
          specified for the items and services, including taxes and applicable
          fees. We use secure payment processing services to handle transactions.
        </Text>

        <Text style={styles.sectionTitle}>6. User Conduct</Text>
        <Text style={styles.text}>
          You are responsible for your actions when using the App. You must not:
          {"\n"}- Impersonate another user or entity
          {"\n"}- Engage in any form of harassment or abusive behavior
          {"\n"}- Attempt to gain unauthorized access to other accounts or
          services
        </Text>

        <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
        <Text style={styles.text}>
          [Your App Name] is not liable for any indirect, incidental, special,
          or consequential damages that may arise from your use of the App. We
          do not guarantee the availability of the App at all times and may
          suspend or discontinue the service at our discretion.
        </Text>

        <Text style={styles.sectionTitle}>8. Modifications</Text>
        <Text style={styles.text}>
          We reserve the right to modify or update these Terms of Service at any
          time. Your continued use of the App after any changes indicates your
          acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>9. Governing Law</Text>
        <Text style={styles.text}>
          These Terms of Service are governed by the laws of [Your Jurisdiction].
          Any disputes arising from these terms will be subject to the exclusive
          jurisdiction of the courts in [Your Jurisdiction].
        </Text>

        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions or concerns about these Terms of Service,
          please contact us at orderkarokrp@gmail.com.
        </Text>

        <Text style={styles.footer}>
          These Terms of Service are effective as of [06/12/2024] and are subject
          to changes.
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

export default TermsOfService;
