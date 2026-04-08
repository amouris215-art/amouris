export function CategoriesGrid({ categories }: { categories: any[] }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif mb-8 text-center">Nos Catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm text-center">
              <span className="font-medium text-gray-900">{cat.name_fr}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
