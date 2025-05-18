import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Search, TrendingUp, Clock, BookmarkPlus } from 'lucide-react';
import { useThreads } from '../hooks/useThreads';
import { useAuth } from '../contexts/AuthContext';
import ThreadCard from '../components/thread/ThreadCard';
import { Thread, SortOption, FilterTag } from '../types';

const HomePage: React.FC = () => {
  const { threads, isLoading } = useThreads();
  const { isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
  const [selectedTags, setSelectedTags] = useState<FilterTag[]>([]);
  
  // Get all unique tags from threads
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    threads.forEach(thread => {
      thread.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [threads]);
  
  // Filter and sort threads
  const filteredThreads = React.useMemo(() => {
    return threads
      .filter(thread => thread.isPublished) // Only show published threads
      .filter(thread => {
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            thread.title.toLowerCase().includes(query) ||
            thread.segments.some(segment => segment.content.toLowerCase().includes(query)) ||
            thread.tags.some(tag => tag.toLowerCase().includes(query)) ||
            thread.author.username.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .filter(thread => {
        // Filter by selected tags
        if (selectedTags.length === 0) return true;
        return selectedTags.every(tag => thread.tags.includes(tag));
      })
      .sort((a, b) => {
        // Sort threads
        switch (selectedSort) {
          case 'most-bookmarked':
            return b.bookmarks - a.bookmarks;
          case 'most-forked':
            return b.forks - a.forks;
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [threads, searchQuery, selectedTags, selectedSort]);
  
  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Community Wisdom Threads
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Discover and share thoughtful insights in a slow, reflective space designed for wisdom, not noise.
        </p>
        {isAuthenticated && (
          <Link
            to="/create"
            className="inline-flex items-center mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PenSquare size={18} className="mr-2" />
            Create a Thread
          </Link>
        )}
      </section>
      
      <div className="mb-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search threads by title, content, tag, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200"
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">Sort By</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedSort('newest')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  selectedSort === 'newest'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Clock size={16} className="mr-2" />
                Newest
              </button>
              <button
                onClick={() => setSelectedSort('most-bookmarked')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  selectedSort === 'most-bookmarked'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <BookmarkPlus size={16} className="mr-2" />
                Most Bookmarked
              </button>
              <button
                onClick={() => setSelectedSort('most-forked')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  selectedSort === 'most-forked'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <TrendingUp size={16} className="mr-2" />
                Most Forked
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 dark:text-white mb-3">Filter by Tags</h3>
            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTagFilter(tag)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No tags available</p>
            )}
          </div>
        </aside>
        
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredThreads.length > 0 ? (
            <div className="grid gap-6">
              {filteredThreads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No threads found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {searchQuery || selectedTags.length > 0
                  ? "We couldn't find any threads matching your search or filters."
                  : "There are no published threads yet."}
              </p>
              {isAuthenticated && (
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <PenSquare size={16} className="mr-2" />
                  Create the first thread
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;