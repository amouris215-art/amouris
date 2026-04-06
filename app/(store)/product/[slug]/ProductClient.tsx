"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useI18n } from '@/i18n/i18n-context';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product, FlaconVariant, Brand, Category } from '@/lib/types';

interface ProductClientProps {
  product: Product;
  brand?: Brand;
  category?: Category;
}

export default function ProductClient({ product, brand, category }: ProductClientProps) {
  const { t, language } = useI18n();
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [grams, setGrams] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<FlaconVariant | null>(
    product.type === 'flacon' && product.variants.length > 0 ? product.variants[0] : null
  );

  const name = language === 'ar' ? product.nameAR : product.nameFR;
  const description = language === 'ar' ? product.descriptionAR : product.descriptionFR;

  const handleAddToCart = () => {
    if (product.type === 'perfume') {
      const stock = (product as any).stockInGrams || 0;
      if (grams > stock) {
        toast.error(language === 'ar' ? 'الكمية المطلوبة تتجاوز المخزون' : 'La quantité demandée dépasse le stock');
        return;
      }
      addItem({
        productId: product.id,
        quantity: grams,
        unitPrice: product.pricePerGram,
        productNameAR: product.nameAR,
        productNameFR: product.nameFR,
        nameAR: product.nameAR,
        nameFR: product.nameFR,
        image: product.images[0],
      });
      toast.success(language === 'ar' ? 'تمت الإضافة إلى السلة' : 'Ajouté au panier');
    } else if (product.type === 'flacon' && selectedVariant) {
      if (quantity > (selectedVariant.stock || 0)) {
        toast.error(language === 'ar' ? 'الكمية المطلوبة تتجاوز المخزون' : 'La quantité demandée dépasse le stock');
        return;
      }
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: quantity,
        unitPrice: selectedVariant.price,
        productNameAR: product.nameAR,
        productNameFR: product.nameFR,
        nameAR: product.nameAR,
        nameFR: product.nameFR,
        image: product.images[0],
        variantDescriptionLabel: `${selectedVariant.size} - ${selectedVariant.color} - ${selectedVariant.shape}`
      });
      toast.success(language === 'ar' ? 'تمت الإضافة إلى السلة' : 'Ajouté au panier');
    }
  };

  const totalPrice = product.type === 'perfume' 
    ? grams * product.pricePerGram
    : (selectedVariant?.price || 0) * quantity;

  const isPerfumeOutOfStock = product.type === 'perfume' && ((product as any).stockInGrams || 0) <= 0;
  const isVariantOutOfStock = product.type === 'flacon' && (selectedVariant?.stock || 0) <= 0;
  const isCurrentlyUnavailable = isPerfumeOutOfStock || isVariantOutOfStock;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Gallery */}
        <div className="w-full md:w-1/2 md:sticky md:top-24 h-fit space-y-4">
          <div className="relative aspect-square bg-muted rounded-xl border overflow-hidden">
            <Image 
              src={selectedImage} 
              alt={name} 
              fill 
              className={`object-cover ${isCurrentlyUnavailable ? 'grayscale-[0.5]' : ''}`}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-md border-2 overflow-hidden shrink-0 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col font-body">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
            {brand && <span>{language === 'ar' ? brand.nameAR : brand.nameFR}</span>}
            {brand && category && <span>•</span>}
            {category && <span>{language === 'ar' ? category.nameAR : category.nameFR}</span>}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">{name}</h1>
          
          <div className="text-2xl font-bold text-primary mb-6 flex items-center gap-4">
             {totalPrice.toLocaleString()} {t('common.currency')}
             <span className="text-sm text-muted-foreground font-normal">
               {product.type === 'perfume' 
                 ? `(${product.pricePerGram} ${t('common.currency')} / 1g)` 
                 : ''}
             </span>
             {isCurrentlyUnavailable && (
               <span className="text-sm font-bold text-destructive uppercase bg-destructive/10 px-3 py-1 rounded-full">
                 {language === 'ar' ? 'نفذت الكمية' : 'En rupture'}
               </span>
             )}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-primary/20 pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pr-6">
            {description}
          </p>

          <div className="bg-secondary/40 p-6 rounded-xl border border-primary/10 mb-8 flex flex-col gap-6 shadow-sm">
            {product.type === 'perfume' ? (
              <div className="space-y-4">
                <label className="font-bold flex justify-between">
                  <span>{t('product.quantity')} ({t('product.grams')})</span>
                  <span className="text-primary">{((product as any).stockInGrams || 0).toLocaleString()}g dispo.</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex border rounded-md bg-background shadow-inner">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setGrams(Math.max(100, grams - 50))}
                      disabled={grams <= 100 || isPerfumeOutOfStock}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={grams} 
                      onChange={(e) => setGrams(Math.max(100, Math.min((product as any).stockInGrams || 100, parseInt(e.target.value) || 100)))}
                      className="w-24 border-0 text-center font-bold focus-visible:ring-0"
                      min={100}
                      disabled={isPerfumeOutOfStock}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setGrams(Math.min((product as any).stockInGrams || 100, grams + 50))}
                      disabled={isPerfumeOutOfStock || grams >= ((product as any).stockInGrams || 0)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground uppercase font-medium">
                    {t('product.min_order')}: 100g
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="font-bold">Variantes disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <Button
                        key={v.id}
                        variant={selectedVariant?.id === v.id ? 'default' : 'outline'}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex-col items-start h-auto p-3 transition-all ${v.stock === 0 ? 'opacity-50 line-through' : ''}`}
                      >
                       <span className="font-bold">{v.size} - {v.color}</span>
                       <span className="text-[10px] uppercase opacity-80">{v.shape}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="font-bold flex justify-between">
                    <span>{t('product.quantity')}</span>
                    <span className="text-primary">{(selectedVariant?.stock || 0)} en stock</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex border rounded-md bg-background shadow-inner">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isVariantOutOfStock}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, Math.min(selectedVariant?.stock || 1, parseInt(e.target.value) || 1)))}
                        className="w-16 border-0 text-center font-bold focus-visible:ring-0"
                        min={1}
                        disabled={isVariantOutOfStock}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                        disabled={isVariantOutOfStock || quantity >= (selectedVariant?.stock || 0)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button 
              size="lg" 
              className={`w-full text-lg h-14 font-bold shadow-luxury ${isCurrentlyUnavailable ? 'bg-muted-foreground' : ''}`} 
              onClick={handleAddToCart}
              disabled={isCurrentlyUnavailable}
            >
              <ShoppingBag className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
              {isCurrentlyUnavailable 
                ? (language === 'ar' ? 'نفذت الكمية' : 'Indisponible')
                : t('product.add_to_cart')
              }
            </Button>
          </div>

          <div className="pt-6 border-t space-y-4">
             <h3 className="font-bold">{t('product.details')}</h3>
             <ul className="list-disc list-inside text-muted-foreground space-y-2">
               <li>{language === 'ar' ? 'شحن سريع وموثوق' : 'Expédition rapide et fiable'}</li>
               <li>{language === 'ar' ? 'ضمان الجودة 100%' : 'Garantie de qualité 100%'}</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
