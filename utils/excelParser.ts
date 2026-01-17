import * as XLSX from 'xlsx';
import { Faktura, Klient } from '@/types/invoice';

export function parseExcelFile(file: File): Promise<{
  faktury: Faktura[];
  klienti: Klient[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Načtení listu "Faktury"
        const fakturySheet = workbook.Sheets['Faktury'];
        if (!fakturySheet) {
          throw new Error('List "Faktury" nebyl nalezen');
        }
        
        const fakturyRaw = XLSX.utils.sheet_to_json<any>(fakturySheet);
        const faktury: Faktura[] = fakturyRaw.map((row) => ({
          datumVystaveni: formatExcelDate(row['Datum vystavení']),
          duzp: formatExcelDate(row['Datum zdanitelného plnění']),
          nazevKlienta: row['Název klienta'] || '',
          predmetFaktury: row['Předmět faktury'] || '',
          cisloObjednavky: row['Číslo objednávky']?.toString() || '',
          castkaBezDPH: parseFloat(row['Částka bez DPH']) || 0,
        }));
        
        // Načtení listu "Klienti"
        const klientiSheet = workbook.Sheets['Klienti'];
        if (!klientiSheet) {
          throw new Error('List "Klienti" nebyl nalezen');
        }
        
        const klientiRaw = XLSX.utils.sheet_to_json<any>(klientiSheet);
        const klienti: Klient[] = klientiRaw.map((row) => ({
          nazevKlienta: row['Název klienta'] || '',
          uliceACislo: row['Ulice a číslo'] || '',
          mestoAPSC: row['Město a PSČ'] || '',
          ico: row['IČO']?.toString() || '',
          dic: row['DIČ']?.toString() || '',
        }));
        
        resolve({ faktury, klienti });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Chyba při čtení souboru'));
    };
    
    reader.readAsBinaryString(file);
  });
}

function formatExcelDate(value: any): string {
  if (!value) return '';
  
  // Pokud je to string, vrátíme rovnou
  if (typeof value === 'string') {
    return value;
  }
  
  // Pokud je to Excel serial date
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    return `${String(date.d).padStart(2, '0')}.${String(date.m).padStart(2, '0')}.${date.y}`;
  }
  
  return String(value);
}
