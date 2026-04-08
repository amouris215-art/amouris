export function BrandsMarquee({ brands }: { brands: any[] }) {
  return (
    <div className="py-12 bg-white border-y border-gray-100 overflow-hidden whitespace-nowrap">
      <div className="flex gap-8 px-4 items-center animate-scroll">
        {brands.map(brand => (
          <span key={brand.id} className="text-gray-400 font-serif text-xl opacity-50 hover:opacity-100 transition-opacity">
            {brand.name_fr}
          </span>
        ))}
      </div>
    </div>
  )
}
