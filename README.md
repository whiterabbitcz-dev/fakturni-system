# Fakturní Systém

Webová aplikace pro automatické generování faktur ve formátu PDF z Excel souboru.

## 🚀 Funkce

- ✅ Nahrání Excel souboru (.xlsx) se dvěma listy: "Faktury" a "Klienti"
- ✅ Automatické párování faktur s klienty podle názvu
- ✅ Nastavitelné startovní číslo faktury
- ✅ Automatická inkrement číslování faktur (formát: RRRRCCCC)
- ✅ Generování PDF faktur dle vzoru
- ✅ QR kód s SPAYD formátem pro platby
- ✅ Export všech faktur v ZIP souboru
- ✅ Moderní a responzivní uživatelské rozhraní

## 📋 Požadovaná struktura Excel souboru

### List "Faktury"
Sloupce:
- Datum vystavení
- Datum zdanitelného plnění
- Název klienta
- Předmět faktury
- Číslo objednávky
- Částka bez DPH

### List "Klienti"
Sloupce:
- Název klienta
- Ulice a číslo
- Město a PSČ
- IČO
- DIČ

## 🛠️ Instalace a spuštění

### Požadavky
- Node.js 18+ a npm

### Postup instalace

1. **Klonujte repozitář:**
```bash
git clone <URL_REPOSITARE>
cd fakturni-system
```

2. **Nainstalujte závislosti:**
```bash
npm install
```

3. **Spusťte vývojový server:**
```bash
npm run dev
```

4. **Otevřete aplikaci v prohlížeči:**
```
http://localhost:3000
```

## 📖 Použití

1. Nahrajte Excel soubor (.xlsx) s listy "Faktury" a "Klienti"
2. Po úspěšném načtení zadejte startovní číslo faktury (např. 20250001)
3. Klikněte na tlačítko "Vygenerovat PDF faktury"
4. Stáhněte ZIP soubor se všemi vygenerovanými fakturami

## 🏢 Informace o dodavateli

**ML PROPERTY s.r.o.**
- Adresa: Šmeralova 360/30, 170 00 Praha 7
- IČO: 05569818
- DIČ: CZ05569818
- Bankovní účet: 4412939389/0800

## 🔧 Technologie

- **Next.js 16** - React framework
- **TypeScript** - Typová bezpečnost
- **Tailwind CSS** - Styling
- **@react-pdf/renderer** - Generování PDF
- **xlsx** - Parsování Excel souborů
- **qrcode** - Generování QR kódů
- **jszip** - Tvorba ZIP archivů

## 📦 Build pro produkci

```bash
npm run build
npm start
```

## 📝 Licence

© 2025 ML PROPERTY s.r.o.
