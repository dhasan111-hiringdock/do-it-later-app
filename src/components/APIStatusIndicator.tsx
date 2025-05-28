
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const APIStatusIndicator = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      setApiStatus('checking');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [{ role: 'user', content: 'test' }],
          conversationId: null
        }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('API key') || data.error.includes('OpenAI')) {
          setErrorMessage('OpenAI API key issue');
          setApiStatus('error');
        } else {
          setErrorMessage('Service error');
          setApiStatus('error');
        }
      } else {
        setApiStatus('connected');
      }
    } catch (error) {
      console.error('API status check failed:', error);
      setErrorMessage('Connection failed');
      setApiStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'checking':
        return <AlertCircle size={16} className="text-yellow-500 animate-pulse" />;
      case 'connected':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'checking':
        return 'Checking API...';
      case 'connected':
        return 'AI Connected';
      case 'error':
        return errorMessage;
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      {getStatusIcon()}
      <span className={`${
        apiStatus === 'connected' ? 'text-green-700' : 
        apiStatus === 'error' ? 'text-red-700' : 'text-yellow-700'
      }`}>
        {getStatusText()}
      </span>
      {apiStatus === 'error' && (
        <button 
          onClick={checkAPIStatus}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default APIStatusIndicator;
