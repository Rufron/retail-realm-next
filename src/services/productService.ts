// 🧾 Defines the structure of a single product object
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}


//  Defines the expected response structure when fetching multiple products
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Used in the main  product listing view
export const fetchProducts = async (): Promise<ProductsResponse> => {
  console.log('Fetching products from API...');
  const response = await fetch('https://dummyjson.com/products?limit=100');
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  console.log('Products fetched successfully:', data.products.length);
  return data;
};

//  Fetches a single product by ID
export const fetchProductById = async (id: string): Promise<Product> => {
  console.log(`Fetching product details for ID: ${id}`);
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  
  // Handle failure to fetch
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  
  const data = await response.json();
  console.log('Product details fetched:', data.title);
  return data;
};
