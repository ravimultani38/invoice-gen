'use client';

import React, { useState, useEffect } from 'react';
import { InvoiceData } from './InvoiceForm';

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
      link.download = `invoice-${Date.now()}.pdf`;
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

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={generateAndDownloadPDF}
        className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
      >
        Download PDF
      </button>
    </div>
  );
};

export default ActionButtons;