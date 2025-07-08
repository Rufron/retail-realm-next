
import { Metadata } from 'next'
import ProductsClient from '@/components/products/products-client'

export const metadata: Metadata = {
  title: 'Products | Product Dashboard',
  description: 'Browse and search through our product catalog',
}

export default function ProductsPage() {
  return <ProductsClient />
}
