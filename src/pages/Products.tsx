
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchBar } from '@/components/products/SearchBar';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { Layout } from '@/components/layout/Layout';
import { ProductSkeleton } from '@/components/products/ProductSkeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { fetchProducts } from '@/services/productService';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Client-side filtering
  const filteredProducts = products?.products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Extract unique categories for filter dropdown
  const categories = products?.products 
    ? [...new Set(products.products.map(product => product.category))]
    : [];

  if (error) {
    return (
      <Layout>
        <ErrorMessage message="Failed to load products. Please try again later." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Product Dashboard
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            <div className="md:w-64">
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
            <>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredProducts.length} products
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </p>
              </div>
              <ProductGrid products={filteredProducts} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
