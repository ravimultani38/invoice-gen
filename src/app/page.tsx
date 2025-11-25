'use client';

import { useState } from 'react';
import InvoiceForm, { CompanyType } from '@/components/InvoiceForm';

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 my-8">
          Receipt Generator
        </h1>
        
        {!selectedCompany ? (
          <div className="flex flex-col gap-6 items-center justify-center mt-10">
            <p className="text-gray-600 text-lg mb-4">Select a company to create a receipt for:</p>
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
                <button 
                    onClick={() => setSelectedCompany('ROYAL_TURBAN')}
                    className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-500"
                >
                    <div className="text-4xl mb-4">👳‍♂️</div>
                    <h2 className="text-xl font-bold text-gray-900">Royal Turban NYC</h2>
                    <p className="text-gray-500 text-sm mt-2 text-center">Turban Tying Services</p>
                </button>

                <button 
                    onClick={() => setSelectedCompany('ESCALADE_RIDE')}
                    className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
                >
                    <div className="text-4xl mb-4">🚘</div>
                    <h2 className="text-xl font-bold text-gray-900">Escalade Ride Inc.</h2>
                    <p className="text-gray-500 text-sm mt-2 text-center">Limo & Transportation</p>
                </button>
            </div>
          </div>
        ) : (
          <InvoiceForm 
            selectedCompany={selectedCompany} 
            onBack={() => setSelectedCompany(null)} 
          />
        )}
      </main>
    </div>
  );
}