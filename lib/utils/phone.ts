export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\.\+\(\)]/g, '').trim()
}

export function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}@amouris-user.dz`
}
