import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCollections } from '../hooks/useCollections';
import CollectionCard from '../components/collection/CollectionCard';

const CollectionsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { collections, getUserCollections, isLoading } = useCollections();
  
  const [userCollections, setUserCollections] = useState(
    currentUser ? getUserCollections(currentUser.id) : []
  );
  
  useEffect(() => {
    if (currentUser) {
      setUserCollections(getUserCollections(currentUser.id));
    }
  }, [currentUser, collections, getUserCollections]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
          Your Collections
        </h1>
        <Link
          to="/collections/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <FolderPlus size={16} className="mr-2" />
          Create Collection
        </Link>
      </div>
      
      {userCollections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCollections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No collections yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Create collections to organize your favorite threads by topic or theme.
          </p>
          <Link
            to="/collections/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FolderPlus size={16} className="mr-2" />
            Create Your First Collection
          </Link>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;