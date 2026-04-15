
// test_visibility.ts
const products = [
  {
    id: 'test-flacon-1',
    name_fr: 'Test Flacon No Variants',
    product_type: 'flacon',
    status: 'active',
    base_price: 1500,
    images: [],
    variants: [] // No variants
  },
  {
    id: 'test-flacon-2',
    name_fr: 'Test Flacon With Variants',
    product_type: 'flacon',
    status: 'active',
    base_price: 2000,
    images: [],
    variants: [
      { size_ml: 50, price: 2500, stock_units: 10, is_available: true }
    ]
  }
];

const selectedSize = 'all';
const selectedColor = 'all';
const selectedShape = 'all';
const maxPrice = 10000;

function filterProducts(products) {
  return products.filter(p => {
    // Simulation of the new logic in FlaconsClient.tsx
    if (!p.variants || p.variants.length === 0) {
      const genericPriceMatch = (p.base_price || 0) <= maxPrice;
      const noSpecificFilters = selectedSize === 'all' && selectedColor === 'all' && selectedShape === 'all';
      return genericPriceMatch && noSpecificFilters;
    }

    return p.variants.some(v => {
      const sizeMatch = selectedSize === 'all' || `${v.size_ml}ml` === selectedSize;
      const colorMatch = selectedColor === 'all' || v.color_name === selectedColor; // color_name missing in test data but handled
      const shapeMatch = selectedShape === 'all' || v.shape === selectedShape;
      const priceMatch = v.price <= maxPrice;
      return sizeMatch && colorMatch && shapeMatch && priceMatch;
    });
  });
}

const filtered = filterProducts(products);
console.log('Filtered products:', filtered.map(p => p.name_fr));

if (filtered.length === 2) {
  console.log('SUCCESS: Both flacons are visible!');
} else {
  console.log('FAILURE: Only ' + filtered.length + ' flacons are visible.');
}
