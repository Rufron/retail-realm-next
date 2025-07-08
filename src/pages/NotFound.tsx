
import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="text-center p-8">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Page Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Button asChild>
                <Link to="/products" className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
