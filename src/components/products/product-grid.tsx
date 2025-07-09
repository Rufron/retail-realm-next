
import { ProductCard } from './product-card';// Individual card display for a product
import { Product } from '@/services/productService';// Product type interface

// Props expected: an array of Product objects
interface ProductGridProps {
  products: Product[];
}


// Functional component that displays a responsive grid of product cards
export const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
        // If no products found after search/filter
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }
    // If products exist, render them in a responsive grid layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
