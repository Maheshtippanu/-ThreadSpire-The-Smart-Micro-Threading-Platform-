import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThreads } from './useThreads';
import { Bookmark } from '../types';

const BOOKMARKS_STORAGE_KEY = 'threadspire_bookmarks';

export const useBookmarks = (threadId?: string) => {
  const { currentUser } = useAuth();
  const { incrementBookmark, decrementBookmark } = useThreads();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load bookmarks from localStorage on mount
    const loadBookmarks = () => {
      try {
        const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const saveBookmarks = (updatedBookmarks: Bookmark[]) => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

  const addBookmark = (bookmark: Bookmark) => {
    const updatedBookmarks = [...bookmarks, bookmark];
    saveBookmarks(updatedBookmarks);
    // Update the thread's bookmark count
    incrementBookmark(bookmark.threadId);
  };

  const removeBookmark = (threadId: string, userId: string) => {
    const updatedBookmarks = bookmarks.filter(
      bookmark => !(bookmark.threadId === threadId && bookmark.userId === userId)
    );
    saveBookmarks(updatedBookmarks);
    // Update the thread's bookmark count
    decrementBookmark(threadId);
  };

  const getUserBookmarks = (userId: string) => {
    return bookmarks.filter(bookmark => bookmark.userId === userId);
  };

  const isBookmarked = currentUser && threadId
    ? bookmarks.some(bookmark => bookmark.threadId === threadId && bookmark.userId === currentUser.id)
    : false;

  const toggleBookmark = () => {
    if (!currentUser || !threadId) return;

    if (isBookmarked) {
      removeBookmark(threadId, currentUser.id);
    } else {
      addBookmark({
        id: `bookmark-${Date.now()}`,
        userId: currentUser.id,
        threadId,
        thread: { id: threadId } as any, // Just pass the ID for MVP
        createdAt: new Date().toISOString()
      });
    }
  };

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    getUserBookmarks,
    isBookmarked,
    toggleBookmark
  };
};