export function getOrderStatusLabel(status: string, locale: string = 'fr'): string {
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

export function getPaymentStatusLabel(status: string, locale: string = 'fr'): string {
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
      case 'partial': return 'Partiel';
      case 'unpaid': return 'Non payé';
      case 'pending': return 'En attente';
      default: return status;
    }
  }
}
