import React from 'react';

const users = ['Abdullah', 'Jane', 'Jason'];

function UserSelection({ onUserSelect }) {
  return (
    <div className="user-selection">
      <h1>🐕 Welcome to LarkGPT 🐕</h1>
      <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        Your Border Collie Care & Training Assistant
      </p>
      <div className="user-grid">
        {users.map(user => (
          <button
            key={user}
            className="user-button"
            onClick={() => onUserSelect(user)}
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserSelection;