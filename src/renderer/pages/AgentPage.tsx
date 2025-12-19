import React, { useState, useRef, useEffect } from 'react';
import { useAgentStore } from '../store/agentStore';

const AgentPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage, suggestions } = useAgentStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      await window.api.voice.stopRecognition();
      setIsRecording(false);
    } else {
      await window.api.voice.startRecognition();
      setIsRecording(true);
    }
  };

  const quickPrompts = [
    { label: 'Review my tasks', prompt: 'What are my pending tasks and priorities for today?' },
    { label: 'Team status', prompt: 'Give me a summary of my team\'s current status and any blockers.' },
    { label: 'Best practices', prompt: 'What are the best practices for effective team management?' },
    { label: 'Risk assessment', prompt: 'Are there any risks or blockers I should be aware of?' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Agent</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your intelligent management assistant
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-primary">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Messages */}
        <div className="flex-1 card flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to SmartLink AI
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                  I'm your AI management assistant. I can help you with tasks, team coordination,
                  document analysis, and provide evidence-based recommendations.
                </p>
                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.label}
                      onClick={() => sendMessage(prompt.prompt)}
                      className="p-3 text-left rounded-lg bg-gray-50 dark:bg-dark-hover hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                    >
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {prompt.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      message.role === 'user'
                        ? 'message-bubble-user'
                        : 'message-bubble-assistant'
                    }
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.metadata && (
                      <p className="text-xs opacity-60 mt-2">
                        {message.metadata.modelUsed} · {message.metadata.processingTime}ms
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="message-bubble-assistant">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-3 rounded-xl transition-colors ${
                  isRecording
                    ? 'bg-red-500 text-white pulse-recording'
                    : 'bg-gray-100 dark:bg-dark-hover text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-border'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your work..."
                className="flex-1 input"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Suggestions panel */}
        <div className="w-80 card p-4 flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Suggestions</h3>
          {suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-dark-hover cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`badge ${
                        suggestion.priority === 'high'
                          ? 'badge-error'
                          : suggestion.priority === 'medium'
                          ? 'badge-warning'
                          : 'badge-primary'
                      }`}
                    >
                      {suggestion.type}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white mt-2 text-sm">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {suggestion.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <svg className="w-10 h-10 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-sm">No suggestions yet</p>
              <p className="text-xs mt-1">Start a conversation to get AI-powered suggestions</p>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-dark-border">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Quick Actions
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => sendMessage('What are my top priorities today?')}
                className="w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-hover hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-gray-700 dark:text-gray-300"
              >
                Check priorities
              </button>
              <button
                onClick={() => sendMessage('Summarize my team\'s reports from this week')}
                className="w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-hover hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-gray-700 dark:text-gray-300"
              >
                Summarize reports
              </button>
              <button
                onClick={() => sendMessage('What meetings do I have coming up?')}
                className="w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-hover hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-gray-700 dark:text-gray-300"
              >
                Upcoming meetings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
