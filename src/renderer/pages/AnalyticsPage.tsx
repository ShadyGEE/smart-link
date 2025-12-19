import React from 'react';

const AnalyticsPage: React.FC = () => {
  const metrics = [
    { label: 'Tasks Completed', value: '0', change: '+0%', trend: 'up' },
    { label: 'Team Productivity', value: '0%', change: '+0%', trend: 'up' },
    { label: 'On-time Delivery', value: '0%', change: '+0%', trend: 'up' },
    { label: 'Active Blockers', value: '0', change: '0%', trend: 'neutral' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track team performance and productivity metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input py-2 w-40">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              <span
                className={`text-sm font-medium ${
                  metric.trend === 'up'
                    ? 'text-green-500'
                    : metric.trend === 'down'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task completion chart placeholder */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Completion Over Time
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-dark-hover rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No data available</p>
              <p className="text-sm mt-1">Complete tasks to see trends</p>
            </div>
          </div>
        </div>

        {/* Team performance chart placeholder */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Team Performance
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-dark-hover rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>No team data</p>
              <p className="text-sm mt-1">Add team members to see metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk assessment */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Risk Assessment
            </h2>
            <span className="badge-primary">AI Powered</span>
          </div>
          <button className="btn-secondary text-sm">
            Run Assessment
          </button>
        </div>
        <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-dark-hover rounded-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>No risks identified</p>
            <p className="text-sm mt-1">The AI will analyze your projects for potential risks</p>
          </div>
        </div>
      </div>

      {/* Recent activity and insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No recent activity</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Insights
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Start adding tasks and team members
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    The AI will provide insights and recommendations based on your team's activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
