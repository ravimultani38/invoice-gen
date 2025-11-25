'use client';

import React, { useState, useEffect } from 'react';
import { InvoiceData } from '@/app/config/companies'; // Updated import

interface ActionButtonsProps {
  invoiceData: InvoiceData;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ invoiceData }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateAndDownloadPDF = async () => {
    try {
      // Dynamically import all PDF-related modules
      const { pdf } = await import('@react-pdf/renderer');
      const InvoiceDocument = (await import('./InvoiceDocument')).default;
      
      // Generate the PDF blob
      const pdfBlob = await pdf(<InvoiceDocument data={invoiceData} />).toBlob();
      
      // Create download link and trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceData.companyName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (!isClient) {
    return (
      <div className="flex justify-center mt-8">
        <div className="px-8 py-3 bg-gray-400 text-white font-bold rounded-lg">
          Loading...
        </div>
      </div>
    );
  }

  // Dynamic style based on theme color
  const themeColor = invoiceData.themeColor || '#10b981'; // Default green if missing

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={generateAndDownloadPDF}
        style={{ backgroundColor: themeColor }}
        className="px-8 py-3 text-white font-bold rounded-lg shadow-md hover:opacity-90 focus:outline-none transition-transform transform hover:scale-105"
      >
        Download PDF
      </button>
    </div>
  );
};

export default ActionButtons;