import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceData } from './InvoiceForm';

// Props for the document component
interface InvoiceDocumentProps {
  data: InvoiceData;
}

// Styles for the PDF document
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, color: '#333' },
  header: { marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companyDetails: { textAlign: 'right' },
  companyName: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  invoiceTitle: { fontSize: 16, color: '#888', marginTop: 4 },
  logo: { width: 80, height: 80, objectFit: 'contain' },
  section: { marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' },
  sectionColumn: { flexGrow: 1, width: '45%' },
  subHeader: { fontSize: 12, fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: 6, marginBottom: 8, borderRadius: 3, },
  text: { marginBottom: 3 },
  table: { width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 20, },
  tableRow: { flexDirection: 'row', borderBottomColor: '#e0e0e0', borderBottomWidth: 1, },
  tableHeader: { backgroundColor: '#f0f0f0' },
  tableCol: { padding: 8, borderRightColor: '#e0e0e0', borderRightWidth: 1, },
  colDescription: { width: '55%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  summarySection: { flexDirection: 'row', justifyContent: 'flex-end' },
  summaryTable: { width: '40%' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, paddingBottom: 6, borderBottomColor: '#e0e0e0', borderBottomWidth: 1, },
  summaryLabel: { fontWeight: 'bold' },
  totalDueRow: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  notes: { fontSize: 9, color: '#555', lineHeight: 1.5, marginTop: 20, borderTopColor: '#e0e0e0', borderTopWidth: 1, paddingTop: 10, },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 10, color: '#888', },
  signatureSection: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', },
  signatureBox: { width: '45%', paddingTop: 8 },
  signatureLine: { borderTopColor: '#333', borderTopWidth: 1, marginTop: 40 },
  signatureImage: { width: 120, height: 40, objectFit: 'contain' },
});

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const totalDue = subtotal - data.deposit;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {data.logoBase64 && (
            <Image style={styles.logo} src={data.logoBase64} />
          )}
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>{data.companyName}</Text>
            <Text style={styles.invoiceTitle}>{data.invoiceTitle}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionColumn}>
            <Text style={styles.subHeader}>Bill To</Text>
            <Text style={styles.text}>{data.billTo.name}</Text>
            <Text style={styles.text}>{data.billTo.phone}</Text>
          </View>
          <View style={styles.sectionColumn}>
            <Text style={styles.subHeader}>Event Details</Text>
            <Text style={styles.text}>Date: {data.eventDetails.date}</Text>
            <Text style={styles.text}>Time: {data.eventDetails.time}</Text>
            <Text style={styles.text}>Location: {data.eventDetails.location}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.colDescription, { fontWeight: 'bold' }]}>DETAILS</Text>
            <Text style={[styles.tableCol, styles.colQty, { fontWeight: 'bold' }]}>QUANTITY</Text>
            <Text style={[styles.tableCol, styles.colPrice, { fontWeight: 'bold' }]}>PRICE</Text>
            <Text style={[styles.tableCol, styles.colTotal, { fontWeight: 'bold' }]}>TOTAL</Text>
          </View>
          {data.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCol, styles.colDescription]}>{item.description}</Text>
              <Text style={[styles.tableCol, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCol, styles.colPrice]}>${item.price.toFixed(2)}</Text>
              <Text style={[styles.tableCol, styles.colTotal]}>${(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.summarySection}>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Deposit:</Text>
              <Text>${data.deposit.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalDueRow]}>
              <Text style={styles.summaryLabel}>Total Due:</Text>
              <Text>${totalDue.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.notes}>
          <Text>{data.notes}</Text>
          <Text style={{ marginTop: 8 }}>{data.paymentDetails}</Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text>Client&apos;s Signature</Text>
            <View style={styles.signatureLine} />
            <Text style={{ marginTop: 8 }}>Date: ________________</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Royal Turban Tying NY Signature</Text>
            {data.signatureBase64 ? (
              <Image style={styles.signatureImage} src={data.signatureBase64} />
            ) : (
              <View style={styles.signatureLine} />
            )}
            <Text style={{ marginTop: 8 }}>Date: {data.signatureDate}</Text>
          </View>
        </View>
        
        <Text style={styles.footer}>Thank You For Your Business!</Text>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;