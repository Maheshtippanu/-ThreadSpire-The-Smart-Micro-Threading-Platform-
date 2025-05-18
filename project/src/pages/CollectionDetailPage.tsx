import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FolderEdit, Trash2, ArrowLeft, Edit } from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import { useAuth } from '../contexts/AuthContext';
import ThreadCard from '../components/thread/ThreadCard';

const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCollection, deleteCollection, removeThreadFromCollection, isLoading } = useCollections();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [collection, setCollection] = useState(getCollection(id || ''));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [threadToRemove, setThreadToRemove] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundCollection = getCollection(id);
      setCollection(foundCollection);
      
      // Redirect if collection doesn't exist or user doesn't own it
      if (!foundCollection || (currentUser && foundCollection.userId !== currentUser.id)) {
        navigate('/collections');
      }
    }
  }, [id, getCollection, currentUser, navigate]);
  
  const handleDeleteCollection = () => {
    if (id) {
      deleteCollection(id);
      navigate('/collections');
    }
  };
  
  const handleRemoveThread = (threadId: string) => {
    if (id) {
      removeThreadFromCollection(id, threadId);
      // Update the local state
      setCollection(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          threads: prev.threads.filter(thread => thread.id !== threadId)
        };
      });
      setThreadToRemove(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Collection Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">The collection you're looking for doesn't exist or has been removed.</p>
        <Link to="/collections" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/collections" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        <span>Back to collections</span>
      </Link>
      
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-slate-600 dark:text-slate-400 mb-2">{collection.description}</p>
            )}
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <span className={`mr-2 h-2 w-2 rounded-full ${
                collection.isPublic 
                  ? 'bg-green-500' 
                  : 'bg-amber-500'
              }`}></span>
              <span>{collection.isPublic ? 'Public' : 'Private'}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to={`/collections/${collection.id}/edit`}
              className="flex items-center px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Edit size={16} className="mr-1.5" />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <Trash2 size={16} className="mr-1.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {collection.threads.length > 0 ? (
          collection.threads.map(thread => (
            <div key={thread.id} className="relative group">
              <ThreadCard thread={thread} />
              
              <button
                onClick={() => setThreadToRemove(thread.id)}
                className="absolute top-4 right-4 p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30"
                aria-label="Remove thread from collection"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No threads in this collection</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Bookmark threads while browsing to add them to this collection.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Browse Threads
            </Link>
          </div>
        )}
      </div>
      
      {/* Delete Collection Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Delete Collection</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete this collection? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCollection}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Remove Thread Modal */}
      {threadToRemove && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Remove Thread</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to remove this thread from the collection?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setThreadToRemove(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveThread(threadToRemove)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDetailPage;