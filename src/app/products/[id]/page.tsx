// src/app/products/[id]/page.tsx
import { Metadata } from 'next'
import ProductDetailsClient from '@/components/products/product-details-client'
import { fetchProductById } from '@/services/productService'

// interface ProductDetailsPageProps {
//   params: { id: string }
// }
interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

// Reusing your API service here for metadata
export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: 'Loading...',
      description: 'Please wait while we load the product',
    }
  }

  try {
    const product = await fetchProductById(id)

    return {
      title: `${product.title} | Product Dashboard`,
      description: product.description,
    }
  } catch (error) {
    return {
      title: 'Product Not Found',
      description: 'The product could not be loaded.',
    }
  }
}


//  You can keep this the same, or also fetch the product and pass it directly if needed
export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  return <ProductDetailsClient id={id} />
}
