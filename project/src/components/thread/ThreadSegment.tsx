import React, { useState } from 'react';
import { User } from 'lucide-react';
import { ThreadSegment as ThreadSegmentType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ThreadSegmentProps {
  segment: ThreadSegmentType;
  isAuthenticated: boolean;
  onReact: (segmentId: string, reactionType: string) => void;
  userReactions: Record<string, string[]>;
}

const ThreadSegment: React.FC<ThreadSegmentProps> = ({ 
  segment, 
  isAuthenticated, 
  onReact,
  userReactions
}) => {
  const [showReactions, setShowReactions] = useState(false);
  
  const reactions = [
    { emoji: '🤯', type: 'mindblown', count: segment.reactions.mindblown },
    { emoji: '💡', type: 'lightbulb', count: segment.reactions.lightbulb },
    { emoji: '😌', type: 'calm', count: segment.reactions.calm },
    { emoji: '🔥', type: 'fire', count: segment.reactions.fire },
    { emoji: '🫶', type: 'heart', count: segment.reactions.heart },
  ];
  
  const handleReaction = (type: string) => {
    if (isAuthenticated) {
      onReact(segment.id, type);
      setShowReactions(false);
    }
  };
  
  const hasUserReacted = (type: string) => {
    return userReactions[segment.id]?.includes(type) || false;
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8 transition-all duration-300 hover:shadow-md">
      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">{segment.content}</p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {reactions
            .filter(r => r.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(reaction => (
              <div 
                key={reaction.type}
                className={`flex items-center px-2 py-1 text-sm rounded-full 
                  ${hasUserReacted(reaction.type) 
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </div>
            ))}
          
          {reactions.reduce((sum, r) => sum + r.count, 0) > 0 && reactions.filter(r => r.count > 0).length > 3 && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              +{reactions.filter(r => r.count > 0).length - 3} more
            </div>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`px-3 py-1.5 text-sm rounded-md ${isAuthenticated 
              ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
              : 'bg-slate-100/50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
            disabled={!isAuthenticated}
          >
            React
          </button>
          
          {showReactions && (
            <div className="absolute right-0 bottom-full mb-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 flex space-x-2">
              {reactions.map(reaction => (
                <button
                  key={reaction.type}
                  onClick={() => handleReaction(reaction.type)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-lg 
                    ${hasUserReacted(reaction.type)
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  aria-label={`React with ${reaction.type}`}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadSegment;