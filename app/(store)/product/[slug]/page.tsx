'use client'

import { useParams } from 'next/navigation'
import ProductClient from './ProductClient'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  
  if (!slug) return null

  return <ProductClient slug={slug} />
}
