export function generateSPAYD(params: {
  accountNumber: string;
  amount: number;
  currency: string;
  message: string;
  variableSymbol: string;
  dueDate: string; // ve formátu DD.MM.YYYY
}): string {
  const { accountNumber, amount, currency, message, variableSymbol, dueDate } = params;
  
  // Převod data z DD.MM.YYYY na YYYYMMDD
  const [day, month, year] = dueDate.split('.');
  const formattedDate = `${year}${month}${day}`;
  
  // Formát částky - bez mezer, na 2 desetinná místa
  const formattedAmount = amount.toFixed(2);
  
  // SPAYD formát pro české platby
  const spayd = `SPD*1.0*ACC:${accountNumber}*AM:${formattedAmount}*CC:${currency}*MSG:${message}*X-VS:${variableSymbol}*DT:${formattedDate}`;
  
  return spayd;
}

export function calculateDueDate(dateString: string, daysToAdd: number = 14): string {
  // Převod z DD.MM.YYYY na Date
  const [day, month, year] = dateString.split('.').map(Number);
  const date = new Date(year, month - 1, day);
  
  // Přidání dnů
  date.setDate(date.getDate() + daysToAdd);
  
  // Formátování zpět na DD.MM.YYYY
  const newDay = String(date.getDate()).padStart(2, '0');
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newYear = date.getFullYear();
  
  return `${newDay}.${newMonth}.${newYear}`;
}

export function generateInvoiceNumber(startNumber: number, index: number): string {
  const year = new Date().getFullYear();
  const sequence = startNumber + index;
  const paddedSequence = String(sequence).padStart(8, '0');
  
  return paddedSequence;
}
