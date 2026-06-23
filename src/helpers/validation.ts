// Shared registration validation used by both the API route (authoritative)
// and the form (instant feedback), so the rules never drift between them.

// Pragmatic email shape: something@something.tld with no spaces.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NAME_MIN = 2;
export const NAME_MAX = 60;
export const PASSWORD_MIN = 8;

// Returns an error message for the field, or null when it is valid.
export function validateName(name: string): string | null {
  const value = name.trim();
  if (value.length < NAME_MIN) return `El nombre debe tener al menos ${NAME_MIN} caracteres.`;
  if (value.length > NAME_MAX) return `El nombre no puede superar los ${NAME_MAX} caracteres.`;
  return null;
}

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!EMAIL_REGEX.test(value)) return "El correo electrónico no tiene un formato válido.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
  }
  // Require at least one letter and one number for a basic strength floor.
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "La contraseña debe incluir al menos una letra y un número.";
  }
  return null;
}

// Validates the whole registration payload at once.
// Returns the first error found, or null when everything is valid.
export function validateRegistration(input: {
  name: string;
  email: string;
  password: string;
}): string | null {
  return (
    validateName(input.name) ??
    validateEmail(input.email) ??
    validatePassword(input.password)
  );
}
