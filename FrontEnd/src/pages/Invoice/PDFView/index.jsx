import { PDFViewer } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';

import { InvoicePDF } from '../../../components';



export default function InvoicePDFView() {
  const [invoice, setInvoice] = useState(null);



  useEffect(() => {
    const newInvoice = sessionStorage.getItem('invoicePDFView');
    setInvoice(JSON.parse(newInvoice));
  }, []);



  if (!invoice) return (
    <div className='mt-16 text-2xl text-center'>Sedang memuat faktur, mohon tunggu ...</div>
  );

  return (
    <PDFViewer className='h-full w-full'>
      {invoice && <InvoicePDF invoice={invoice} />}
    </PDFViewer>
  );
};
