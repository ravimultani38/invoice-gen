'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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
  deposit: number;
  logoBase64?: string;
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
    signatureDate: 'August 31, 2025',
    deposit: 270
  });

  const [logoPreviewError, setLogoPreviewError] = useState(false);

  const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const totalDue = subtotal - invoiceData.deposit;

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const newItems = [...invoiceData.items];
    const item = newItems[index];
    if (field === 'description') {
      item.description = value;
    } else if (field === 'quantity') {
      item.quantity = Number(value) || 0;
    } else if (field === 'price') {
      item.price = Number(value) || 0;
    }
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large! Please choose a file smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setInvoiceData({ ...invoiceData, logoBase64: e.target?.result as string });
      setLogoPreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setInvoiceData({ ...invoiceData, logoBase64: undefined });
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, price: 0 }],
    });
  };
  
  const removeItem = (index: number) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((_, i) => i !== index),
    });
  };
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="p-4 sm:p-10">
        <div className="flex justify-between items-start mb-10">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">INVOICE GENERATOR</h2>
            </div>
            <div className="text-right">
                <h3 className="font-bold mb-2 text-gray-800">Invoice #</h3>
                <input 
                  type="text" 
                  placeholder="e.g., #101"
                  value={invoiceData.invoiceTitle}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceTitle: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400"
                />
            </div>
        </div>
        
        <div className="mb-10 p-6 border-2 border-dashed rounded-lg bg-gray-50">
          <h3 className="font-bold mb-4 text-lg text-gray-800">Company Logo</h3>
          {invoiceData.logoBase64 && !logoPreviewError ? (
            <div className="flex items-start gap-4">
              <Image src={invoiceData.logoBase64} alt="Logo preview" width={96} height={96} className="object-contain border rounded-lg p-2 bg-white" onError={() => setLogoPreviewError(true)} />
              <div>
                <p className="text-green-600 font-medium">✓ Logo uploaded!</p>
                <div className="flex gap-2 mt-2">
                  <label className="cursor-pointer px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200">
                    <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" /> Replace
                  </label>
                  <button onClick={removeLogo} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200">Remove</button>
                </div>
              </div>
            </div>
          ) : (
             <div>
              <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <span>📁 Choose Logo File</span>
              </label>
              <p className="mt-2 text-sm text-gray-500">Max 2MB. PNG, JPG, SVG, WebP supported.</p>
              {logoPreviewError && <p className="mt-2 text-red-600">Error loading image preview.</p>}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="font-bold mb-2 text-gray-800">Bill To</h3>
            <input type="text" placeholder="Client Name" value={invoiceData.billTo.name} onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, name: e.target.value }})} className="w-full p-3 border rounded-md mb-2 text-gray-900 placeholder:text-gray-400" />
            <input type="text" placeholder="Client Phone" value={invoiceData.billTo.phone} onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, phone: e.target.value }})} className="w-full p-3 border rounded-md text-gray-900 placeholder:text-gray-400" />
          </div>
          <div>
            <h3 className="font-bold mb-2 text-gray-800">Event Details</h3>
            <input type="text" placeholder="Event Date" value={invoiceData.eventDetails.date} onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, date: e.target.value }})} className="w-full p-3 border rounded-md mb-2 text-gray-900 placeholder:text-gray-400" />
            <input type="text" placeholder="Event Time" value={invoiceData.eventDetails.time} onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, time: e.target.value }})} className="w-full p-3 border rounded-md mb-2 text-gray-900 placeholder:text-gray-400" />
            <input type="text" placeholder="Event Location" value={invoiceData.eventDetails.location} onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, location: e.target.value }})} className="w-full p-3 border rounded-md text-gray-900 placeholder:text-gray-400" />
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-bold mb-2 text-gray-800">Line Items</h3>
          <div className="grid grid-cols-12 gap-2 mb-2">
            <label className="col-span-5 font-semibold text-sm text-gray-800">Description</label>
            <label className="col-span-2 font-semibold text-sm text-gray-800 text-center">Quantity</label>
            <label className="col-span-2 font-semibold text-sm text-gray-800 text-right">Price</label>
            <label className="col-span-2 font-semibold text-sm text-gray-800 text-right">Total</label>
          </div>
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
              <input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="col-span-5 p-2 border rounded text-gray-900 placeholder:text-gray-400" placeholder="Description" />
              <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="col-span-2 p-2 border rounded text-center text-gray-900 placeholder:text-gray-400" placeholder="Qty" min="0" />
              <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="col-span-2 p-2 border rounded text-right text-gray-900 placeholder:text-gray-400" placeholder="Price" min="0" step="0.01" />
              <div className="col-span-2 p-2 text-right font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</div>
              <button onClick={() => removeItem(index)} className="col-span-1 text-red-600 hover:text-red-800 text-2xl" title="Remove item">×</button>
            </div>
          ))}
          <button onClick={addItem} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">+ Add Item</button>
        </div>

        <div className="flex justify-end mb-10">
            <div className="w-full md:w-96 bg-gray-50 rounded-lg p-6 border">
              <h3 className="font-bold mb-4 text-lg text-gray-800">Invoice Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Deposit:</span><input type="number" value={invoiceData.deposit} onChange={(e) => setInvoiceData({ ...invoiceData, deposit: Number(e.target.value) || 0 })} className="w-24 p-2 text-right border rounded text-sm text-gray-900 placeholder:text-gray-400" placeholder="0" min="0" step="0.01" /></div>
                <div className="border-t pt-2 mt-2"><div className="flex justify-between"><span className="font-bold text-lg text-gray-800">Total Due:</span><span className="font-bold text-xl text-green-600">${totalDue.toFixed(2)}</span></div></div>
              </div>
            </div>
        </div>
        
        <div>
          <h3 className="font-bold mb-2 text-gray-800">Terms & Notes</h3>
          <textarea value={invoiceData.notes} onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })} className="w-full h-32 p-3 border rounded-md text-gray-900 placeholder:text-gray-400" placeholder="Add terms..." />
        </div>
      </div>
      <ActionButtons invoiceData={invoiceData} />
    </div>
  );
};

export default InvoiceForm;