import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
      <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;