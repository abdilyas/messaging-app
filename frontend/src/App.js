import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ChatRoom from './components/ChatRoom';
import UserSelection from './components/UserSelection';
import './App.css';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

function App() {
  const [currentUser, setCurrentUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message-history', (history) => {
      setMessages(history);
    });

    socket.on('receive-message', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    socket.on('user-joined', (username) => {
      setMessages(prev => [...prev, {
        username: 'System',
        message: `${username} joined the chat`,
        timestamp: new Date(),
        isSystem: true
      }]);
    });

    socket.on('user-left', (username) => {
      setMessages(prev => [...prev, {
        username: 'System',
        message: `${username} left the chat`,
        timestamp: new Date(),
        isSystem: true
      }]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message-history');
      socket.off('receive-message');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, []);

  const handleUserSelect = (username) => {
    setCurrentUser(username);
    socket.emit('join', username);
  };

  const sendMessage = (message) => {
    if (message.trim() && currentUser) {
      socket.emit('send-message', {
        username: currentUser,
        message: message.trim()
      });
    }
  };

  if (!currentUser) {
    return <UserSelection onUserSelect={handleUserSelect} />;
  }

  return (
    <div className="App">
      <ChatRoom
        currentUser={currentUser}
        messages={messages}
        onSendMessage={sendMessage}
        isConnected={isConnected}
      />
    </div>
  );
}

export default App;
