import React, { useState, useEffect, useRef } from 'react';

function ChatRoom({ currentUser, messages, onSendMessage, isConnected }) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>🐾 LarkGPT - Border Collie Care - {currentUser}</h2>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.username === currentUser ? 'own' : ''} ${
              msg.isAI ? 'ai' : ''
            } ${msg.isSystem ? 'system' : ''}`}
          >
            {!msg.isSystem && (
              <div className="message-header">
                <span className={`username ${msg.isAI ? 'ai' : ''}`}>
                  {msg.username}
                </span>
                {msg.isAI && <span className="ai-indicator">AI</span>}
                <span className="timestamp">{formatTime(msg.timestamp)}</span>
              </div>
            )}
            <div className="message-content">
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="message-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about Border Collie care, training, or health... (use @ to trigger AI response)"
          className="message-input"
          disabled={!isConnected}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!isConnected || !inputMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;