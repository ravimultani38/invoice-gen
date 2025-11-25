'use client';

import React, { useState, useEffect } from 'react';
import { InvoiceData } from '@/app/config/companies';

interface ActionButtonsProps {
  invoiceData: InvoiceData;
  onAutoSave?: () => void; // Added optional callback
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ invoiceData, onAutoSave }) => {
  const [isClient, setIsClient] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerate = async (action: 'download' | 'print') => {
    if (isGenerating) return;

    // Trigger the auto-save history function if provided
    if (onAutoSave) onAutoSave();

    setIsGenerating(true);

    try {
      const { pdf } = await import('@react-pdf/renderer');
      const InvoiceDocument = (await import('./InvoiceDocument')).default;
      
      const pdfBlob = await pdf(<InvoiceDocument data={invoiceData} />).toBlob();
      const url = URL.createObjectURL(pdfBlob);

      if (action === 'download') {
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${invoiceData.companyName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(url, '_blank');
      }

      // Clean up URL after a delay to allow open/download to trigger
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex justify-center mt-8">
        <div className="px-8 py-3 bg-gray-300 text-white font-bold rounded-lg animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  const themeColor = invoiceData.themeColor || '#10b981';

  return (
    <div className="flex justify-center gap-4 mt-8 pb-8">
      <button
        onClick={() => handleGenerate('print')}
        disabled={isGenerating}
        className="px-8 py-3 bg-white text-gray-700 border border-gray-300 font-bold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none transition-all transform hover:-translate-y-0.5"
      >
        {isGenerating ? 'Generating...' : '🖨️ Print / Preview'}
      </button>

      <button
        onClick={() => handleGenerate('download')}
        disabled={isGenerating}
        style={{ backgroundColor: themeColor }}
        className="px-8 py-3 text-white font-bold rounded-lg shadow-md hover:opacity-90 focus:outline-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        {isGenerating ? 'Generating...' : 'Download PDF'}
      </button>
    </div>
  );
};

export default ActionButtons;