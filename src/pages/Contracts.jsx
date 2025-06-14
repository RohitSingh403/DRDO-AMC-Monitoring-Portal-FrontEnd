import { useState } from 'react';
import { FiFileText, FiSearch, FiPhone, FiMail, FiCalendar, FiDollarSign, FiFilter, FiDownload } from 'react-icons/fi';

const Contracts = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  // Mock data
  const contracts = [
    { 
      id: 1, 
      title: 'Annual Maintenance Contract',
      client: 'Acme Corp', 
      startDate: '2025-01-15',
      endDate: '2025-12-31',
      value: 25000,
      status: 'active',
      contact: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1 (555) 123-4567',
      description: 'Comprehensive annual maintenance for IT infrastructure.'
    },
    { 
      id: 2, 
      title: 'Software License Agreement',
      client: 'Globex', 
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      value: 18000,
      status: 'active',
      contact: 'Sarah Johnson',
      email: 'sarah.j@globex.com',
      phone: '+1 (555) 987-6543',
      description: 'Enterprise software license and support package.'
    },
    { 
      id: 3, 
      title: 'Consulting Services',
      client: 'Soylent', 
      startDate: '2024-11-01',
      endDate: '2025-10-31',
      value: 35000,
      status: 'pending',
      contact: 'Michael Chen',
      email: 'michael.chen@soylent.net',
      phone: '+1 (555) 456-7890',
      description: 'Ongoing IT consulting and support services.'
    },
  ];

  const filteredContracts = contracts.filter(contract => 
    activeTab === 'all' ? true : contract.status === activeTab
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Contracts</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your contracts and agreements
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search contracts..."
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center shadow-md hover:shadow-lg">
            <FiFileText className="w-4 h-4 mr-2" />
            New Contract
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
            <FiFilter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['all', 'active', 'pending', 'expired'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab} {tab !== 'all' && `(${contracts.filter(c => c.status === tab).length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Contracts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContracts.map((contract) => (
          <div key={contract.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{contract.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{contract.client}</p>
                </div>
                {getStatusBadge(contract.status)}
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FiCalendar className="flex-shrink-0 mr-2 text-gray-400" />
                  <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FiDollarSign className="flex-shrink-0 mr-2 text-gray-400" />
                  <span className="font-medium">{formatCurrency(contract.value)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/year</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
                  <span>{contract.contact}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FiMail className="flex-shrink-0 mr-2 text-gray-400" />
                  <span className="truncate">{contract.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <FiPhone className="flex-shrink-0 mr-2 text-gray-400" />
                  <span>{contract.phone}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {contract.description}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 flex justify-between items-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                View Details
              </button>
              <div className="flex space-x-2">
                <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No {activeTab} contracts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {activeTab === 'all' 
              ? 'No contracts found.' 
              : `You don't have any ${activeTab} contracts at the moment.`}
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              New Contract
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
