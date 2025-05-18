import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Save, X, BookOpen, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Thread, ThreadSegment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useThreads } from '../../hooks/useThreads';

interface ThreadFormProps {
  originalThread?: Thread;
}

const ThreadForm: React.FC<ThreadFormProps> = ({ originalThread }) => {
  const { currentUser } = useAuth();
  const { createThread } = useThreads();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(originalThread?.title || '');
  const [segments, setSegments] = useState<Partial<ThreadSegment>[]>(
    originalThread?.segments.map(segment => ({
      ...segment,
      id: uuidv4(),
    })) || [{ 
      id: uuidv4(), 
      content: '', 
      order: 0 
    }]
  );
  const [tags, setTags] = useState<string[]>(originalThread?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [isDraft, setIsDraft] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    segments?: string[];
    tags?: string;
  }>({});

  const addSegment = () => {
    const newSegment = {
      id: uuidv4(),
      content: '',
      order: segments.length,
    };
    
    setSegments([...segments, newSegment]);
    setActiveSegmentIndex(segments.length);
  };

  const updateSegment = (index: number, content: string) => {
    const updatedSegments = [...segments];
    updatedSegments[index] = {
      ...updatedSegments[index],
      content,
    };
    setSegments(updatedSegments);
  };

  const removeSegment = (index: number) => {
    if (segments.length <= 1) {
      return; // Prevent removing the last segment
    }
    
    const updatedSegments = segments.filter((_, i) => i !== index);
    // Reorder segments
    updatedSegments.forEach((segment, i) => {
      segment.order = i;
    });
    
    setSegments(updatedSegments);
    
    // Update active segment index
    if (index === activeSegmentIndex) {
      setActiveSegmentIndex(Math.max(0, index - 1));
    } else if (index < activeSegmentIndex) {
      setActiveSegmentIndex(activeSegmentIndex - 1);
    }
  };

  const addTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) {
      return;
    }
    
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const errors: {
      title?: string;
      segments?: string[];
      tags?: string;
    } = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    const segmentErrors: string[] = [];
    segments.forEach((segment, index) => {
      if (!segment.content || segment.content.trim() === '') {
        segmentErrors[index] = `Segment ${index + 1} cannot be empty`;
      }
    });
    
    if (segmentErrors.length > 0) {
      errors.segments = segmentErrors;
    }
    
    if (tags.length === 0) {
      errors.tags = 'At least one tag is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (publish: boolean) => {
    if (publish && !validateForm()) {
      return;
    }
    
    // For MVP, simulate save/publish
    const thread: Partial<Thread> = {
      id: originalThread?.id || uuidv4(),
      title,
      segments: segments.map(segment => ({
        id: segment.id!,
        content: segment.content || '',
        order: segment.order!,
        reactions: {
          mindblown: 0,
          lightbulb: 0,
          calm: 0,
          fire: 0,
          heart: 0,
        },
        createdAt: new Date().toISOString(),
      })),
      tags,
      authorId: currentUser?.id || '',
      isPublished: publish,
      isDraft: !publish,
      bookmarks: 0,
      forks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (originalThread) {
      thread.originalThreadId = originalThread.id;
      thread.originalAuthor = originalThread.author;
    }
    
    try {
      await createThread(thread as Thread);
      navigate(publish ? `/thread/${thread.id}` : '/profile');
    } catch (error) {
      console.error('Failed to save thread:', error);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
              {originalThread ? 'Remix Thread' : 'Create New Thread'}
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {isPreview ? (
                  <>
                    <ArrowRight size={16} className="mr-1.5" />
                    <span>Edit</span>
                  </>
                ) : (
                  <>
                    <BookOpen size={16} className="mr-1.5" />
                    <span>Preview</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleSave(false)}
                className="flex items-center px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Save size={16} className="mr-1.5" />
                <span>Save Draft</span>
              </button>
              
              <button
                onClick={() => handleSave(true)}
                className="flex items-center px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <span>Publish</span>
              </button>
            </div>
          </div>
          
          {!isPreview ? (
            <>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Thread Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title..."
                  className={`w-full px-4 py-2 border ${
                    validationErrors.title 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-slate-300 dark:border-slate-600'
                  } rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200`}
                />
                {validationErrors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.title}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <div 
                      key={tag} 
                      className="flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm"
                    >
                      <span>{tag}</span>
                      <button 
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add a tag..."
                    className={`flex-grow px-4 py-2 border ${
                      validationErrors.tags 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-slate-300 dark:border-slate-600'
                    } rounded-l-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200`}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {validationErrors.tags && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.tags}</p>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Thread Segments
                  </label>
                  <button
                    onClick={addSegment}
                    className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    <PlusCircle size={16} className="mr-1" />
                    <span>Add Segment</span>
                  </button>
                </div>
                
                <div className="flex">
                  <div className="w-24 flex-shrink-0 bg-slate-50 dark:bg-slate-850 border-r border-slate-200 dark:border-slate-700 rounded-l-md overflow-hidden">
                    <div className="py-2">
                      {segments.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveSegmentIndex(index)}
                          className={`w-full py-2 px-3 text-left text-sm ${
                            index === activeSegmentIndex
                              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="relative">
                      <textarea
                        value={segments[activeSegmentIndex]?.content || ''}
                        onChange={(e) => updateSegment(activeSegmentIndex, e.target.value)}
                        placeholder="Write your thoughts here..."
                        rows={8}
                        className={`w-full px-4 py-3 border-t border-r border-b ${
                          validationErrors.segments && validationErrors.segments[activeSegmentIndex]
                            ? 'border-red-500 dark:border-red-400'
                            : 'border-slate-300 dark:border-slate-600'
                        } rounded-r-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition duration-200`}
                      />
                      
                      <button
                        onClick={() => removeSegment(activeSegmentIndex)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label="Remove segment"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    {validationErrors.segments && validationErrors.segments[activeSegmentIndex] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {validationErrors.segments[activeSegmentIndex]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Preview mode
            <div className="thread-preview">
              <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-6">{title || 'Untitled Thread'}</h2>
              
              <div className="mb-6">
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 italic">No tags added yet</p>
                )}
              </div>
              
              <div className="space-y-6">
                {segments.map((segment, index) => (
                  <div 
                    key={segment.id} 
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6"
                  >
                    {segment.content ? (
                      <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        {segment.content}
                      </p>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 italic">
                        This segment is empty
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadForm;