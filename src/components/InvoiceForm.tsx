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
  deposit: number;
  logoBase64?: string; // Logo field for Base64 encoded image
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
    deposit: 270
  });

  const [logoPreviewError, setLogoPreviewError] = useState(false);

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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose a file smaller than 2MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please choose a PNG, JPG, SVG, or WebP image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setInvoiceData({ ...invoiceData, logoBase64: base64String });
        setLogoPreviewError(false);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setInvoiceData({ ...invoiceData, logoBase64: undefined });
    setLogoPreviewError(false);
    // Clear the file input
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleLogoError = () => {
    setLogoPreviewError(true);
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
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="p-4 sm:p-10">
        <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">INVOICE GENERATOR</h2>
        
        {/* Logo Upload Section */}
        <div className="mb-10 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
            <span className="text-blue-600">🏢</span>
            Company Logo
          </h3>
          
          {invoiceData.logoBase64 && !logoPreviewError ? (
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={invoiceData.logoBase64} 
                  alt="Logo preview" 
                  className="w-24 h-24 object-contain border-2 border-gray-200 rounded-lg shadow-sm bg-white p-2"
                  onError={handleLogoError}
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">✓ Logo uploaded successfully!</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your logo will appear next to your company name in the PDF invoice.
                </p>
                <div className="flex gap-2">
                  <label className="cursor-pointer inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    Replace Logo
                  </label>
                  <button 
                    onClick={removeLogo}
                    className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors"
                  >
                    Remove Logo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-3xl">
                  🖼️
                </div>
              </div>
              <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <span className="mr-2">📁</span>
                Choose Logo File
              </label>
              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p><strong>Supported formats:</strong> PNG, JPG, SVG, WebP</p>
                <p><strong>Recommended size:</strong> 200×200px or smaller</p>
                <p><strong>Max file size:</strong> 2MB</p>
                <p><strong>Tip:</strong> PNG with transparent background looks most professional</p>
              </div>
              {logoPreviewError && (
                <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  Error loading image. Please try a different file.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="font-bold mb-2 text-gray-800">Bill To</h3>
            <input 
              type="text" 
              placeholder="Client Name"
              value={invoiceData.billTo.name}
              onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, name: e.target.value }})}
              className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
            <input 
              type="text" 
              placeholder="Client Phone"
              value={invoiceData.billTo.phone}
              onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, phone: e.target.value }})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div>
            <h3 className="font-bold mb-2 text-gray-800">Event Details</h3>
            <input 
              type="text" 
              placeholder="Event Date"
              value={invoiceData.eventDetails.date}
              onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, date: e.target.value }})}
              className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
            <input 
              type="text" 
              placeholder="Event Time"
              value={invoiceData.eventDetails.time}
              onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, time: e.target.value }})}
              className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
            <input 
              type="text" 
              placeholder="Event Location"
              value={invoiceData.eventDetails.location}
              onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, location: e.target.value }})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="mb-10 overflow-x-auto">
          <h3 className="font-bold mb-2 text-gray-800">Line Items</h3>
          
          <div className="grid grid-cols-12 gap-2 mb-2">
              <label className="col-span-5 font-semibold text-sm text-gray-800">Description</label>
              <label className="col-span-2 font-semibold text-sm text-gray-800 text-center">Quantity</label>
              <label className="col-span-2 font-semibold text-sm text-gray-800 text-right">Price</label>
              <label className="col-span-2 font-semibold text-sm text-gray-800 text-right">Total</label>
              <div className="col-span-1"></div>
          </div>

          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
              <input 
                type="text" 
                value={item.description} 
                onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                className="col-span-5 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white" 
                placeholder="Description"
              />
              <input 
                type="number" 
                value={item.quantity} 
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                className="col-span-2 p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white" 
                placeholder="Qty"
                min="0"
              />
              <input 
                type="number" 
                value={item.price} 
                onChange={(e) => handleItemChange(index, 'price', e.target.value)} 
                className="col-span-2 p-2 border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white" 
                placeholder="Price"
                min="0"
                step="0.01"
              />
              <div className="col-span-2 p-2 text-right font-semibold text-gray-900">
                ${(item.quantity * item.price).toFixed(2)}
              </div>
              <button 
                onClick={() => removeItem(index)} 
                className="col-span-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded p-1 text-2xl transition-colors font-bold"
                title="Remove item"
              >
                ×
              </button>
            </div>
          ))}
          <button 
            onClick={addItem} 
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <span>+</span>
            Add Item
          </button>
        </div>

        {/* Invoice Summary Section */}
        <div className="mb-10 border-t pt-6">
          <div className="flex justify-end">
            <div className="w-full md:w-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border shadow-sm">
              <h3 className="font-bold mb-4 text-lg text-gray-800">Invoice Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Deposit:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={invoiceData.deposit}
                      onChange={(e) => setInvoiceData({ ...invoiceData, deposit: Number(e.target.value) || 0 })}
                      className="w-24 p-2 text-right border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-bold text-lg text-gray-800">Total Due:</span>
                    <span className="font-bold text-xl text-green-600">
                      ${totalDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold mb-2 text-gray-800">Terms & Notes</h3>
          <textarea
            value={invoiceData.notes}
            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            placeholder="Add terms, conditions, or notes here..."
          />
        </div>
      </div>

      <ActionButtons invoiceData={invoiceData} />
    </div>
  );
};

export default InvoiceForm;