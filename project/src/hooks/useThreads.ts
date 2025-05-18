import { useState, useEffect } from 'react';
import { Thread } from '../types';
import { threads as threadsApi } from '../api';

export const useThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await threadsApi.getAll();
        setThreads(response.data);
      } catch (error) {
        console.error('Failed to load threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const getThread = (id: string) => {
    return threads.find(thread => thread.id === id);
  };

  const createThread = async (newThread: Thread) => {
    try {
      const response = await threadsApi.create(newThread);
      const createdThread = response.data;
      setThreads(prev => [...prev, createdThread]);
      return createdThread;
    } catch (error) {
      console.error('Failed to create thread:', error);
      throw error;
    }
  };

  const updateThread = async (updatedThread: Thread) => {
    try {
      const response = await threadsApi.update(updatedThread.id, updatedThread);
      const updated = response.data;
      setThreads(prev => prev.map(thread => 
        thread.id === updated.id ? updated : thread
      ));
      return updated;
    } catch (error) {
      console.error('Failed to update thread:', error);
      throw error;
    }
  };

  const deleteThread = async (id: string) => {
    try {
      await threadsApi.delete(id);
      setThreads(prev => prev.filter(thread => thread.id !== id));
    } catch (error) {
      console.error('Failed to delete thread:', error);
      throw error;
    }
  };

  const addReaction = async (threadId: string, segmentId: string, reactionType: string, userId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId);
      if (!thread) return;

      const updatedThread = {
        ...thread,
        segments: thread.segments.map(segment => {
          if (segment.id === segmentId) {
            const updatedReactions = { ...segment.reactions };
            updatedReactions[reactionType as keyof typeof updatedReactions] += 1;
            
            return {
              ...segment,
              reactions: updatedReactions
            };
          }
          return segment;
        })
      };
      
      await updateThread(updatedThread);
    } catch (error) {
      console.error('Failed to add reaction:', error);
      throw error;
    }
  };

  const incrementBookmark = async (threadId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId);
      if (!thread) return;

      const updatedThread = {
        ...thread,
        bookmarks: thread.bookmarks + 1
      };
      
      await updateThread(updatedThread);
    } catch (error) {
      console.error('Failed to increment bookmark:', error);
      throw error;
    }
  };

  const decrementBookmark = async (threadId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId);
      if (!thread) return;

      const updatedThread = {
        ...thread,
        bookmarks: Math.max(0, thread.bookmarks - 1)
      };
      
      await updateThread(updatedThread);
    } catch (error) {
      console.error('Failed to decrement bookmark:', error);
      throw error;
    }
  };

  const incrementFork = async (threadId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId);
      if (!thread) return;

      const updatedThread = {
        ...thread,
        forks: thread.forks + 1
      };
      
      await updateThread(updatedThread);
    } catch (error) {
      console.error('Failed to increment fork:', error);
      throw error;
    }
  };

  return {
    threads,
    isLoading,
    getThread,
    createThread,
    updateThread,
    deleteThread,
    addReaction,
    incrementBookmark,
    decrementBookmark,
    incrementFork
  };
};