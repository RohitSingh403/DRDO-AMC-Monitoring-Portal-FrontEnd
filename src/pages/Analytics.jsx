import { useState } from 'react';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiDollarSign, 
  FiUsers, 
  FiCalendar, 
  FiFilter, 
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for charts
  const generateRevenueData = () => {
    const labels = timeRange === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : timeRange === 'month'
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: labels.map(() => Math.floor(Math.random() * 100000) + 50000),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  const generateClientGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const labels = months.slice(0, currentMonth + 1);
    
    let cumulative = 0;
    const data = labels.map(() => {
      const newClients = Math.floor(Math.random() * 10) + 1;
      cumulative += newClients;
      return cumulative;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Total Clients',
          data,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  };

  const generateServiceDistributionData = () => {
    return {
      labels: ['Maintenance', 'Consulting', 'Software', 'Support', 'Training'],
      datasets: [
        {
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const [revenueData, setRevenueData] = useState(generateRevenueData());
  const [clientGrowthData, setClientGrowthData] = useState(generateClientGrowthData());
  const [serviceDistributionData] = useState(generateServiceDistributionData());

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRevenueData(generateRevenueData());
      setClientGrowthData(generateClientGrowthData());
      setIsLoading(false);
    }, 1000);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRevenueData(generateRevenueData());
      setIsLoading(false);
    }, 800);
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}% (${value})`;
          }
        }
      },
    },
  };

  // Stats cards data
  const stats = [
    {
      title: 'Total Revenue',
      value: '$1,248,450',
      change: '+12.5%',
      isPositive: true,
      icon: <FiDollarSign className="h-6 w-6 text-blue-500" />,
    },
    {
      title: 'Active Clients',
      value: '248',
      change: '+8.2%',
      isPositive: true,
      icon: <FiUsers className="h-6 w-6 text-green-500" />,
    },
    {
      title: 'Avg. Contract Value',
      value: '$24,500',
      change: '+3.2%',
      isPositive: true,
      icon: <FiTrendingUp className="h-6 w-6 text-yellow-500" />,
    },
    {
      title: 'Satisfaction Rate',
      value: '94.6%',
      change: '+2.1%',
      isPositive: true,
      icon: <FiBarChart2 className="h-6 w-6 text-purple-500" />,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track and analyze your business performance
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => handleTimeRangeChange(range)}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                } ${
                  range === 'week' ? 'rounded-l-lg' : ''
                } ${
                  range === 'year' ? 'rounded-r-lg' : 'border-r border-gray-200 dark:border-gray-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                <div className={`mt-1 flex items-center text-sm ${stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change}
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">vs last period</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revenue Overview</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>
              <span>Revenue</span>
            </div>
          </div>
          <div className="h-80">
            <Line data={revenueData} options={lineChartOptions} />
          </div>
        </div>

        {/* Client Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Client Growth</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></span>
              <span>Total Clients</span>
            </div>
          </div>
          <div className="h-80">
            <Bar data={clientGrowthData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Service Distribution</h3>
          <div className="h-64">
            <Pie data={serviceDistributionData} options={pieChartOptions} />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 last:mb-0">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  {item % 3 === 0 ? (
                    <FiDollarSign className="h-5 w-5" />
                  ) : item % 3 === 1 ? (
                    <FiUsers className="h-5 w-5" />
                  ) : (
                    <FiFileText className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item % 3 === 0 
                      ? 'New invoice #INV-00' + (1000 + item) + ' has been paid' 
                      : item % 3 === 1 
                      ? 'New client onboarded: Company ' + String.fromCharCode(64 + item) 
                      : 'Contract #CTR-00' + (200 + item) + ' has been renewed'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item} {item === 1 ? 'minute' : 'minutes'} ago
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 ml-2">
                  {item % 3 === 0 ? 'Finance' : item % 3 === 1 ? 'Client' : 'Contract'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
