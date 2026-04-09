/**
 * Centralized translation helper for Amouris B2B platform
 * Handles French and Arabic (RTL) labels for all system statuses.
 */

export function getStatusLabel(status: string | undefined, locale: string = 'fr'): string {
  if (!status) return '';
  const normStatus = status.toLowerCase();
  
  if (locale === 'ar') {
    switch (normStatus) {
      case 'pending': return 'في الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'preparing': return 'قيد التحضير';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'ملغى';
      case 'active': return 'نشط';
      case 'draft': return 'مسودة';
      case 'perfume': return 'عطر';
      case 'flacon': return 'قارورة';
      default: return status;
    }
  } else {
    switch (normStatus) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'preparing': return 'En préparation';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'perfume': return 'Parfum';
      case 'flacon': return 'Flacon';
      default: return status;
    }
  }
}

export function getPaymentStatusLabel(status: string | undefined, locale: string = 'fr'): string {
  if (!status) return '';
  const normStatus = status.toLowerCase();
  
  if (locale === 'ar') {
    switch (normStatus) {
      case 'paid': return 'مدفوع';
      case 'partial': return 'جزئي';
      case 'unpaid': return 'غير مدفوع';
      case 'pending': return 'في الانتظار';
      default: return status;
    }
  } else {
    switch (normStatus) {
      case 'paid': return 'Payé';
      case 'partial': return 'Partie';
      case 'unpaid': return 'Non payé';
      case 'pending': return 'En attente';
      default: return status;
    }
  }
}

export function getPaymentMethodLabel(method: string | undefined, locale: string = 'fr'): string {
  if (!method) return locale === 'ar' ? 'غير محدد' : 'Non défini';
  const norm = method.toLowerCase();
  
  if (locale === 'ar') {
    switch (norm) {
      case 'cash': return 'نقداً';
      case 'transfer': return 'تحويل بنكي';
      case 'check': return 'شيك';
      case 'baridi_mob': return 'بريدي موب';
      default: return method;
    }
  } else {
    switch (norm) {
      case 'cash': return 'Espèces';
      case 'transfer': return 'Virement';
      case 'check': return 'Chèque';
      case 'baridi_mob': return 'BaridiMob';
      default: return method;
    }
  }
}

/**
 * Helper to get the translated name based on locale
 */
export function getTranslatedName(obj: { name_fr: string; name_ar: string } | undefined, locale: string): string {
  if (!obj) return '';
  return locale === 'ar' ? obj.name_ar : obj.name_fr;
}
