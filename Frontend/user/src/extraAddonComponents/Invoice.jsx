import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 20,
        padding: 10,
        borderBottom: 1,
        borderColor: '#333',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1a1a1a',
    },
    orderInfo: {
        marginBottom: 20,
    },
    orderInfoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 100,
        fontSize: 10,
        color: '#666',
    },
    value: {
        fontSize: 10,
        flex: 1,
        color: '#333',
    },
    addressSection: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addressBox: {
        width: '45%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 4,
    },
    addressTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#666',
    },
    addressText: {
        fontSize: 10,
        color: '#333',
        marginBottom: 3,
    },
    itemsHeader: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        padding: 8,
        marginBottom: 10,
        borderRadius: 4,
    },
    columnHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#666',
    },
    productCol: {
        flex: 2,
    },
    priceCol: {
        flex: 1,
        textAlign: 'right',
    },
    qtyCol: {
        flex: 1,
        textAlign: 'center',
    },
    totalCol: {
        flex: 1,
        textAlign: 'right',
    },
    item: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 10,
        color: '#333',
    },
    summary: {
        marginTop: 30,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 5,
    },
    summaryLabel: {
        fontSize: 10,
        color: '#666',
        width: 100,
        textAlign: 'right',
        marginRight: 10,
    },
    summaryValue: {
        fontSize: 10,
        color: '#333',
        width: 100,
        textAlign: 'right',
    },
    totalAmount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    footer: {
        marginTop: 50,
        padding: 20,
        textAlign: 'center',
        color: '#666',
        fontSize: 10,
    },
    variants: {
        fontSize: 8,
        color: '#666',
        marginTop: 2,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'right',
        marginBottom: 10,
    }
});

const InvoicePDF = ({ orderDetails }) => (
  
    
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>GeeZee</Text>
                <View style={styles.orderInfo}>
                    <View style={styles.orderInfoRow}>
                        <Text style={styles.label}>Order ID:</Text>
                        <Text style={styles.value}>{orderDetails.orderId}</Text>
                    </View>
                    <View style={styles.orderInfoRow}>
                        <Text style={styles.label}>Date:</Text>
                        <Text style={styles.value}>
                            {new Date(orderDetails.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>
                    <View style={styles.orderInfoRow}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.value}>{orderDetails.status}</Text>
                    </View>
                    <View style={styles.orderInfoRow}>
                        <Text style={styles.label}>Payment Method:</Text>
                        <Text style={styles.value}>{orderDetails.paymentMethod}</Text>
                    </View>
                </View>
            </View>

            {/* Address Section */}
            <View style={styles.addressSection}>
                <View style={styles.addressBox}>
                    <Text style={styles.addressTitle}>Shipping Address</Text>
                    <Text style={styles.addressText}>{orderDetails.customerName}</Text>
                    <Text style={styles.addressText}>{orderDetails.address.street}</Text>
                    <Text style={styles.addressText}>{orderDetails.address.city}</Text>
                    <Text style={styles.addressText}>{orderDetails.address.state} - {orderDetails.address.pinCode}</Text>
                    <Text style={styles.addressText}>Phone: {orderDetails.address.phone}</Text>
                </View>
                <View style={styles.addressBox}>
                    <Text style={styles.addressTitle}>Company Details</Text>
                    <Text style={styles.addressText}>GeeZee E-commerce</Text>
                    <Text style={styles.addressText}>123 Business Street</Text>
                    <Text style={styles.addressText}>Business District</Text>
                    <Text style={styles.addressText}>Contact: support@geezee.com</Text>
                </View>
            </View>

            {/* Items Table */}
            <View>
                <View style={styles.itemsHeader}>
                    <Text style={[styles.columnHeader, styles.productCol]}>Product</Text>
                    <Text style={[styles.columnHeader, styles.priceCol]}>Price</Text>
                    <Text style={[styles.columnHeader, styles.qtyCol]}>Qty</Text>
                    <Text style={[styles.columnHeader, styles.totalCol]}>Total</Text>
                </View>

                {orderDetails.orderItems.map((item, index) => (
                    <View key={index} style={styles.item}>
                        <View style={styles.productCol}>
                            <Text style={styles.itemText}>{item.productId?.title}</Text>
                            {item.variant?.selectedAttributes && (
                                <Text style={styles.variants}>
                                    {Object.entries(item.variant.selectedAttributes)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ')}
                                </Text>
                            )}
                        </View>
                        <Text style={[styles.itemText, styles.priceCol]}>₹{item.price}</Text>
                        <Text style={[styles.itemText, styles.qtyCol]}>{item.quantity}</Text>
                        <Text style={[styles.itemText, styles.totalCol]}>₹{item.price * item.quantity}</Text>
                    </View>
                ))}
            </View>

            {/* Summary */}
            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal:</Text>
                    <Text style={styles.summaryValue}>₹{orderDetails.finalAmount + (orderDetails.discount - orderDetails.shippingCost)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping:</Text>
                    <Text style={styles.summaryValue}>₹{orderDetails.shippingCost || 0}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount:</Text>
                    <Text style={styles.summaryValue}>₹{orderDetails.discount || 0}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, styles.totalAmount]}>Total:</Text>
                    <Text style={[styles.summaryValue, styles.totalAmount]}>₹{orderDetails.finalAmount}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for shopping with GeeZee!</Text>
                <Text>For any queries, please contact our support team.</Text>
            </View>
        </Page>
    </Document>
);

export default InvoicePDF;
