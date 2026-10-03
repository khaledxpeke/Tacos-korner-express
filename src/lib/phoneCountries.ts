export type PhoneCountry = {
  iso: string;
  name: string;
  dial: string;
  min: number;
  max: number;
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: "TN", name: "Tunisie", dial: "216", min: 8, max: 8 },
  { iso: "FR", name: "France", dial: "33", min: 9, max: 9 },
  { iso: "DZ", name: "Algérie", dial: "213", min: 9, max: 9 },
  { iso: "MA", name: "Maroc", dial: "212", min: 9, max: 9 },
  { iso: "LY", name: "Libye", dial: "218", min: 9, max: 9 },
  { iso: "EG", name: "Égypte", dial: "20", min: 10, max: 10 },
  { iso: "SN", name: "Sénégal", dial: "221", min: 9, max: 9 },
  { iso: "CI", name: "Côte d'Ivoire", dial: "225", min: 10, max: 10 },
  { iso: "BE", name: "Belgique", dial: "32", min: 8, max: 9 },
  { iso: "CH", name: "Suisse", dial: "41", min: 9, max: 9 },
  { iso: "LU", name: "Luxembourg", dial: "352", min: 9, max: 9 },
  { iso: "ES", name: "Espagne", dial: "34", min: 9, max: 9 },
  { iso: "IT", name: "Italie", dial: "39", min: 9, max: 10 },
  { iso: "DE", name: "Allemagne", dial: "49", min: 10, max: 11 },
  { iso: "GB", name: "Royaume-Uni", dial: "44", min: 10, max: 10 },
  { iso: "PT", name: "Portugal", dial: "351", min: 9, max: 9 },
  { iso: "NL", name: "Pays-Bas", dial: "31", min: 9, max: 9 },
  { iso: "TR", name: "Turquie", dial: "90", min: 10, max: 10 },
  { iso: "SA", name: "Arabie saoudite", dial: "966", min: 9, max: 9 },
  { iso: "AE", name: "Émirats arabes unis", dial: "971", min: 9, max: 9 },
  { iso: "QA", name: "Qatar", dial: "974", min: 8, max: 8 },
  { iso: "US", name: "États-Unis / Canada", dial: "1", min: 10, max: 10 },
];

export function phoneLengthLabel(country: PhoneCountry) {
  return country.min === country.max
    ? `${country.min} chiffres`
    : `${country.min} à ${country.max} chiffres`;
}
