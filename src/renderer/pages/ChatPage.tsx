import React, { useState } from 'react';

const ChatPage: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const channels = [
    { id: '1', name: 'general', type: 'PUBLIC', unread: 0 },
    { id: '2', name: 'team-updates', type: 'PUBLIC', unread: 3 },
    { id: '3', name: 'project-alpha', type: 'PRIVATE', unread: 0 },
  ];

  const integrations = [
    { id: 'slack', name: 'Slack', icon: 'S', connected: false },
    { id: 'discord', name: 'Discord', icon: 'D', connected: false },
    { id: 'email', name: 'Email', icon: 'E', connected: false },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Communicate with your team
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Channels sidebar */}
        <div className="w-64 card flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-dark-border">
            <button className="w-full btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Channel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
                Channels
              </h3>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      selectedChannel === channel.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400">#</span>
                      {channel.name}
                    </span>
                    {channel.unread > 0 && (
                      <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {channel.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
                Integrations
              </h3>
              <div className="space-y-1">
                {integrations.map((integration) => (
                  <button
                    key={integration.id}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-gray-200 dark:bg-dark-border flex items-center justify-center text-xs font-medium">
                        {integration.icon}
                      </span>
                      {integration.name}
                    </span>
                    <span
                      className={`text-xs ${
                        integration.connected
                          ? 'text-green-500'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {integration.connected ? 'Connected' : 'Setup'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 card flex flex-col">
          {selectedChannel ? (
            <>
              {/* Channel header */}
              <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    # {channels.find((c) => c.id === selectedChannel)?.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3 members</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button className="btn-ghost p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start the conversation!</p>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-dark-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Handle send
                    setMessage('');
                  }}
                  className="flex items-center gap-3"
                >
                  <button type="button" className="btn-ghost p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 input"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="btn-primary px-4 disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a channel
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a channel from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
