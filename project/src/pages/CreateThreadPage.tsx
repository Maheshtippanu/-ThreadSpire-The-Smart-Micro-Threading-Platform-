import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ThreadForm from '../components/thread/ThreadForm';
import { Thread } from '../types';

const CreateThreadPage: React.FC = () => {
  const location = useLocation();
  const [threadToFork, setThreadToFork] = useState<Thread | undefined>(undefined);
  
  useEffect(() => {
    // Check if we're in fork mode
    if (location.state && location.state.threadToFork) {
      setThreadToFork(location.state.threadToFork);
    }
  }, [location]);

  return (
    <div>
      <ThreadForm originalThread={threadToFork} />
    </div>
  );
};

export default CreateThreadPage;