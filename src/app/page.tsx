// Import the redirect function from Next.js (App Router)
import { redirect } from 'next/navigation'

export default function HomePage() {
  // Immediately redirects the user from /products to /products
  redirect('/products')
}
