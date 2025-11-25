export type CompanyType = 'ROYAL_TURBAN' | 'ESCALADE_RIDE';

export interface Item {
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  invoiceTitle: string;
  companyName: string;
  // Added email to billTo
  billTo: { name: string; phone: string; email: string };
  eventDetails: { date: string; time: string; location: string };
  items: Item[];
  notes: string;
  paymentDetails: string;
  signatureDate: string;
  deposit: number;
  logoBase64?: string;
  signatureBase64?: string;
  labels?: { billTo?: string; details?: string };
  themeColor: string;
}

const TODAY = new Date().toISOString().split('T')[0];

export const COMPANY_DEFAULTS: Record<CompanyType, InvoiceData> = {
  ROYAL_TURBAN: {
    invoiceTitle: 'Invoice #101',
    companyName: 'ROYAL TURBAN NYC',
    // Added empty email default
    billTo: { name: '', phone: '', email: '' },
    eventDetails: {
      date: TODAY,
      time: '10:30 AM to 12:30 PM',
      location: '',
    },
    items: [
      { description: 'Turban Tying Service', quantity: 1, price: 150 },
      { description: 'Travel Charge', quantity: 1, price: 50 },
    ],
    notes: `Terms & Conditions:\n- The client will provide turban material on the day of the event.\n- The event planner is responsible for the timing of turban tying.\n- All deposits are non-refundable.`,
    paymentDetails: 'Payment Methods: Cash or Zelle (929-247-6814).',
    signatureDate: TODAY,
    deposit: 0,
    labels: { billTo: 'Bill To', details: 'Event Details' },
    themeColor: '#f97316',
  },
  ESCALADE_RIDE: {
    invoiceTitle: 'Trip Receipt #001',
    companyName: 'Escalade Ride Inc.',
    // Added empty email default
    billTo: { name: '', phone: '', email: '' },
    eventDetails: {
      date: TODAY,
      time: 'Pickup: 10:00 AM',
      location: 'JFK Airport to Manhattan',
    },
    items: [
      { description: 'Luxury Limo Service (Hours)', quantity: 3, price: 120 },
      { description: 'Tolls & Surcharges', quantity: 1, price: 45 },
      { description: 'Gratuity (20%)', quantity: 1, price: 72 },
    ],
    notes: `Terms & Conditions:\n- Overtime charges apply after the booked duration.\n- No smoking or food allowed inside the vehicle.\n- Cancellations within 24 hours are non-refundable.`,
    paymentDetails: 'Payment Methods: Credit Card, Cash, or Corporate Account.',
    signatureDate: TODAY,
    deposit: 100,
    labels: { billTo: 'Passenger / Bill To', details: 'Trip Information' },
    themeColor: '#1f2937',
  }
};