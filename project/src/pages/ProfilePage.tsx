import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, User, Settings, Archive } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useThreads } from '../hooks/useThreads';
import { useBookmarks } from '../hooks/useBookmarks';
import { Thread } from '../types';
import ThreadCard from '../components/thread/ThreadCard';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { threads } = useThreads();
  const { bookmarks, getUserBookmarks } = useBookmarks();
  
  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'bookmarks'>('published');
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [userDrafts, setUserDrafts] = useState<Thread[]>([]);
  const [userBookmarkedThreads, setUserBookmarkedThreads] = useState<Thread[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      // Filter user's published threads
      const published = threads.filter(
        thread => thread.authorId === currentUser.id && thread.isPublished
      );
      setUserThreads(published);
      
      // Filter user's draft threads
      const drafts = threads.filter(
        thread => thread.authorId === currentUser.id && thread.isDraft
      );
      setUserDrafts(drafts);
      
      // Get user's bookmarked threads
      const userBookmarks = getUserBookmarks(currentUser.id);
      const bookmarkedThreads = userBookmarks.map(bookmark => 
        threads.find(thread => thread.id === bookmark.threadId)
      ).filter(Boolean) as Thread[];
      
      setUserBookmarkedThreads(bookmarkedThreads);
    }
  }, [currentUser, threads, bookmarks, getUserBookmarks]);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-xl font-semibold mr-4">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentUser.username}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {currentUser.email}
            </p>
          </div>
          <div className="ml-auto">
            <Link
              to="/settings"
              className="inline-flex items-center px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Settings size={16} className="mr-1.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('published')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'published'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PenSquare size={16} className="mr-2" />
            Published Threads
            <span className="ml-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">
              {userThreads.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'drafts'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Archive size={16} className="mr-2" />
            Drafts
            <span className="ml-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">
              {userDrafts.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'bookmarks'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <User size={16} className="mr-2" />
            Bookmarks
            <span className="ml-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">
              {userBookmarkedThreads.length}
            </span>
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {activeTab === 'published' && (
          <>
            {userThreads.length > 0 ? (
              userThreads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))
            ) : (
              <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No published threads yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  You haven't published any threads. Share your wisdom with the community!
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <PenSquare size={16} className="mr-2" />
                  Create a Thread
                </Link>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'drafts' && (
          <>
            {userDrafts.length > 0 ? (
              userDrafts.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))
            ) : (
              <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No draft threads</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  You don't have any draft threads saved. Start writing and save as draft!
                </p>
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <PenSquare size={16} className="mr-2" />
                  Create a Thread
                </Link>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'bookmarks' && (
          <>
            {userBookmarkedThreads.length > 0 ? (
              userBookmarkedThreads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))
            ) : (
              <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No bookmarked threads</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  You haven't bookmarked any threads yet. Explore and bookmark threads that inspire you!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Explore Threads
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;