export const loyaltyPasswordRules = [
  {
    label: "8 caractères minimum",
    message: "Au moins 8 caractères.",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "Une majuscule",
    message: "Ajoutez une majuscule.",
    test: (password: string) => /\p{Lu}/u.test(password),
  },
  {
    label: "Un chiffre",
    message: "Ajoutez un chiffre.",
    test: (password: string) => /\d/.test(password),
  },
  {
    label: "Un caractère spécial",
    message: "Ajoutez un caractère spécial.",
    test: (password: string) => /[^\p{L}\p{N}]/u.test(password),
  },
];

export function isLoyaltyPasswordStrong(password: string) {
  return loyaltyPasswordRules.every((rule) => rule.test(password));
}
