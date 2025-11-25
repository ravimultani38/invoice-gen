'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
// Ensure this path matches where you created the file. 
// If it's in src/config/companies.ts, use '@/config/companies'
import { InvoiceData, Item, CompanyType, COMPANY_DEFAULTS } from '@/app/config/companies';

// Dynamically import the ActionButtons to ensure it's client-side only
const ActionButtons = dynamic(() => import('./ActionButtons'), {
  ssr: false,
});

interface InvoiceFormProps {
  selectedCompany: CompanyType;
  onBack: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ selectedCompany, onBack }) => {
  // Initialize with defaults
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(COMPANY_DEFAULTS[selectedCompany]);
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load data from LocalStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`invoice_data_${selectedCompany}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge with defaults to ensure new fields (like email) exist if loading old data
        setInvoiceData({ ...COMPANY_DEFAULTS[selectedCompany], ...parsed });
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    } else {
        // If no saved data, ensure we start with fresh defaults for this company
        setInvoiceData(COMPANY_DEFAULTS[selectedCompany]);
    }
    setIsLoaded(true);
  }, [selectedCompany]);

  // 2. Save data to LocalStorage whenever it changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`invoice_data_${selectedCompany}`, JSON.stringify(invoiceData));
    }
  }, [invoiceData, selectedCompany, isLoaded]);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset this form? All current changes will be lost.")) {
      const defaults = COMPANY_DEFAULTS[selectedCompany];
      setInvoiceData(defaults);
      localStorage.setItem(`invoice_data_${selectedCompany}`, JSON.stringify(defaults));
    }
  };

  const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const totalDue = subtotal - invoiceData.deposit;

  const themeColor = invoiceData.themeColor || '#333';
  const buttonStyle = { backgroundColor: themeColor };
  
  // FIX: Define the custom CSS variable for the ring color and cast to CSSProperties
  const inputStyle = { '--tw-ring-color': themeColor } as React.CSSProperties;

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'logoBase64' | 'signatureBase64') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('File is too large! Please choose a file smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setInvoiceData({ ...invoiceData, [field]: e.target?.result as string });
      if (field === 'logoBase64') setLogoPreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (field: 'logoBase64' | 'signatureBase64') => {
    setInvoiceData({ ...invoiceData, [field]: undefined });
    const fileInputId = field === 'logoBase64' ? 'logo-upload' : 'signature-upload';
    const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
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
  
  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-6xl mx-auto relative transition-all duration-500 ease-in-out">
        <div className="flex justify-between items-center mb-4">
            <button 
                onClick={onBack} 
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
                ← Switch Company
            </button>
            <button 
                onClick={handleReset}
                className="text-sm text-red-400 hover:text-red-600 underline transition-colors"
            >
                Reset Form
            </button>
        </div>

      <div className="p-4 sm:p-10">
        <div className="flex justify-between items-start mb-10 border-b pb-6">
            <div>
                <h2 className="text-3xl font-bold uppercase" style={{ color: themeColor }}>{invoiceData.companyName}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedCompany === 'ESCALADE_RIDE' ? 'Luxury Transportation Service' : 'Premium Turban Tying Service'}</p>
            </div>
            <div className="text-right">
                <h3 className="font-bold mb-2 text-gray-800">Receipt #</h3>
                <input 
                  type="text" 
                  placeholder="e.g., #101"
                  value={invoiceData.invoiceTitle}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceTitle: e.target.value })}
                  // FIX: Apply the inputStyle here
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 text-right focus:ring-2 outline-none transition-all"
                  style={inputStyle}
                />
            </div>
        </div>
        
        {/* Logo Upload Section */}
        <div className="mb-10 p-6 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <h3 className="font-bold mb-4 text-lg text-gray-800">Company Logo</h3>
          {invoiceData.logoBase64 && !logoPreviewError ? (
            <div className="flex items-start gap-4">
              <Image src={invoiceData.logoBase64} alt="Logo preview" width={96} height={96} className="object-contain border rounded-lg p-2 bg-white" onError={() => setLogoPreviewError(true)} />
              <div>
                <p className="text-green-600 font-medium">✓ Logo uploaded!</p>
                <div className="flex gap-2 mt-2">
                  <label className="cursor-pointer px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors">
                    <input id="logo-upload" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoBase64')} className="hidden" /> Replace
                  </label>
                  <button onClick={() => removeImage('logoBase64')} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors">Remove</button>
                </div>
              </div>
            </div>
          ) : (
             <div>
              <label className="cursor-pointer inline-flex items-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm" style={buttonStyle}>
                <input id="logo-upload" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoBase64')} className="hidden" />
                <span>📁 Choose Logo File</span>
              </label>
              <p className="mt-2 text-sm text-gray-500">Max 2MB. PNG, JPG, SVG, WebP supported.</p>
              {logoPreviewError && <p className="mt-2 text-red-600">Error loading image preview.</p>}
            </div>
          )}
        </div>

        {/* Bill To & Event Details */}
        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="font-bold mb-2 text-gray-800 border-b pb-1" style={{ borderColor: themeColor }}>{invoiceData.labels?.billTo || 'Bill To'}</h3>
            <div className="space-y-2">
                <input type="text" placeholder="Client/Passenger Name" value={invoiceData.billTo.name} onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, name: e.target.value, phone: invoiceData.billTo.phone, email: invoiceData.billTo.email }})} className="w-full p-3 border rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:outline-none" style={inputStyle} />
                <input type="text" placeholder="Phone / Contact" value={invoiceData.billTo.phone} onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, name: invoiceData.billTo.name, phone: e.target.value, email: invoiceData.billTo.email }})} className="w-full p-3 border rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:outline-none" style={inputStyle} />
                <input type="email" placeholder="Email Address" value={invoiceData.billTo.email} onChange={(e) => setInvoiceData({ ...invoiceData, billTo: { ...invoiceData.billTo, name: invoiceData.billTo.name, phone: invoiceData.billTo.phone, email: e.target.value }})} className="w-full p-3 border rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:outline-none" style={inputStyle} />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-gray-800 border-b pb-1" style={{ borderColor: themeColor }}>{invoiceData.labels?.details || 'Event Details'}</h3>
            <div className="space-y-2">
                <input 
                    type="date" 
                    value={invoiceData.eventDetails.date} 
                    onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, date: e.target.value }})} 
                    className="w-full p-3 border rounded-md text-gray-900 placeholder:text-gray-400" 
                />
                <input type="text" placeholder={selectedCompany === 'ESCALADE_RIDE' ? "Pickup Time" : "Event Time"} value={invoiceData.eventDetails.time} onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, time: e.target.value }})} className="w-full p-3 border rounded-md text-gray-900 placeholder:text-gray-400" />
                <input type="text" placeholder={selectedCompany === 'ESCALADE_RIDE' ? "Route / Location" : "Location"} value={invoiceData.eventDetails.location} onChange={(e) => setInvoiceData({ ...invoiceData, eventDetails: { ...invoiceData.eventDetails, location: e.target.value }})} className="w-full p-3 border rounded-md text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-10">
          <h3 className="font-bold mb-2 text-gray-800">Line Items</h3>
          <div className="grid grid-cols-12 gap-2 mb-2 text-white p-2 rounded-t-md shadow-sm" style={{ backgroundColor: themeColor }}>
            <label className="col-span-5 font-semibold text-sm">Description</label>
            <label className="col-span-2 font-semibold text-sm text-center">Qty/Hrs</label>
            <label className="col-span-2 font-semibold text-sm text-right">Price/Rate</label>
            <label className="col-span-2 font-semibold text-sm text-right">Total</label>
          </div>
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2 border-b pb-2 border-gray-100 hover:bg-gray-50 transition-colors p-2">
              <input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="col-span-5 p-2 border rounded text-gray-900 placeholder:text-gray-400 bg-transparent" placeholder="Description" />
              <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="col-span-2 p-2 border rounded text-center text-gray-900 placeholder:text-gray-400 bg-transparent" placeholder="Qty" min="0" />
              <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="col-span-2 p-2 border rounded text-right text-gray-900 placeholder:text-gray-400 bg-transparent" placeholder="Price" min="0" step="0.01" />
              <div className="col-span-2 p-2 text-right font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</div>
              <button onClick={() => removeItem(index)} className="col-span-1 text-gray-400 hover:text-red-600 text-xl transition-colors" title="Remove item">×</button>
            </div>
          ))}
          <button onClick={addItem} className="mt-2 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm text-sm" style={buttonStyle}>+ Add Line Item</button>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-10">
            <div className="w-full md:w-96 bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold mb-4 text-lg text-gray-800">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Deposit / Paid:</span><input type="number" value={invoiceData.deposit} onChange={(e) => setInvoiceData({ ...invoiceData, deposit: Number(e.target.value) || 0 })} className="w-24 p-2 text-right border rounded text-sm text-gray-900 placeholder:text-gray-400 bg-white" placeholder="0" min="0" step="0.01" /></div>
                <div className="border-t pt-3 mt-2"><div className="flex justify-between items-center"><span className="font-bold text-lg text-gray-800">Total Due:</span><span className="font-bold text-2xl" style={{ color: themeColor }}>${totalDue.toFixed(2)}</span></div></div>
              </div>
            </div>
        </div>
        
        {/* Notes */}
        <div>
          <h3 className="font-bold mb-2 text-gray-800">Terms & Notes</h3>
          <textarea value={invoiceData.notes} onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })} className="w-full h-32 p-3 border rounded-md text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white transition-colors" placeholder="Add terms..." />
        </div>
        
        {/* Signature Upload Section */}
        <div className="mt-10 p-6 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <h3 className="font-bold mb-4 text-lg text-gray-800">Company Signature</h3>
          {invoiceData.signatureBase64 ? (
            <div className="flex items-start gap-4">
              <Image src={invoiceData.signatureBase64} alt="Signature preview" width={120} height={60} className="object-contain border rounded-lg p-2 bg-white" />
              <div>
                <p className="text-green-600 font-medium">✓ Signature uploaded!</p>
                <div className="flex gap-2 mt-2">
                  <label className="cursor-pointer px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors">
                    <input id="signature-upload" type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'signatureBase64')} className="hidden" /> Replace
                  </label>
                  <button onClick={() => removeImage('signatureBase64')} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors">Remove</button>
                </div>
              </div>
            </div>
          ) : (
             <div>
              <label className="cursor-pointer inline-flex items-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm" style={buttonStyle}>
                <input id="signature-upload" type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'signatureBase64')} className="hidden" />
                <span>✍️ Choose Signature File</span>
              </label>
              <p className="mt-2 text-sm text-gray-500">Recommended: PNG with transparent background.</p>
            </div>
          )}
          
          <div className="mt-4">
             <label className="block text-sm text-gray-600 mb-1">Date:</label>
             <input 
                type="date" 
                value={invoiceData.signatureDate} 
                onChange={(e) => setInvoiceData({ ...invoiceData, signatureDate: e.target.value })}
                className="p-2 border rounded-md text-gray-900 bg-white"
             />
          </div>
        </div>

      </div>
      <ActionButtons invoiceData={invoiceData} />
    </div>
  );
};

export default InvoiceForm;