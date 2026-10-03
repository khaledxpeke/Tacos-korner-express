export const loyaltyPasswordRules = [
  { label: "8 caractères minimum", test: (password: string) => password.length >= 8 },
  { label: "Une majuscule", test: (password: string) => /\p{Lu}/u.test(password) },
  { label: "Un chiffre", test: (password: string) => /\d/.test(password) },
  { label: "Un caractère spécial", test: (password: string) => /[^\p{L}\p{N}]/u.test(password) },
];

export function isLoyaltyPasswordStrong(password: string) {
  return loyaltyPasswordRules.every((rule) => rule.test(password));
}

export const loyaltyPasswordError =
  "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.";
