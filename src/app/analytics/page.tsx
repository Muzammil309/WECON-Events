'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { PageSection } from '@/components/ui/PageSection';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Download,
  RefreshCw,
  Eye,
  Clock,
  DollarSign,
  TrendingDown
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const metrics: MetricCard[] = [
    {
      title: 'Total Registrations',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Check-in Rate',
      value: '89%',
      change: '+5.2%',
      trend: 'up',
      icon: Calendar,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Average Rating',
      value: '4.8/5',
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Revenue Generated',
      value: '$124,750',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Session Attendance',
      value: '92%',
      change: '+7.1%',
      trend: 'up',
      icon: Eye,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Avg. Session Duration',
      value: '45 min',
      change: '+2 min',
      trend: 'up',
      icon: Clock,
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const registrationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Registrations',
        data: [65, 120, 180, 280, 450, 680, 1247],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  const ticketSalesData = {
    labels: ['Early Bird', 'General', 'VIP', 'Sponsor'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [450, 680, 95, 22],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  const sessionPopularityData = {
    labels: ['Opening Keynote', 'AI Workshop', 'Community Panel', 'Security Talk', 'Closing Keynote'],
    datasets: [
      {
        label: 'Attendees',
        data: [1200, 890, 750, 580, 950],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }
    ]
  };

  const revenueData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [15000, 28000, 45000, 67000, 89000, 124750],
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <PageSection>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 px-4 py-2 text-sm backdrop-blur-md mb-4"
              >
                <BarChart3 className="h-4 w-4" />
                Real-time insights
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
                Event Analytics
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Comprehensive insights into your event performance, attendee engagement, and success metrics.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </PageSection>

        {/* Metrics Cards */}
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                     metric.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : null}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {metric.value}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {metric.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Trend */}
          <PageSection>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Registration Trend
                </h3>
                <div className="text-sm text-gray-500">
                  Last 7 months
                </div>
              </div>
              <div className="h-80">
                <Line
                  data={registrationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </PageSection>

          {/* Revenue Growth */}
          <PageSection>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Growth
                </h3>
                <div className="text-sm text-gray-500">
                  Weekly progression
                </div>
              </div>
              <div className="h-80">
                <Line
                  data={revenueData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                          callback: function(value) {
                            return '$' + (value as number).toLocaleString();
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </PageSection>

          {/* Ticket Sales Distribution */}
          <PageSection>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ticket Sales by Type
                </h3>
                <div className="text-sm text-gray-500">
                  Current distribution
                </div>
              </div>
              <div className="h-80">
                <Doughnut
                  data={ticketSalesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </PageSection>

          {/* Session Popularity */}
          <PageSection>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Most Popular Sessions
                </h3>
                <div className="text-sm text-gray-500">
                  By attendance
                </div>
              </div>
              <div className="h-80">
                <Bar
                  data={sessionPopularityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </PageSection>
        </div>
      </div>
    </div>
  );
}
