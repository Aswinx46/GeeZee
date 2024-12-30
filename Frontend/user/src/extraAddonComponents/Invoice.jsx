// import React from 'react';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// // Define styles for the PDF document
// const styles = StyleSheet.create({
//   page: {
//     padding: 20,
//     fontFamily: 'Arial',
//   },
//   section: {
//     marginBottom: 10,
//   },
//   header: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 12,
//   },
//   listItem: {
//     fontSize: 12,
//     marginBottom: 4,
//   },
// });

// const InvoicePDF = ({ orderDetails }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text style={styles.header}>Invoice</Text>
//         <Text style={styles.text}>Order ID: {orderDetails.orderId}</Text>
//         <Text style={styles.text}>Date: {orderDetails.date}</Text>
//         <Text style={styles.text}>Customer Name: {orderDetails.customerName}</Text>
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.header}>Items</Text>
//         {orderDetails.orderItems.map((item, index) => (
//           <Text key={index} style={styles.listItem}>
//             {item.productId?.title} - ${item.price} x {item.quantity}
//           </Text>
//         ))}
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.text}>Total: ${orderDetails.finalAmount}</Text>
//       </View>
//       <View style={styles.section}>
//         <Text>Thank you for your purchase!</Text>
//       </View>
//     </Page>
//   </Document>
// );

// export default InvoicePDF;

import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

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

// Component to generate the PDF content
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
         {orderDetails.orderItems.map((item, index) => (
        <Text key={index} style={styles.listItem}>
            {item.productId?.title} - ${item.price} x {item.quantity}
        </Text>
    ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>Total: ${orderDetails.finalAmount}</Text>
            </View>
            <View style={styles.section}>
                <Text>Thank you for your purchase!</Text>
            </View>
        </Page>
    </Document>
);

// Main Component
const App = () => {
    const orderDetails = {
        orderId: '12345',
        date: '2024-12-30',
        customerName: 'John Doe',
        orderItems: [
            { productId: { title: 'Product 1' }, price: 20, quantity: 2 },
            { productId: { title: 'Product 2' }, price: 15, quantity: 1 },
        ],
        finalAmount: 55,
    };

    return (
        <div>
            <h1>Download Invoice</h1>
            <PDFDownloadLink
                document={<InvoicePDF orderDetails={orderDetails} />}
                fileName="invoice.pdf"
                style={{
                    textDecoration: 'none',
                    padding: '10px 20px',
                    color: '#fff',
                    backgroundColor: '#007bff',
                    borderRadius: '5px',
                }}
            >
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
        </div>
    );
};

export default App;
