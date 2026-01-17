import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaLink, FaSpinner } from 'react-icons/fa';
import { sendQuery } from '../services/api';

const Chat = ({ isAdmin }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: `Hello! I'm your OpsMind AI assistant. I can help you find information from the Standard Operating Procedures. ${isAdmin ? 'You can upload new SOP documents or ask me questions about existing ones.' : 'Please ask me anything about the company SOPs.'}`,
            timestamp: new Date(),
            sources: []
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleSend = async () => {
        if (!input.trim() || loading) return;
        
        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: input,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        
        try {
            const response = await sendQuery(input);
            
            const aiMessage = {
                id: messages.length + 2,
                type: 'ai',
                content: response.answer,
                timestamp: new Date(),
                sources: response.sources || []
            };
            
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            
            const errorMessage = {
                id: messages.length + 2,
                type: 'ai',
                content: 'Sorry, I encountered an error processing your request. Please try again.',
                timestamp: new Date(),
                sources: []
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    return (
        <div className="chat-container">
            {/* Chat Messages */}
            <div className="chat-messages">
                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`message ${message.type}-message`}
                    >
                        <div className="message-header">
                            <div className="message-avatar">
                                {message.type === 'user' ? <FaUser /> : <FaRobot />}
                            </div>
                            <div className="message-meta">
                                <span className="message-sender">
                                    {message.type === 'user' ? 'You' : 'OpsMind AI'}
                                </span>
                                <span className="message-time">
                                    {message.timestamp.toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </span>
                            </div>
                        </div>
                        
                        <div className="message-content">
                            {message.content}
                        </div>
                        
                        {message.sources && message.sources.length > 0 && (
                            <div className="sources">
                                <h4>
                                    <FaLink /> Sources
                                </h4>
                                {message.sources.map((source, index) => (
                                    <div key={index} className="source-item">
                                        <strong>{source.filename}</strong> (Page {source.pageNumber})<br />
                                        {source.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                
                {loading && (
                    <div className="message ai-message">
                        <div className="message-header">
                            <div className="message-avatar">
                                <FaRobot />
                            </div>
                            <div className="message-meta">
                                <span className="message-sender">OpsMind AI</span>
                            </div>
                        </div>
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                
                <div ref={chatEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about SOPs (e.g., 'How do I process a refund?')"
                    disabled={loading}
                />
                <button 
                    className="send-btn" 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                >
                    {loading ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
                </button>
            </div>
        </div>
    );
};

// Add Chat styles
const chatStyles = `
    .chat-container {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    
    .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: var(--secondary);
        border-radius: var(--radius);
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-height: 400px;
    }
    
    .message {
        max-width: 80%;
        padding: 20px;
        border-radius: 18px;
        animation: messageAppear 0.3s ease-out;
    }
    
    @keyframes messageAppear {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .user-message {
        align-self: flex-end;
        background: linear-gradient(135deg, var(--primary), #3498db);
        color: white;
        border-bottom-right-radius: 5px;
    }
    
    .ai-message {
        align-self: flex-start;
        background: white;
        color: var(--text);
        border-bottom-left-radius: 5px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .message-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
    }
    
    .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
    }
    
    .user-message .message-avatar {
        background: white;
        color: var(--primary);
    }
    
    .message-meta {
        display: flex;
        flex-direction: column;
    }
    
    .message-sender {
        font-weight: 600;
        font-size: 14px;
    }
    
    .message-time {
        font-size: 11px;
        opacity: 0.7;
    }
    
    .user-message .message-sender,
    .user-message .message-time {
        color: rgba(255, 255, 255, 0.9);
    }
    
    .message-content {
        line-height: 1.6;
        margin-bottom: 10px;
    }
    
    .sources {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .user-message .sources {
        border-top-color: rgba(255, 255, 255, 0.2);
    }
    
    .sources h4 {
        font-size: 13px;
        color: var(--text-light);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .user-message .sources h4 {
        color: rgba(255, 255, 255, 0.9);
    }
    
    .source-item {
        font-size: 12px;
        color: var(--text-light);
        padding: 8px;
        background: var(--secondary);
        border-radius: 6px;
        margin-bottom: 5px;
        border-left: 3px solid var(--primary);
    }
    
    .user-message .source-item {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
        border-left-color: white;
    }
    
    .chat-input {
        display: flex;
        gap: 10px;
    }
    
    .chat-input input {
        flex: 1;
        padding: 15px 20px;
        border: 2px solid var(--border);
        border-radius: 25px;
        font-size: 15px;
        transition: var(--transition);
        background: var(--secondary);
    }
    
    .chat-input input:focus {
        outline: none;
        border-color: var(--primary);
    }
    
    .send-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), #3498db);
        color: white;
        border: none;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .send-btn:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(93, 181, 222, 0.3);
    }
    
    .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .typing-indicator {
        display: flex;
        gap: 5px;
        padding: 10px 0;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: var(--primary);
        border-radius: 50%;
        animation: typing 1.4s infinite;
    }
    
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
    }
    
    @media (max-width: 768px) {
        .message {
            max-width: 90%;
        }
        
        .chat-messages {
            max-height: 300px;
        }
    }
`;

// Add styles to document
const chatStyleSheet = document.createElement("style");
chatStyleSheet.textContent = chatStyles;
document.head.appendChild(chatStyleSheet);

export default Chat;