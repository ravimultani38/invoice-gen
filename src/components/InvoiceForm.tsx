'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ActionButtons = dynamic(() => import('./ActionButtons'), {
  ssr: false,
});

export interface Item {
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  invoiceTitle: string;
  companyName: string;
  billTo: { name: string; phone: string };
  eventDetails: { date: string; time: string; location: string };
  items: Item[];
  notes: string;
  paymentDetails: string;
  signatureDate: string;
  deposit: number; // Added deposit to the interface
}

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceTitle: 'Invoice #101',
    companyName: 'ROYAL TURBAN NYC',
    billTo: { name: 'Eshvar Kotahwala', phone: '+1 (347) 249-0738' },
    eventDetails: {
      date: 'November 2, 2025',
      time: '10:30 AM to 12:30 PM',
      location: 'Hilton Hasbrouck Heights, NJ',
    },
    items: [
      { description: 'Each Additional Turban', quantity: 45, price: 30 },
      { description: 'Travel Charge', quantity: 1, price: 120 },
    ],
    notes: `Terms & Conditions:\n- The client will provide turban material on the day of the event.\n- The event planner is responsible for the timing of turban tying.\n- Only TWO tiers are available. Additional tiers will incur extra charges.\n- All deposits are non-refundable.`,
    paymentDetails: 'Payment Methods: Cash or Zelle (929-247-6814).',
    signatureDate: '5/15/2025',
    deposit: 270 // Added deposit field
  });

  // Calculate totals
  const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const totalDue = subtotal - invoiceData.deposit;

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const newItems = [...invoiceData.items];
    const item = newItems[index];

    if (field === 'description') {
        item[field] = value;
    } else {
        item[field] = Number(value) || 0;
    }
    
    setInvoiceData({ ...invoiceData, items: newItems });
  };
  
  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, price: 0 }],
    });
  };
  
  const removeItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <div className="p-4 sm:p-10">
        <h2 className="text-2xl font-bold mb-10 text-center">INVOICE DETAILS</h2>
        
        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="font-bold mb-2">Bill To</h3>
            <input 
              type="text" 
              placeholder="Client Name"
              value={invoiceData.billTo.name}
              onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, name: e.target.value }})}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input 
              type="text" 
              placeholder="Client Phone"
              value={invoiceData.billTo.phone}
              onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, phone: e.target.value }})}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <h3 className="font-bold mb-2">Event Details</h3>
            <input 
              type="text" 
              placeholder="Event Date"
              value={invoiceData.eventDetails.date}
              onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, date: e.target.value }})}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input 
              type="text" 
              placeholder="Event Time"
              value={invoiceData.eventDetails.time}
              onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, time: e.target.value }})}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input 
              type="text" 
              placeholder="Event Location"
              value={invoiceData.eventDetails.location}
              onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, location: e.target.value }})}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="mb-10 overflow-x-auto">
          <h3 className="font-bold mb-2">Line Items</h3>
          
          <div className="grid grid-cols-12 gap-2 mb-2">
              <label className="col-span-5 font-semibold text-sm text-gray-600">Description</label>
              <label className="col-span-2 font-semibold text-sm text-gray-600 text-center">Quantity</label>
              <label className="col-span-2 font-semibold text-sm text-gray-600 text-right">Price</label>
              <label className="col-span-2 font-semibold text-sm text-gray-600 text-right">Total</label>
              <div className="col-span-1"></div>
          </div>

          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
              <input 
                type="text" 
                value={item.description} 
                onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                className="col-span-5 p-2 border rounded" 
                placeholder="Description"
              />
              <input 
                type="number" 
                value={item.quantity} 
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                className="col-span-2 p-2 border rounded text-center" 
                placeholder="Qty"
              />
              <input 
                type="number" 
                value={item.price} 
                onChange={(e) => handleItemChange(index, 'price', e.target.value)} 
                className="col-span-2 p-2 border rounded text-right" 
                placeholder="Price"
              />
              <div className="col-span-2 p-2 text-right font-medium">
                ${(item.quantity * item.price).toFixed(2)}
              </div>
              <button 
                onClick={() => removeItem(index)} 
                className="col-span-1 text-red-500 hover:text-red-700 text-2xl"
              >
                ×
              </button>
            </div>
          ))}
          <button 
            onClick={addItem} 
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            + Add Item
          </button>
        </div>

        {/* Invoice Summary Section */}
        <div className="mb-10 border-t pt-6">
          <div className="flex justify-end">
            <div className="w-full md:w-96 bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold mb-4 text-lg">Invoice Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Deposit:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">$</span>
                    <input 
                      type="number" 
                      value={invoiceData.deposit}
                      onChange={(e) => setInvoiceData({ ...invoiceData, deposit: Number(e.target.value) || 0 })}
                      className="w-20 p-1 text-right border rounded text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total Due:</span>
                    <span className="font-bold text-lg text-green-600">
                      ${totalDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold mb-2">Terms & Notes</h3>
          <textarea
            value={invoiceData.notes}
            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
            className="w-full h-24 p-2 border rounded-md"
          />
        </div>
      </div>

      <ActionButtons invoiceData={invoiceData} />
    </div>
  );
};

export default InvoiceForm;