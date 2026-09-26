import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, User, Search, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.io
    socketRef.current = io(window.location.origin.replace('5173', '5000'));
    
    if (user) {
      socketRef.current.emit('join', user.id);
    }

    socketRef.current.on('receive_message', (data) => {
      if (activeChat && (data.sender_id === activeChat.user_id)) {
        setMessages(prev => [...prev, data]);
      }
      // Refresh conversations to update last message/order
      fetchConversations();
    });

    fetchConversations();

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/chat/conversations');
      setConversations(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations', err);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const res = await axios.get(`/api/chat/${otherUserId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages', err);
    }
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    fetchMessages(chat.user_id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      receiver_id: activeChat.user_id,
      message: newMessage,
      sender_id: user.id,
      created_at: new Date().toISOString()
    };

    try {
      await axios.post('/api/chat', messageData);
      socketRef.current.emit('send_message', messageData);
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-100px)]">
      <div className="glass rounded-3xl shadow-2xl flex overflow-hidden h-full border border-white/20">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-white/30 backdrop-blur-md">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <MessageSquare className="text-primary-600" />
              <span>Messages</span>
            </h2>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-2xl"></div>)}
              </div>
            ) : (
              conversations.map(chat => (
                <button
                  key={chat.user_id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-white/50 transition-all ${
                    activeChat?.user_id === chat.user_id ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-gray-800 truncate">{chat.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{chat.role}</p>
                  </div>
                </button>
              ))
            )}
            {!loading && conversations.length === 0 && (
              <div className="p-8 text-center text-gray-400 font-medium">
                No active conversations yet.
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/10">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 bg-white/50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {activeChat.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{activeChat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i}
                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-3xl text-sm shadow-sm ${
                      msg.sender_id === user.id 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.message}
                      <p className={`text-[9px] mt-1 font-bold ${msg.sender_id === user.id ? 'text-primary-100' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white/50 border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="p-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Your Inbox</h3>
              <p className="max-w-xs text-center mt-2 font-medium">Select a conversation from the sidebar to start direct direct messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
