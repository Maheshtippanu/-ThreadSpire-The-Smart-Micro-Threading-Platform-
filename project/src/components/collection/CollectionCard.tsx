import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Collection } from '../../types';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link 
      to={`/collections/${collection.id}`}
      className="block bg-white dark:bg-slate-800 shadow-sm hover:shadow-md rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">{collection.name}</h3>
          {!collection.isPublic && (
            <Lock size={16} className="text-slate-500 dark:text-slate-400" />
          )}
        </div>
        
        <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 line-clamp-2">
          {collection.description || 'No description provided'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center">
            <BookOpen size={16} className="mr-1" />
            <span>{collection.threads.length} threads</span>
          </div>
          <span>
            Created {formatDistanceToNow(new Date(collection.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;