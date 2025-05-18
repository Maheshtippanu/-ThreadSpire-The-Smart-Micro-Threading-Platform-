import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Globe, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Collection } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useCollections } from '../../hooks/useCollections';

interface CollectionFormProps {
  existingCollection?: Collection;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ existingCollection }) => {
  const { currentUser } = useAuth();
  const { createCollection, updateCollection } = useCollections();
  const navigate = useNavigate();
  
  const [name, setName] = useState(existingCollection?.name || '');
  const [description, setDescription] = useState(existingCollection?.description || '');
  const [isPublic, setIsPublic] = useState(existingCollection?.isPublic ?? false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Collection name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (existingCollection) {
        // Update existing collection
        await updateCollection({
          ...existingCollection,
          name,
          description,
          isPublic,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new collection
        const newCollection: Collection = {
          id: uuidv4(),
          name,
          description,
          userId: currentUser?.id || '',
          threads: [],
          isPublic,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await createCollection(newCollection);
      }
      
      navigate('/collections');
    } catch (error) {
      console.error('Failed to save collection:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            {existingCollection ? 'Edit Collection' : 'Create New Collection'}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Wisdom Collection"
                className={`w-full px-4 py-2 border ${
                  errors.name ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                } rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this collection about?"
                rows={3}
                className={`w-full px-4 py-2 border ${
                  errors.description ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                } rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Privacy Setting
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                    !isPublic 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600'
                  }`}>
                    {!isPublic && (
                      <Lock size={12} />
                    )}
                  </div>
                  <div>
                    <span className="text-slate-900 dark:text-white font-medium">Private</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Only visible to you</p>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                    isPublic 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600'
                  }`}>
                    {isPublic && (
                      <Globe size={12} />
                    )}
                  </div>
                  <div>
                    <span className="text-slate-900 dark:text-white font-medium">Public</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Visible to everyone</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Save size={16} className="mr-2" />
                <span>{existingCollection ? 'Update' : 'Create'} Collection</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollectionForm;