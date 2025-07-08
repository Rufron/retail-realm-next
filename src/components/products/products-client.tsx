
"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProductGrid } from '@/components/products/product-grid'
import { SearchBar } from '@/components/products/search-bar'
import { CategoryFilter } from '@/components/products/category-filter'
import { Layout } from '@/components/layout/layout'
import { ProductSkeleton } from '@/components/products/product-skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { fetchProducts } from '@/lib/api'

export default function ProductsClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  // Client-side filtering
  const filteredProducts = products?.products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  // Extract unique categories for filter dropdown
  const categories = products?.products 
    ? [...new Set(products.products.map(product => product.category))]
    : []

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="Failed to load products. Please try again later." />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Product Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and explore our curated collection of products with advanced search and filtering
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            <div className="w-full lg:w-64">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {isLoading ? (
            <ProductSkeleton count={12} />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </p>
              </div>
              <ProductGrid products={filteredProducts} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
