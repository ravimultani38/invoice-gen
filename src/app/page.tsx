import InvoiceForm from '@/components/InvoiceForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 my-8">
          Invoice Generator
        </h1>
        <InvoiceForm />
      </main>
    </div>
  );
}