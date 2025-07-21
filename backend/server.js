const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // <-- Add this line back

// The URL of your live frontend
const allowedOrigin = "https://larkgptfront.onrender.com";

// Configure CORS for Express
app.use(cors({
  origin: allowedOrigin
}));

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"]
  }
});
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/messaging-app');

const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  isAI: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const users = ['Abdullah', 'Jane', 'Jason', 'AI Assistant'];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (username) => {
    socket.username = username;
    socket.join('chat-room');
    
    Message.find().sort({ timestamp: -1 }).limit(50).then(messages => {
      socket.emit('message-history', messages.reverse());
    });
    
    socket.broadcast.to('chat-room').emit('user-joined', username);
  });

  socket.on('send-message', async (data) => {
    const { username, message } = data;
    
    const newMessage = new Message({
      username,
      message,
      timestamp: new Date()
    });
    
    await newMessage.save();
    
    io.to('chat-room').emit('receive-message', {
      username,
      message,
      timestamp: newMessage.timestamp,
      isAI: false
    });

    if (message.includes('@')) {
      try {
        const recentMessages = await Message.find()
          .sort({ timestamp: -1 })
          .limit(20);
        
        const chatHistory = recentMessages.reverse().map(msg => 
          `${msg.username}: ${msg.message}`
        ).join('\n');

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an AI assistant in a group chat with Abdullah, Jane, and Jason. You are an expert on Border Collies. The dog this group takes care of is a border collie female named Lark and is 5 years old. Pay attention to see if she has been fed and let out for a walk"
            },
            {
              role: "user",
              content: `Recent chat history:\n${chatHistory}\n\nPlease respond to the conversation above.`
            }
          ],
          max_tokens: 150
        });

        const aiResponse = completion.choices[0].message.content;
        
        const aiMessage = new Message({
          username: 'AI Assistant',
          message: aiResponse,
          timestamp: new Date(),
          isAI: true
        });
        
        await aiMessage.save();
        
        setTimeout(() => {
          io.to('chat-room').emit('receive-message', {
            username: 'AI Assistant',
            message: aiResponse,
            timestamp: aiMessage.timestamp,
            isAI: true
          });
        }, 1000);
        
      } catch (error) {
        console.error('OpenAI API error:', error);
        
        const errorMessage = new Message({
          username: 'AI Assistant',
          message: 'Sorry, I encountered an error while processing your message.',
          timestamp: new Date(),
          isAI: true
        });
        
        await errorMessage.save();
        
        io.to('chat-room').emit('receive-message', {
          username: 'AI Assistant',
          message: 'Sorry, I encountered an error while processing your message.',
          timestamp: errorMessage.timestamp,
          isAI: true
        });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.username) {
      socket.broadcast.to('chat-room').emit('user-left', socket.username);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
