import { useState } from 'react';
import { FiInbox, FiStar, FiTrash2, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';

const Messages = () => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock messages data
  const messages = [
    {
      id: 1,
      from: 'john.doe@example.com',
      subject: 'Project Update',
      preview: 'Hi there, I wanted to update you on the progress...',
      date: '2025-06-10T14:30:00',
      read: false,
      starred: true,
      folder: 'inbox'
    },
    {
      id: 2,
      from: 'support@example.com',
      subject: 'Your support ticket',
      preview: 'We have resolved your support ticket #12345...',
      date: '2025-06-09T09:15:00',
      read: true,
      starred: false,
      folder: 'inbox'
    }
  ];

  // Filter messages based on active folder and search term
  const filteredMessages = messages.filter(message => {
    const matchesFolder = message.folder === activeFolder || 
                        (activeFolder === 'starred' && message.starred) ||
                        (activeFolder === 'all' && message.folder !== 'trash');
    
    const matchesSearch = searchTerm === '' || 
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFolder && matchesSearch;
  });

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
        <nav className="flex-1 overflow-y-auto">
          <ul>
            <li>
              <button 
                onClick={() => setActiveFolder('inbox')}
                className={`w-full px-4 py-3 text-left flex items-center ${activeFolder === 'inbox' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiInbox className="mr-3" />
                <span>Inbox</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveFolder('starred')}
                className={`w-full px-4 py-3 text-left flex items-center ${activeFolder === 'starred' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiStar className="mr-3" />
                <span>Starred</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveFolder('sent')}
                className={`w-full px-4 py-3 text-left flex items-center ${activeFolder === 'sent' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiSend className="mr-3" />
                <span>Sent</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1)}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <FiFilter className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <FiRefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMessages.map((message) => (
              <li key={message.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <button className={`p-1 rounded-full ${message.starred ? 'text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}>
                      <FiStar className="h-5 w-5" fill={message.starred ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'} truncate`}>
                        {message.from}
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(message.date)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                      {message.preview}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Messages;
