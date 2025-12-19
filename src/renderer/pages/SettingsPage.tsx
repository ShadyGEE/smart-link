import React, { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

type SettingsTab = 'profile' | 'agent' | 'integrations' | 'notifications' | 'security';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'agent', label: 'AI Agent', icon: 'robot' },
    { id: 'integrations', label: 'Integrations', icon: 'plug' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'security', label: 'Security', icon: 'shield' },
  ] as const;

  const integrations = [
    { id: 'email', name: 'Email', description: 'Connect your email to send and receive messages', connected: false },
    { id: 'slack', name: 'Slack', description: 'Integrate with your Slack workspace', connected: false },
    { id: 'discord', name: 'Discord', description: 'Connect to Discord servers', connected: false },
    { id: 'calendar', name: 'Google Calendar', description: 'Sync your calendar events', connected: false },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Settings
              </h2>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <button className="btn-secondary">Change Avatar</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.firstName}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.lastName}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="input"
                    disabled
                  />
                </div>
                <div>
                  <label className="label">Job Title</label>
                  <input
                    type="text"
                    defaultValue={user?.jobTitle || ''}
                    placeholder="e.g., Product Manager"
                    className="input"
                  />
                </div>
                <div className="col-span-2">
                  <label className="label">Department</label>
                  <input
                    type="text"
                    defaultValue={user?.department || ''}
                    placeholder="e.g., Engineering"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Theme</label>
                <div className="flex items-center gap-3">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        theme === t
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {/* Agent Tab */}
          {activeTab === 'agent' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Agent Settings
              </h2>

              <div>
                <label className="label">Your Job Role</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Help the AI understand your role for better recommendations
                </p>
                <input
                  type="text"
                  placeholder="e.g., Engineering Manager, Product Lead, Team Lead"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Response Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Concise', 'Balanced', 'Detailed'].map((style) => (
                    <button
                      key={style}
                      className="p-3 rounded-lg border-2 border-gray-200 dark:border-dark-border hover:border-primary-500 transition-colors text-center"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">{style}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {style === 'Concise' && 'Short, direct answers'}
                        {style === 'Balanced' && 'Moderate detail level'}
                        {style === 'Detailed' && 'Comprehensive responses'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" defaultChecked />
                  <span className="text-gray-900 dark:text-white">Enable voice commands</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" defaultChecked />
                  <span className="text-gray-900 dark:text-white">Auto-suggest actions</span>
                </label>
              </div>

              <div>
                <label className="label">OpenRouter API Key</label>
                <input
                  type="password"
                  placeholder="sk-or-..."
                  className="input"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Your API key is stored securely and encrypted
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Integrations
              </h2>

              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-dark-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-hover flex items-center justify-center">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">
                          {integration.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {integration.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <button
                      className={
                        integration.connected ? 'btn-secondary' : 'btn-primary'
                      }
                    >
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notification Settings
              </h2>

              <div className="space-y-4">
                {[
                  { id: 'desktop', label: 'Desktop notifications', description: 'Show desktop alerts for important updates' },
                  { id: 'sound', label: 'Sound notifications', description: 'Play a sound for new messages' },
                  { id: 'email', label: 'Email notifications', description: 'Receive daily summary via email' },
                  { id: 'tasks', label: 'Task reminders', description: 'Get reminded about upcoming deadlines' },
                  { id: 'meetings', label: 'Meeting reminders', description: 'Get notified before meetings start' },
                  { id: 'agent', label: 'AI suggestions', description: 'Receive proactive suggestions from the AI agent' },
                ].map((setting) => (
                  <label
                    key={setting.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-dark-border cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-primary-600 rounded"
                      defaultChecked
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Settings
              </h2>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Change Password
                </h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="input"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="input"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="input"
                  />
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Sessions
                </h3>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Current Session
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Windows - Chrome
                      </p>
                    </div>
                    <span className="badge-success">Active</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-3">
                  Danger Zone
                </h3>
                <button className="btn-danger">Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
