import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GitFork, Share2, Bookmark, BookmarkPlus, ArrowLeft, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useThreads } from '../hooks/useThreads';
import { useAuth } from '../contexts/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { UserReaction } from '../types';
import ThreadSegment from '../components/thread/ThreadSegment';

const ThreadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getThread, threads, addReaction, incrementFork, isLoading } = useThreads();
  const { currentUser, isAuthenticated } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks(id);
  const navigate = useNavigate();
  
  const [thread, setThread] = useState(getThread(id || ''));
  const [userReactions, setUserReactions] = useState<Record<string, string[]>>({});
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  
  // Store user reactions in local storage for the MVP
  const USER_REACTIONS_KEY = 'threadspire_user_reactions';
  
  useEffect(() => {
    if (id) {
      const foundThread = getThread(id);
      setThread(foundThread);
      
      // Load user reactions from localStorage
      if (currentUser) {
        try {
          const storedReactions = localStorage.getItem(USER_REACTIONS_KEY);
          if (storedReactions) {
            const allReactions = JSON.parse(storedReactions) as UserReaction[];
            const userThreadReactions = allReactions.filter(
              r => r.userId === currentUser.id && r.threadId === id
            );
            
            // Group reactions by segmentId
            const reactionsBySegment: Record<string, string[]> = {};
            userThreadReactions.forEach(reaction => {
              if (!reactionsBySegment[reaction.segmentId]) {
                reactionsBySegment[reaction.segmentId] = [];
              }
              reactionsBySegment[reaction.segmentId].push(reaction.reactionType);
            });
            
            setUserReactions(reactionsBySegment);
          }
        } catch (error) {
          console.error('Failed to load user reactions:', error);
        }
      }
    }
  }, [id, getThread, threads, currentUser]);
  
  const handleReact = (segmentId: string, reactionType: string) => {
    if (!isAuthenticated || !thread || !currentUser) return;
    
    // Store the reaction
    try {
      const storedReactions = localStorage.getItem(USER_REACTIONS_KEY);
      let allReactions: UserReaction[] = storedReactions ? JSON.parse(storedReactions) : [];
      
      // Check if user already reacted with this reaction type to this segment
      const existingReaction = allReactions.find(
        r => r.userId === currentUser.id && r.threadId === thread.id && 
             r.segmentId === segmentId && r.reactionType === reactionType
      );
      
      if (!existingReaction) {
        // Add new reaction
        const newReaction: UserReaction = {
          userId: currentUser.id,
          threadId: thread.id,
          segmentId,
          reactionType: reactionType as any,
          createdAt: new Date().toISOString()
        };
        
        allReactions.push(newReaction);
        localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(allReactions));
        
        // Update local state
        setUserReactions(prev => {
          const updated = { ...prev };
          if (!updated[segmentId]) {
            updated[segmentId] = [];
          }
          if (!updated[segmentId].includes(reactionType)) {
            updated[segmentId].push(reactionType);
          }
          return updated;
        });
        
        // Update thread reactions count
        addReaction(thread.id, segmentId, reactionType, currentUser.id);
      }
    } catch (error) {
      console.error('Failed to save reaction:', error);
    }
  };
  
  const handleFork = () => {
    if (!isAuthenticated || !thread) return;
    
    // Increment fork count
    incrementFork(thread.id);
    
    // Navigate to create page with thread data
    navigate('/create', { state: { threadToFork: thread } });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: thread?.title,
        text: `Check out this wisdom thread: ${thread?.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!thread) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Thread Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">The thread you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        <span>Back to threads</span>
      </Link>
      
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold mr-3">
              {thread.author.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                {thread.author.username}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {format(new Date(thread.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {thread.title}
          </h1>
          
          {thread.originalThreadId && (
            <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-sm">
              Forked from a thread by <span className="font-medium">{thread.originalAuthor?.username}</span>
            </div>
          )}
          
          {thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {thread.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-8 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-sm">
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-1" />
                <span>{thread.segments.length} segments</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="Share thread"
              >
                <Share2 size={18} />
              </button>
              
              <button
                onClick={toggleBookmark}
                disabled={!isAuthenticated}
                className={`p-2 rounded-full transition-colors ${
                  !isAuthenticated 
                    ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                    : isBookmarked
                      ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-500'
                }`}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark thread"}
              >
                {isBookmarked ? <Bookmark size={18} /> : <BookmarkPlus size={18} />}
              </button>
              
              <button
                onClick={handleFork}
                disabled={!isAuthenticated}
                className={`p-2 rounded-full transition-colors ${
                  !isAuthenticated 
                    ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                aria-label="Fork thread"
              >
                <GitFork size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-6">
        {/* Segment navigation sidebar */}
        <div className="hidden lg:block w-16 flex-shrink-0">
          <div className="sticky top-24 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
            <div className="py-2">
              {thread.segments.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSegmentIndex(index)}
                  className={`w-full flex justify-center py-3 text-sm ${
                    index === activeSegmentIndex
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium border-l-4 border-indigo-500'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Thread content */}
        <div className="flex-grow">
          {thread.segments.map((segment, index) => (
            <div 
              key={segment.id} 
              id={`segment-${index + 1}`}
              className={index === activeSegmentIndex ? 'scroll-mt-24' : ''}
            >
              <ThreadSegment 
                segment={segment}
                isAuthenticated={isAuthenticated}
                onReact={handleReact}
                userReactions={userReactions}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadPage;