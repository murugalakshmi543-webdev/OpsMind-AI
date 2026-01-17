import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaSignOutAlt, FaUpload, FaRobot, FaFilePdf, FaCube, FaCrown, FaUser } from 'react-icons/fa';
import AdminPanel from './AdminPanel';
import Chat from './Chat';
import { logout } from '../services/auth';
import { getDocuments } from '../services/api';

const Dashboard = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const isAdmin = user?.role === 'admin';
    
    useEffect(() => {
        if (isAdmin) {
            fetchDocuments();
        }
    }, [isAdmin]);
    
    const fetchDocuments = async () => {
        try {
            const docs = await getDocuments();
            setDocuments(docs);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        setUser(null);
        navigate('/login');
    };
    
    const totalChunks = documents.reduce((sum, doc) => sum + (doc.totalChunks || 0), 0);
    
    // Inline styles for the component
    const dashboardStyles = `
        .dashboard {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        .navbar {
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            padding: 0 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .nav-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .nav-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--primary);
            text-decoration: none;
        }
        
        .nav-logo h2 {
            font-size: 22px;
            font-weight: 700;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), #3498db);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }
        
        .user-email {
            font-size: 14px;
            color: var(--text-light);
        }
        
        .logout-btn {
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: var(--transition);
        }
        
        .logout-btn:hover {
            background: var(--secondary);
            color: var(--accent);
        }
        
        .dashboard-content {
            flex: 1;
            padding: 30px;
            display: flex;
            flex-direction: column;
            gap: 30px;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
        }
        
        .welcome-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: var(--radius);
            animation: slideIn 0.6s ease-out;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .welcome-section h2 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .welcome-section p {
            opacity: 0.9;
            max-width: 600px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 20px;
            transition: var(--transition);
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--primary), #3498db);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
        }
        
        .stat-info h3 {
            font-size: 32px;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 5px;
        }
        
        .stat-info p {
            color: var(--text-light);
            font-size: 14px;
        }
        
        .upload-section, .chat-section {
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 30px;
            display: flex;
            flex-direction: column;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--secondary);
        }
        
        .section-header h3 {
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .documents-list {
            margin-top: 20px;
            flex: 1;
        }
        
        .document-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            border: 1px solid var(--border);
            border-radius: 8px;
            margin-bottom: 10px;
            transition: var(--transition);
        }
        
        .document-item:hover {
            border-color: var(--primary);
            background: var(--secondary);
        }
        
        .document-info h4 {
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .document-meta {
            display: flex;
            gap: 15px;
            font-size: 12px;
            color: var(--text-light);
        }
    `;

    // Add styles to document
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = dashboardStyles;
        document.head.appendChild(styleSheet);
        
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    return (
        <div className="dashboard">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-left">
                    <div className="nav-logo">
                        <FaBrain />
                        <h2>OpsMind AI</h2>
                    </div>
                </div>
                
                <div className="user-info">
                    <div className="user-avatar">
                        {isAdmin ? <FaCrown /> : <FaUser />}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: '#2c3e50' }}>
                            {isAdmin ? 'Administrator' : 'User'}
                        </div>
                        <div className="user-email">{user?.email}</div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt />
                    </button>
                </div>
            </nav>
            
            {/* Main Content */}
            <div className="dashboard-content">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <h2>Welcome back, {user?.email?.split('@')[0]}! 👋</h2>
                    <p>
                        {isAdmin 
                            ? 'Your intelligent SOP assistant is ready. Upload documents or ask questions about company procedures.'
                            : 'Ask me anything about the Standard Operating Procedures. I\'ll provide accurate answers with source citations.'
                        }
                    </p>
                </div>
                
                {/* Stats Grid */}
                {isAdmin && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaFilePdf />
                            </div>
                            <div className="stat-info">
                                <h3>{documents.length}</h3>
                                <p>SOP Documents</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaCube />
                            </div>
                            <div className="stat-info">
                                <h3>{totalChunks}</h3>
                                <p>Knowledge Chunks</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Main Grid */}
                <div className="main-content" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr',
                    gap: '30px',
                    flex: 1 
                }}>
                    {/* Admin Panel */}
                    {isAdmin && (
                        <div className="upload-section">
                            <div className="section-header">
                                <h3>
                                    <FaUpload /> Upload SOP Documents
                                </h3>
                            </div>
                            <AdminPanel onUpload={fetchDocuments} />
                            
                            {/* Documents List */}
                            <div className="documents-list">
                                <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>
                                    Uploaded Documents ({documents.length})
                                </h4>
                                {loading ? (
                                    <div className="loading">Loading documents...</div>
                                ) : documents.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>
                                        No documents uploaded yet
                                    </p>
                                ) : (
                                    documents.map(doc => (
                                        <div key={doc._id} className="document-item">
                                            <div className="document-info">
                                                <h4>{doc.originalName}</h4>
                                                <div className="document-meta">
                                                    <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                                    <span>{doc.totalChunks} chunks</span>
                                                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Chat Section */}
                    <div className="chat-section">
                        <div className="section-header">
                            <h3>
                                <FaRobot /> SOP Assistant
                            </h3>
                        </div>
                        <Chat isAdmin={isAdmin} />
                    </div>
                </div>
            </div>
            
            {/* Responsive styles */}
            <style>{`
                @media (max-width: 1024px) {
                    .main-content {
                        grid-template-columns: 1fr !important;
                    }
                }
                
                @media (max-width: 768px) {
                    .navbar {
                        padding: 0 15px;
                    }
                    
                    .dashboard-content {
                        padding: 15px;
                    }
                    
                    .upload-section, .chat-section {
                        padding: 20px;
                    }
                    
                    .message {
                        max-width: 90%;
                    }
                    
                    .chat-messages {
                        max-height: 300px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;