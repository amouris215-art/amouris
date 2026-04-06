/**
 * Converts a number into its Arabic words representation.
 * Tailored for Algerian Dinar (DZD).
 */
export function numberToArabicWords(n: number): string {
  if (n === 0) return 'صفر دينار جزائري';
  
  const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  
  function convertGroup(num: number): string {
    let res = '';
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const u = num % 10;
    
    if (h > 0) res += hundreds[h] + ' ';
    
    if (t === 0) {
      if (u > 0) res += (h > 0 ? 'و ' : '') + units[u];
    } else if (t === 1) {
      res += (h > 0 ? 'و ' : '') + teens[u];
    } else {
      if (u > 0) res += (h > 0 ? 'و ' : '') + units[u] + ' و ' + tens[t];
      else res += (h > 0 ? 'و ' : '') + tens[t];
    }
    return res.trim();
  }
  
  let result = '';
  const millions = Math.floor(n / 1000000);
  const thousands = Math.floor((n % 1000000) / 1000);
  const remainder = Math.floor(n % 1000);
  
  if (millions > 0) {
    if (millions === 1) result += 'مليون ';
    else if (millions === 2) result += 'مليونان ';
    else result += convertGroup(millions) + ' ملايين ';
  }
  
  if (thousands > 0) {
    if (result) result += 'و ';
    if (thousands === 1) result += 'ألف ';
    else if (thousands === 2) result += 'ألفان ';
    else if (thousands >= 3 && thousands <= 10) result += units[thousands] + ' آلاف ';
    else result += convertGroup(thousands) + ' ألف ';
  }
  
  if (remainder > 0) {
    if (result) result += 'و ';
    result += convertGroup(remainder);
  }
  
  return result.trim() + ' دينار جزائري';
}
