
import { Metadata } from 'next'
import ProductDetailsClient from '@/components/products/product-details-client'

interface ProductDetailsPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
  try {
    const response = await fetch(`https://dummyjson.com/products/${params.id}`)
    const product = await response.json()
    
    return {
      title: `${product.title} | Product Dashboard`,
      description: product.description,
    }
  } catch {
    return {
      title: 'Product Details | Product Dashboard',
      description: 'View product details',
    }
  }
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  return <ProductDetailsClient id={params.id} />
}
