export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ThreadSegment {
  id: string;
  content: string;
  order: number;
  reactions: {
    mindblown: number;
    lightbulb: number;
    calm: number;
    fire: number;
    heart: number;
  };
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  authorId: string;
  author: User;
  segments: ThreadSegment[];
  tags: string[];
  bookmarks: number;
  forks: number;
  isPublished: boolean;
  isDraft: boolean;
  originalThreadId?: string;
  originalAuthor?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  userId: string;
  threads: Thread[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  threadId: string;
  thread: Thread;
  createdAt: string;
}

export interface UserReaction {
  userId: string;
  threadId: string;
  segmentId: string;
  reactionType: 'mindblown' | 'lightbulb' | 'calm' | 'fire' | 'heart';
  createdAt: string;
}

export interface UserAnalytics {
  threadsCreated: number;
  bookmarksReceived: number;
  reactionsPerThread: {
    threadId: string;
    threadTitle: string;
    totalReactions: number;
    topSegment?: {
      segmentId: string;
      content: string;
      reactions: number;
    };
  }[];
  mostForkedThread?: {
    threadId: string;
    threadTitle: string;
    forks: number;
  };
  threadActivity: {
    date: string;
    views: number;
    reactions: number;
    bookmarks: number;
  }[];
}

export type SortOption = 'newest' | 'most-bookmarked' | 'most-forked';
export type FilterTag = string;