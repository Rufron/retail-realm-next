
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md hover:scale-[1.02]">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>
            {product.discountPercentage > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 right-2 shadow-lg"
              >
                -{Math.round(product.discountPercentage)}%
              </Badge>
            )}
          </div>
          
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                ({product.rating})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ${product.price}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.stock} left
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
