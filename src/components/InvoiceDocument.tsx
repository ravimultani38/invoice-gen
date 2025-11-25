import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceData } from '@/app/config/companies';

interface InvoiceDocumentProps {
  data: InvoiceData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, color: '#333' },
  header: { marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companyDetails: { textAlign: 'right' },
  companyName: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  invoiceTitle: { fontSize: 16, color: '#888', marginTop: 4 },
  logo: { width: 80, height: 80, objectFit: 'contain' },
  section: { marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' },
  sectionColumn: { flexGrow: 1, width: '45%' },
  subHeader: { fontSize: 12, fontWeight: 'bold', padding: 6, marginBottom: 8, borderRadius: 3, color: 'white' },
  text: { marginBottom: 3 },
  table: { width: '100%', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottomColor: '#e0e0e0', borderBottomWidth: 1 },
  tableHeader: { color: 'white' },
  tableCol: { padding: 8 },
  colDescription: { width: '55%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  summarySection: { flexDirection: 'row', justifyContent: 'flex-end' },
  summaryTable: { width: '40%' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, paddingBottom: 6, borderBottomColor: '#e0e0e0', borderBottomWidth: 1 },
  summaryLabel: { fontWeight: 'bold' },
  totalDueRow: { fontWeight: 'bold', color: 'white' },
  notes: { fontSize: 9, color: '#555', lineHeight: 1.5, marginTop: 20, borderTopWidth: 1, paddingTop: 10, borderColor: '#e0e0e0' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 10, color: '#888' },
  signatureSection: { marginTop: 40, flexDirection: 'row', justifyContent: 'flex-end' },
  signatureBox: { width: '45%', paddingTop: 8 },
  signatureLine: { borderTopColor: '#333', borderTopWidth: 1, marginTop: 40 },
  signatureImage: { width: 120, height: 40, objectFit: 'contain' },
});

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const totalDue = subtotal - data.deposit;
  
  const billToLabel = data.labels?.billTo || 'Bill To';
  const detailsLabel = data.labels?.details || 'Event Details';
  
  const themeColor = data.themeColor || '#333';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {data.logoBase64 && (
            <Image style={styles.logo} src={data.logoBase64} />
          )}
          <View style={styles.companyDetails}>
            <Text style={{ ...styles.companyName, color: themeColor }}>{data.companyName}</Text>
            <Text style={styles.invoiceTitle}>{data.invoiceTitle}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionColumn}>
            <Text style={{ ...styles.subHeader, backgroundColor: themeColor }}>{billToLabel}</Text>
            <Text style={styles.text}>{data.billTo.name}</Text>
            <Text style={styles.text}>{data.billTo.phone}</Text>
            {/* Added Email Field */}
            {data.billTo.email ? <Text style={styles.text}>{data.billTo.email}</Text> : null}
          </View>
          <View style={styles.sectionColumn}>
            <Text style={{ ...styles.subHeader, backgroundColor: themeColor }}>{detailsLabel}</Text>
            <Text style={styles.text}>Date: {formatDate(data.eventDetails.date)}</Text>
            <Text style={styles.text}>Time: {data.eventDetails.time}</Text>
            <Text style={styles.text}>Location: {data.eventDetails.location}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: themeColor }]}>
            <Text style={[styles.tableCol, styles.colDescription, { fontWeight: 'bold' }]}>DETAILS</Text>
            <Text style={[styles.tableCol, styles.colQty, { fontWeight: 'bold' }]}>QTY/HRS</Text>
            <Text style={[styles.tableCol, styles.colPrice, { fontWeight: 'bold' }]}>RATE</Text>
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
            <View style={[styles.summaryRow, styles.totalDueRow, { backgroundColor: themeColor }]}>
              <Text style={[styles.summaryLabel, { paddingLeft: 4 }]}>Total Due:</Text>
              <Text style={{ paddingRight: 4 }}>${totalDue.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.notes}>
          <Text>{data.notes}</Text>
          <Text style={{ marginTop: 8 }}>{data.paymentDetails}</Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text>{data.companyName} Signature</Text>
            {data.signatureBase64 ? (
              <Image style={styles.signatureImage} src={data.signatureBase64} />
            ) : (
              <View style={styles.signatureLine} />
            )}
            <Text style={{ marginTop: 8 }}>Date: {formatDate(data.signatureDate)}</Text>
          </View>
        </View>
        
        <Text style={styles.footer}>Thank You For Your Business!</Text>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;