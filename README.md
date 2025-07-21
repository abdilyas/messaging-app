# Real-Time Messaging App

A real-time chat application with AI integration for 4 users: Abdullah, Jane, Jason, and an AI Assistant.

## Features

- Real-time messaging using WebSockets (Socket.IO)
- Mobile-friendly React frontend
- MongoDB message persistence
- AI integration with OpenAI GPT-4o (triggered by "@" in messages)
- User selection screen
- Message history
- Connection status indicator

## Tech Stack

- **Frontend**: React, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o API

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. Clone or extract the project
2. Set up the backend:
   ```bash
   cd messaging-app/backend
   npm install
   cp .env.example .env
   # Edit .env file with your MongoDB URI and OpenAI API key
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the backend directory with:

```env
MONGODB_URI=mongodb://localhost:27017/messaging-app
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### Running the Application

1. Start MongoDB (if running locally)
2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

The app will be available at `http://localhost:3000`

## Usage

1. Open the app in your browser
2. Select a username (Abdullah, Jane, or Jason)
3. Start chatting in real-time
4. Include "@" in any message to trigger an AI response
5. The AI assistant will respond based on recent chat history

## Project Structure

```
messaging-app/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom.js      # Main chat interface
│   │   │   └── UserSelection.js # User selection screen
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   └── index.js       # React entry point
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Frontend dependencies
└── README.md
```

## API Integration

The app integrates with OpenAI's GPT-4o model. When a message contains "@", the backend:
1. Retrieves the last 10 messages from MongoDB
2. Sends the chat history to OpenAI API
3. Returns the AI response to all connected users
4. Stores the AI response in MongoDB

## Mobile Support

The frontend is fully responsive and optimized for mobile devices with:
- Touch-friendly interface
- Responsive grid layout
- Mobile-optimized input fields
- Smooth scrolling message history