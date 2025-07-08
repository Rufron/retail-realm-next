
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex items-center gap-3 p-6">
        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </CardContent>
    </Card>
  );
};
