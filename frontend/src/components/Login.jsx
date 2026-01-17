import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBrain, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { login } from '../services/auth';

const Login = ({ setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        // Auto-fill email if passed from registration
        if (location.state?.email) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
        }
    }, [location.state]);
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }
        
        setLoading(true);
        
        try {
            const user = await login(formData.email, formData.password);
            setUser(user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo">
                    <FaBrain className="logo-icon" />
                    <h1>OpsMind AI</h1>
                </div>
                
                <p className="tagline">Enterprise SOP Knowledge Brain</p>
                
                {error && (
                    <div className="error-message">
                        <FaSignInAlt />
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Logging in...
                            </>
                        ) : (
                            <>
                                <FaSignInAlt />
                                Login to Dashboard
                            </>
                        )}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register">
                            <FaUserPlus /> Register here
                        </Link>
                    </p>
                    
                    <p style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>
                        <FaSignInAlt /> Use <strong>vijaykarthik2512@gmail.com</strong> for admin access
                    </p>
                    
                    <div style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                            <strong>Demo Credentials:</strong><br />
                            Admin: vijaykarthik2512@gmail.com / admin123<br />
                            User: test@example.com / test123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;