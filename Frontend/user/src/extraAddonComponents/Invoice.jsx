import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Arial',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 4,
  },
});

const InvoicePDF = ({ orderDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Invoice</Text>
        <Text style={styles.text}>Order ID: {orderDetails.orderId}</Text>
        <Text style={styles.text}>Date: {orderDetails.date}</Text>
        <Text style={styles.text}>Customer Name: {orderDetails.customerName}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Items</Text>
        {/* {orderDetails.items.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            {item.name} - ${item.price} x {item.quantity}
          </Text>
        ))} */}
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Total: ${orderDetails.total}</Text>
      </View>
      <View style={styles.section}>
        <Text>Thank you for your purchase!</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
