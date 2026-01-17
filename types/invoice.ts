export interface Faktura {
  datumVystaveni: string;
  duzp: string;
  nazevKlienta: string;
  predmetFaktury: string;
  cisloObjednavky: string;
  castkaBezDPH: number;
}

export interface Klient {
  nazevKlienta: string;
  uliceACislo: string;
  mestoAPSC: string;
  ico: string;
  dic: string;
}

export interface FakturaData extends Faktura {
  klient?: Klient;
  cisloFaktury: string;
  datumSplatnosti: string;
  sazba: number;
  castkaSDPH: number;
}
