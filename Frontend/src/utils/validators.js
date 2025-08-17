
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function calcPasswordStrength(pw = "") {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  // clamp 0..4 for UI
  return Math.min(score, 4);
}
