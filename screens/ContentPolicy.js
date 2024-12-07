import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Footer from './Footer';

const ContentPolicy = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Content Policy</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          This Content Policy outlines the rules and guidelines for content shared
          by users on [Order Karo]. By using our app, you agree to adhere to
          these guidelines to ensure a positive and safe environment for all users.
        </Text>

        <Text style={styles.sectionTitle}>2. User-Generated Content</Text>
        <Text style={styles.text}>
          Users may share content, such as reviews, ratings, and feedback, to help
          improve the community experience. All content shared must comply with
          our guidelines.
        </Text>

        <Text style={styles.sectionTitle}>3. Content Guidelines</Text>
        <Text style={styles.text}>
          You must not post or share content that:
          {"\n"}- Contains offensive, abusive, or inappropriate language
          {"\n"}- Promotes hate speech, violence, or discrimination
          {"\n"}- Violates the rights of others, including copyright or trademark
          laws
          {"\n"}- Contains personal information of others without consent
          {"\n"}- Is misleading or false, potentially harming the reputation of
          products or vendors
        </Text>

        <Text style={styles.sectionTitle}>4. Moderation and Review</Text>
        <Text style={styles.text}>
          We review all user-generated content to ensure compliance with our
          Content Policy. We reserve the right to:
          {"\n"}- Edit or remove content that violates our policy
          {"\n"}- Ban users who repeatedly violate these guidelines
        </Text>

        <Text style={styles.sectionTitle}>5. Reporting Violations</Text>
        <Text style={styles.text}>
          If you come across any content that violates our policy, please report it
          to us immediately using the in-app reporting tool or by contacting support
          at orderkarokrp@gmail.com.
        </Text>

        <Text style={styles.sectionTitle}>6. Consequences of Violations</Text>
        <Text style={styles.text}>
          Violating our Content Policy can result in:
          {"\n"}- Removal of the violating content
          {"\n"}- Temporary or permanent suspension of your account
          {"\n"}- Legal action if the violation is severe and harmful
        </Text>

        <Text style={styles.sectionTitle}>7. Updates to This Policy</Text>
        <Text style={styles.text}>
          We may update this Content Policy to reflect changes in our services or
          regulations. Please check this page periodically for updates.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact Us</Text>
        <Text style={styles.text}>
          For any questions or concerns regarding this Content Policy, please contact
          us at orderkarokrp@gmail.com.
        </Text>

        <Text style={styles.footer}>
          This Content Policy is effective as of [06/12/2024] and is subject to
          changes.
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

export default ContentPolicy;
