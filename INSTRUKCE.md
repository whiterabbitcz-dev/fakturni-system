# 📘 Instrukce pro nastavení a spuštění aplikace

## ✅ Krok 1: Vytvoření GitHub repozitáře

### Možnost A: Pomocí webového rozhraní GitHub

1. Přejděte na https://github.com/new
2. Zadejte název repozitáře: **fakturni-system**
3. Ponechte repozitář **Private** nebo **Public** dle vašeho výběru
4. **NEPŘIDÁVEJTE** README, .gitignore ani licenci (už je v projektu)
5. Klikněte na **"Create repository"**

6. Po vytvoření repozitáře zkopírujte URL (např. `https://github.com/vasejmeno/fakturni-system.git`)

7. Spusťte v terminálu:
```bash
cd "/Users/martinsvoboda/Desktop/wr faktury/fakturni-system"
git remote add origin https://github.com/VASEJMENO/fakturni-system.git
git branch -M main
git push -u origin main
```

### Možnost B: Pomocí GitHub CLI (pokud máte nainstalované)

```bash
cd "/Users/martinsvoboda/Desktop/wr faktury/fakturni-system"
gh repo create fakturni-system --private --source=. --remote=origin --push
```

---

## 🚀 Krok 2: Spuštění aplikace lokálně

```bash
cd "/Users/martinsvoboda/Desktop/wr faktury/fakturni-system"
npm run dev
```

Aplikace bude dostupná na: **http://localhost:3000**

---

## 📖 Krok 3: Jak používat aplikaci

1. **Otevřete prohlížeč** a přejděte na http://localhost:3000

2. **Nahrajte Excel soubor** (.xlsx) s těmito listy:
   - **List "Faktury"** - obsahuje transakce
   - **List "Klienti"** - obsahuje informace o odběratelích

3. **Zadejte startovní číslo faktury** (např. 20250001)

4. **Klikněte na "Vygenerovat PDF faktury"**

5. **Stáhne se ZIP soubor** se všemi vygenerovanými fakturami

---

## 📊 Struktura Excel souboru

### List "Faktury"
| Datum vystavení | Datum zdanitelného plnění | Název klienta | Předmět faktury | Číslo objednávky | Částka bez DPH |
|----------------|---------------------------|---------------|-----------------|------------------|----------------|
| 02.01.2025     | 31.12.2024                | KMV BEV CZ s.r.o. | Fakturujeme vám... | 2100021424 | 36800 |

### List "Klienti"
| Název klienta | Ulice a číslo | Město a PSČ | IČO | DIČ |
|---------------|---------------|-------------|-----|-----|
| KMV BEV CZ s.r.o. | Kolbenova 510/50 | 190 00 Praha - Vysočany | 06495079 | CZ06495079 |

---

## 🎨 Příklady použití

### Generování faktur pro leden 2025
- Startovní číslo: **20250001**
- Výsledek: Faktury budou číslovány 20250001, 20250002, 20250003...

### Generování faktur pro únor 2025
- Startovní číslo: **20250100**
- Výsledek: Faktury budou číslovány 20250100, 20250101, 20250102...

---

## 🔧 Řešení problémů

### Aplikace nefunguje po `npm run dev`
```bash
# Zkuste reinstalovat závislosti
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Excel soubor se nenačítá správně
- Zkontrolujte, že listy mají přesně názvy: **"Faktury"** a **"Klienti"**
- Zkontrolujte, že sloupce mají správné názvy
- Ujistěte se, že data začínají na řádku 2 (řádek 1 jsou hlavičky)

### PDF se negenerují
- Zkontrolujte, že názvy klientů v listu "Faktury" přesně odpovídají názvům v listu "Klienti"
- Zkontrolujte, že částky jsou čísla (ne text)

---

## 📞 Kontakt

Pro dotazy nebo problémy kontaktujte vývojáře.

**Aplikaci vytvořil:** AI asistent s využitím Next.js, TypeScript, Tailwind CSS
**Datum vytvoření:** 2025-01-17
