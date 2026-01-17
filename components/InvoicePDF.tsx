import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { FakturaData } from '@/types/invoice';

// Styles pro PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: '#666',
    marginBottom: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  column: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 9,
    color: '#666',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  companyName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  textSmall: {
    fontSize: 9,
    marginBottom: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 10,
    width: 120,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableColDescription: {
    flex: 3,
    fontSize: 9,
  },
  tableColDPH: {
    flex: 1,
    fontSize: 9,
    textAlign: 'center',
  },
  tableColBase: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right',
  },
  tableColAmount: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right',
  },
  summarySection: {
    marginTop: 10,
    marginLeft: 'auto',
    width: 250,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  summaryLabel: {
    fontSize: 10,
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f5f5f5',
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  qrSection: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  qrLabel: {
    fontSize: 8,
    color: '#666',
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
});

interface InvoicePDFProps {
  fakturaData: FakturaData;
  qrCodeDataUrl: string;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ fakturaData, qrCodeDataUrl }) => {
  const { klient } = fakturaData;
  
  const sazba = 21; // 21% DPH
  const zaklad = fakturaData.castkaBezDPH;
  const dph = zaklad * (sazba / 100);
  const celkem = zaklad + dph;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Hlavička */}
        <View style={styles.header}>
          <Text style={styles.title}>Faktura {fakturaData.cisloFaktury}</Text>
          <Text style={styles.subtitle}>DAŇOVÝ DOKLAD</Text>
        </View>
        
        <View style={styles.separator} />
        
        {/* Dodavatel a Odběratel */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>DODAVATEL</Text>
            <Text style={styles.companyName}>ML PROPERTY s.r.o.</Text>
            <Text style={styles.text}>Šmeralova 360/30</Text>
            <Text style={styles.text}>170 00 Praha 7</Text>
            <Text style={{ ...styles.text, marginTop: 10 }}>IČO: 05569818</Text>
            <Text style={styles.text}>DIČ: CZ05569818</Text>
            <Text style={{ ...styles.text, marginTop: 10 }}>Bankovní účet: 4412939389/0800</Text>
            <Text style={styles.text}>Variabilní symbol: 20240238</Text>
            <Text style={styles.text}>Způsob platby: Převodem</Text>
          </View>
          
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>ODBĚRATEL</Text>
            {klient && (
              <>
                <Text style={styles.companyName}>{klient.nazevKlienta}</Text>
                <Text style={styles.text}>{klient.uliceACislo}</Text>
                <Text style={styles.text}>{klient.mestoAPSC}</Text>
                <Text style={{ ...styles.text, marginTop: 10 }}>IČO: {klient.ico}</Text>
                <Text style={styles.text}>DIČ: {klient.dic}</Text>
              </>
            )}
            
            <View style={{ marginTop: 15 }}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Datum vystavení</Text>
                <Text style={styles.infoValue}>{fakturaData.datumVystaveni}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Datum splatnosti</Text>
                <Text style={styles.infoValue}>{fakturaData.datumSplatnosti}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Datum zdan. plnění</Text>
                <Text style={styles.infoValue}>{fakturaData.duzp}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Tabulka položek */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableColDescription}>Popis</Text>
            <Text style={styles.tableColDPH}>DPH</Text>
            <Text style={styles.tableColBase}>CENA</Text>
            <Text style={styles.tableColAmount}>CELKEM S DPH</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableColDescription}>
              {fakturaData.predmetFaktury}. Podle objednávky č.: {fakturaData.cisloObjednavky}
            </Text>
            <Text style={styles.tableColDPH}>{sazba} %</Text>
            <Text style={styles.tableColBase}>{zaklad.toFixed(2).replace('.', ',')} Kč</Text>
            <Text style={styles.tableColAmount}>{celkem.toFixed(2).replace('.', ',')} Kč</Text>
          </View>
        </View>
        
        {/* Souhrn */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>SAZBA</Text>
            <Text style={styles.summaryValue}>{sazba} %</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ZÁKLAD</Text>
            <Text style={styles.summaryValue}>{zaklad.toFixed(2).replace('.', ',')} Kč</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>DPH</Text>
            <Text style={styles.summaryValue}>{dph.toFixed(2).replace('.', ',')} Kč</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Celkem k úhradě</Text>
            <Text style={styles.totalValue}>{celkem.toFixed(2).replace('.', ',')} Kč</Text>
          </View>
        </View>
        
        {/* QR Kód */}
        <View style={styles.qrSection}>
          <View>
            <Image src={qrCodeDataUrl} style={styles.qrCode} />
            <Text style={styles.qrLabel}>QR Platba</Text>
          </View>
        </View>
        
        {/* Patička */}
        <View style={styles.footer}>
          <Text>
            Společnost je zapsána v obchodním rejstříku vedeném Městským soudem v Praze oddíl C, vložka 265452.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
