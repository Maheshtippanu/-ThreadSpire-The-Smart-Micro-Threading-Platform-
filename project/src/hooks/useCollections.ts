import { useState, useEffect } from 'react';
import { Collection, Thread } from '../types';
import { useAuth } from '../contexts/AuthContext';

const COLLECTIONS_STORAGE_KEY = 'threadspire_collections';

export const useCollections = () => {
  const { currentUser } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load collections from localStorage on mount
    const loadCollections = () => {
      try {
        const storedCollections = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
        if (storedCollections) {
          setCollections(JSON.parse(storedCollections));
        } else {
          // Initialize with empty array
          localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify([]));
        }
      } catch (error) {
        console.error('Failed to load collections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  const saveCollections = (updatedCollections: Collection[]) => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(updatedCollections));
    setCollections(updatedCollections);
  };

  const getUserCollections = (userId: string) => {
    return collections.filter(collection => collection.userId === userId);
  };

  const getCollection = (id: string) => {
    return collections.find(collection => collection.id === id);
  };

  const createCollection = (newCollection: Collection) => {
    const updatedCollections = [...collections, newCollection];
    saveCollections(updatedCollections);
    return newCollection;
  };

  const updateCollection = (updatedCollection: Collection) => {
    const updatedCollections = collections.map(collection => 
      collection.id === updatedCollection.id ? updatedCollection : collection
    );
    saveCollections(updatedCollections);
    return updatedCollection;
  };

  const deleteCollection = (id: string) => {
    const updatedCollections = collections.filter(collection => collection.id !== id);
    saveCollections(updatedCollections);
  };

  const addThreadToCollection = (collectionId: string, thread: Thread) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    // Check if thread is already in collection
    const isThreadInCollection = collection.threads.some(t => t.id === thread.id);
    if (isThreadInCollection) return;

    const updatedCollection = {
      ...collection,
      threads: [...collection.threads, thread],
      updatedAt: new Date().toISOString()
    };

    updateCollection(updatedCollection);
  };

  const removeThreadFromCollection = (collectionId: string, threadId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    const updatedCollection = {
      ...collection,
      threads: collection.threads.filter(thread => thread.id !== threadId),
      updatedAt: new Date().toISOString()
    };

    updateCollection(updatedCollection);
  };

  return {
    collections,
    isLoading,
    getUserCollections,
    getCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    addThreadToCollection,
    removeThreadFromCollection
  };
};