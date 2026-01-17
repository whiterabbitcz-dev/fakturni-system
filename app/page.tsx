'use client';

import React, { useState } from 'react';
import { parseExcelFile } from '@/utils/excelParser';
import { Faktura, Klient, FakturaData } from '@/types/invoice';
import { generateSPAYD, calculateDueDate, generateInvoiceNumber } from '@/utils/spayd';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/InvoicePDF';
import QRCode from 'qrcode';
import JSZip from 'jszip';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [faktury, setFaktury] = useState<Faktura[]>([]);
  const [klienti, setKlienti] = useState<Klient[]>([]);
  const [startNumber, setStartNumber] = useState<string>('20250001');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    setSuccess('');

    try {
      const { faktury: parsedFaktury, klienti: parsedKlienti } = await parseExcelFile(selectedFile);
      setFaktury(parsedFaktury);
      setKlienti(parsedKlienti);
      setSuccess(`Načteno ${parsedFaktury.length} faktur a ${parsedKlienti.length} klientů`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při načítání souboru');
      setFile(null);
    }
  };

  const generateQRCode = async (spaydString: string): Promise<string> => {
    try {
      const qrDataUrl = await QRCode.toDataURL(spaydString, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: 'M',
      });
      return qrDataUrl;
    } catch (err) {
      console.error('Chyba při generování QR kódu:', err);
      throw err;
    }
  };

  const handleGeneratePDFs = async () => {
    if (faktury.length === 0) {
      setError('Nejprve nahrajte Excel soubor');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const startNum = parseInt(startNumber);
      if (isNaN(startNum)) {
        throw new Error('Neplatné startovní číslo faktury');
      }

      const zip = new JSZip();

      // Generování PDF pro každou fakturu
      for (let i = 0; i < faktury.length; i++) {
        const faktura = faktury[i];
        const klient = klienti.find(k => k.nazevKlienta === faktura.nazevKlienta);

        if (!klient) {
          console.warn(`Klient ${faktura.nazevKlienta} nebyl nalezen`);
          continue;
        }

        const cisloFaktury = generateInvoiceNumber(startNum, i);
        const datumSplatnosti = calculateDueDate(faktura.datumVystaveni, 14);
        const castkaSDPH = faktura.castkaBezDPH * 1.21;

        const fakturaData: FakturaData = {
          ...faktura,
          klient,
          cisloFaktury,
          datumSplatnosti,
          sazba: 21,
          castkaSDPH,
        };

        // Generování SPAYD řetězce
        const spaydString = generateSPAYD({
          accountNumber: '4412939389/0800',
          amount: castkaSDPH,
          currency: 'CZK',
          message: cisloFaktury,
          variableSymbol: cisloFaktury,
          dueDate: datumSplatnosti,
        });

        // Generování QR kódu
        const qrCodeDataUrl = await generateQRCode(spaydString);

        // Generování PDF
        const pdfDocument = <InvoicePDF fakturaData={fakturaData} qrCodeDataUrl={qrCodeDataUrl} />;
        const blob = await pdf(pdfDocument).toBlob();

        // Přidání do ZIP
        const fileName = `Faktura_${cisloFaktury}_${klient.nazevKlienta.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        zip.file(fileName, blob);

        setSuccess(`Generování faktury ${i + 1}/${faktury.length}...`);
      }

      // Stažení ZIP souboru
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Faktury_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`✅ Úspěšně vygenerováno ${faktury.length} faktur!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při generování PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Hlavička */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Generátor Faktur
            </h1>
            <p className="text-gray-600">
              Nahrajte Excel soubor a vygenerujte faktury ve formátu PDF
            </p>
          </div>

          {/* Upload sekce */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excel soubor (.xlsx)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Klikněte pro nahrání</span> nebo přetáhněte soubor
                  </p>
                  <p className="text-xs text-gray-500">Excel soubor (.xlsx)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                📄 Vybraný soubor: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* Startovní číslo faktury */}
          {faktury.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Startovní číslo faktury
              </label>
              <input
                type="text"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="např. 20250001"
                disabled={isProcessing}
              />
              <p className="mt-2 text-xs text-gray-500">
                Formát: RRRRCCCC (Rok + 4 číslice)
              </p>
            </div>
          )}

          {/* Tlačítko generování */}
          {faktury.length > 0 && (
            <button
              onClick={handleGeneratePDFs}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generuji faktury...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Vygenerovat PDF faktury
                </>
              )}
            </button>
          )}

          {/* Zprávy */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">❌ {error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Informace o struktuře */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Požadovaná struktura Excel souboru:</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700">List "Faktury":</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Datum vystavení</li>
                  <li>Datum zdanitelného plnění</li>
                  <li>Název klienta</li>
                  <li>Předmět faktury</li>
                  <li>Číslo objednávky</li>
                  <li>Částka bez DPH</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700">List "Klienti":</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Název klienta</li>
                  <li>Ulice a číslo</li>
                  <li>Město a PSČ</li>
                  <li>IČO</li>
                  <li>DIČ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Patička */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 ML PROPERTY s.r.o. | Generátor faktur</p>
        </div>
      </div>
    </div>
  );
}
