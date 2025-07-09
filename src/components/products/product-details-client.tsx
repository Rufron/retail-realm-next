
"use client"

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'// For data fetching with caching, loading, error handling
import { ArrowLeft, Star } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton' // For loading state visuals
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { fetchProductById } from '@/services/productService'// API call function
import Image from 'next/image' // Optimized image rendering

interface ProductDetailsClientProps {
  id: string
}

export default function ProductDetailsClient({ id }: ProductDetailsClientProps) {
  const router = useRouter()

  // Fetch product data with React Query
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  })

    // Show error message if fetching fails
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="Failed to load product details. Please try again later." />
        </div>
      </Layout>
    )
  }

   // Show skeleton loaders while loading
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Show not found error if product is missing
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="Product not found." />
        </div>
      </Layout>
    )
  }

  
  // Main product details display
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded cursor-pointer hover:opacity-80 transition-opacity bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {product.title}
                    </h2>
                    <Badge variant="secondary" className="text-sm">
                      {product.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary">
                      ${product.price}
                    </span>
                    {product.discountPercentage > 0 && (
                      <Badge variant="destructive" className="text-sm">
                        -{product.discountPercentage}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.rating} ({product.stock} in stock)
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Product Details</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                        <span className="font-medium">{product.brand}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">SKU:</span>
                        <span className="font-medium">{product.sku}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                        <span className="font-medium">{product.weight}g</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                        <span className="font-medium">
                          {product.dimensions?.width} × {product.dimensions?.height} × {product.dimensions?.depth} cm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
