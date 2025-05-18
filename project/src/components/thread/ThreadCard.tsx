import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkPlus, Bookmark, GitFork, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Thread } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '../../hooks/useBookmarks';

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const { isAuthenticated } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks(thread.id);
  
  // Limit the preview to first 2 segments and truncate content
  const previewSegments = thread.segments.slice(0, 2).map(segment => {
    if (segment.content.length > 150) {
      return {
        ...segment,
        content: segment.content.substring(0, 150) + '...'
      };
    }
    return segment;
  });
  
  // Calculate total reactions
  const totalReactions = thread.segments.reduce((total, segment) => {
    const segmentTotal = 
      segment.reactions.mindblown + 
      segment.reactions.lightbulb + 
      segment.reactions.calm + 
      segment.reactions.fire + 
      segment.reactions.heart;
    return total + segmentTotal;
  }, 0);
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAuthenticated) {
      toggleBookmark();
    }
  };

  return (
    <Link 
      to={`/thread/${thread.id}`}
      className="block bg-white dark:bg-slate-800 shadow-sm hover:shadow-md rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold mr-2">
              {thread.author.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{thread.author.username}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleBookmarkClick}
            className={`p-1.5 rounded-full transition-colors ${isAuthenticated ? 'hover:bg-slate-100 dark:hover:bg-slate-700' : 'cursor-not-allowed opacity-50'}`}
            disabled={!isAuthenticated}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <Bookmark size={18} className="text-amber-500" />
            ) : (
              <BookmarkPlus size={18} className="text-slate-500 dark:text-slate-400" />
            )}
          </button>
        </div>
        
        <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{thread.title}</h3>
        
        <div className="space-y-4 mb-4">
          {previewSegments.map((segment) => (
            <div key={segment.id} className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {segment.content}
            </div>
          ))}
        </div>
        
        {thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 mb-3">
            {thread.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
            <MessageSquare size={14} className="mr-1" />
            <span>{thread.segments.length} segments</span>
          </div>
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
            <span className="flex items-center">
              <span className="mr-1">🔥</span>
              {totalReactions}
            </span>
          </div>
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
            <GitFork size={14} className="mr-1" />
            <span>{thread.forks}</span>
          </div>
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
            <Bookmark size={14} className="mr-1" />
            <span>{thread.bookmarks}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;