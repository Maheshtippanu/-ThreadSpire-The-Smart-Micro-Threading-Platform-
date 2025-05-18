import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import { TrendingUp, BookOpen, MessageSquare, GitFork, BookmarkPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useThreads } from '../hooks/useThreads';
import { UserAnalytics } from '../types';

// Helper to generate random analytics data for MVP
const generateMockAnalytics = (userId: string, threads: any[]): UserAnalytics => {
  const userThreads = threads.filter(t => t.authorId === userId);
  const mostReactedThread = userThreads.length > 0 
    ? userThreads.reduce((prev, current) => {
        const totalReactions = current.segments.reduce((sum: number, segment: any) => {
          return sum + Object.values(segment.reactions).reduce((a: number, b: number) => a + b, 0);
        }, 0);
        
        const prevReactions = prev.segments.reduce((sum: number, segment: any) => {
          return sum + Object.values(segment.reactions).reduce((a: number, b: number) => a + b, 0);
        }, 0);
        
        return totalReactions > prevReactions ? current : prev;
      }, userThreads[0])
    : undefined;
  
  const mostForkedThread = userThreads.length > 0 
    ? userThreads.reduce((prev, current) => current.forks > prev.forks ? current : prev, userThreads[0])
    : undefined;
  
  // Generate random activity data for the last 30 days
  const threadActivity = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    threadActivity.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 50) + 5,
      reactions: Math.floor(Math.random() * 20) + 1,
      bookmarks: Math.floor(Math.random() * 10)
    });
  }
  
  return {
    threadsCreated: userThreads.length,
    bookmarksReceived: userThreads.reduce((sum, thread) => sum + thread.bookmarks, 0),
    reactionsPerThread: userThreads.map(thread => {
      const totalReactions = thread.segments.reduce((sum: number, segment: any) => {
        return sum + Object.values(segment.reactions).reduce((a: number, b: number) => a + b, 0);
      }, 0);
      
      // Find the segment with the most reactions
      let topSegment = undefined;
      if (thread.segments.length > 0) {
        const mostReactedSegment = thread.segments.reduce((prev: any, current: any) => {
          const currentReactions = Object.values(current.reactions).reduce((a: number, b: number) => a + b, 0);
          const prevReactions = Object.values(prev.reactions).reduce((a: number, b: number) => a + b, 0);
          return currentReactions > prevReactions ? current : prev;
        }, thread.segments[0]);
        
        const segmentReactions = Object.values(mostReactedSegment.reactions).reduce((a: number, b: number) => a + b, 0);
        
        if (segmentReactions > 0) {
          topSegment = {
            segmentId: mostReactedSegment.id,
            content: mostReactedSegment.content.substring(0, 100) + (mostReactedSegment.content.length > 100 ? '...' : ''),
            reactions: segmentReactions
          };
        }
      }
      
      return {
        threadId: thread.id,
        threadTitle: thread.title,
        totalReactions,
        topSegment
      };
    }),
    mostForkedThread: mostForkedThread ? {
      threadId: mostForkedThread.id,
      threadTitle: mostForkedThread.title,
      forks: mostForkedThread.forks
    } : undefined,
    threadActivity
  };
};

const AnalyticsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { threads } = useThreads();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  
  useEffect(() => {
    if (currentUser) {
      // For MVP, we'll generate mock analytics data
      const mockAnalytics = generateMockAnalytics(currentUser.id, threads);
      setAnalytics(mockAnalytics);
    }
  }, [currentUser, threads]);
  
  if (!currentUser || !analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  const filteredActivityData = analytics.threadActivity.filter(item => {
    if (timeRange === 'all') return true;
    
    const date = new Date(item.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return timeRange === '7d' ? diffDays <= 7 : diffDays <= 30;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-8">Your Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mr-3">
              <BookOpen size={18} />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Threads Created</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.threadsCreated}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 mr-3">
              <BookmarkPlus size={18} />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Bookmarks Received</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.bookmarksReceived}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 mr-3">
              <GitFork size={18} />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Most Forked</span>
          </div>
          {analytics.mostForkedThread ? (
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analytics.mostForkedThread.forks}</p>
              <Link 
                to={`/thread/${analytics.mostForkedThread.threadId}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline line-clamp-1"
              >
                {analytics.mostForkedThread.threadTitle}
              </Link>
            </div>
          ) : (
            <p className="text-lg text-slate-500 dark:text-slate-400">No forks yet</p>
          )}
        </div>
      </div>
      
      <div className="mb-8 bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-slate-900 dark:text-white">Thread Activity</h2>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '7d'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === '30d'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 'all'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredActivityData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280' }} 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB',
                color: '#111827'
              }} />
              <Line type="monotone" dataKey="views" stroke="#4F46E5" strokeWidth={2} />
              <Line type="monotone" dataKey="reactions" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="bookmarks" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-8 bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-medium text-slate-900 dark:text-white">Reactions Per Thread</h2>
        </div>
        
        {analytics.reactionsPerThread.length > 0 ? (
          <div className="p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.reactionsPerThread.sort((a, b) => b.totalReactions - a.totalReactions).slice(0, 5)}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" opacity={0.2} />
                <XAxis 
                  dataKey="threadTitle" 
                  tick={{ fill: '#6B7280' }} 
                  tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value} 
                />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB',
                    color: '#111827'
                  }}
                  formatter={(value, name) => [value, 'Reactions']}
                  labelFormatter={(value) => `Thread: ${value}`}
                />
                <Bar dataKey="totalReactions" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-slate-500 dark:text-slate-400">No reaction data available yet</p>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-medium text-slate-900 dark:text-white">Top Reacted Segments</h2>
        </div>
        
        {analytics.reactionsPerThread.some(thread => thread.topSegment) ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {analytics.reactionsPerThread
              .filter(thread => thread.topSegment)
              .sort((a, b) => (b.topSegment?.reactions || 0) - (a.topSegment?.reactions || 0))
              .slice(0, 5)
              .map(thread => (
                <div key={thread.threadId} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <Link 
                      to={`/thread/${thread.threadId}`}
                      className="text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 line-clamp-1"
                    >
                      {thread.threadTitle}
                    </Link>
                    <div className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full text-sm">
                      <TrendingUp size={14} className="mr-1" />
                      <span>{thread.topSegment?.reactions} reactions</span>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                    {thread.topSegment?.content}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-slate-500 dark:text-slate-400">No segment reaction data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;