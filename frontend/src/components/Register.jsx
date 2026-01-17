import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain, FaUserPlus, FaCrown, FaCheckCircle, FaExclamationTriangle, FaSignInAlt } from 'react-icons/fa';
import { register } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const isAdminEmail = formData.email === 'vijaykarthik2512@gmail.com';
    
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
        setSuccess('');
        
        // Validation
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await register(formData.email, formData.password);
            
            if (response.success) {
                setSuccess(`Registration successful! You are registered as ${response.user.role === 'admin' ? 'Administrator' : 'User'}. Redirecting to login...`);
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login', { state: { email: formData.email } });
                }, 2000);
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.message || 'Network error. Please try again.');
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
                
                <p className="tagline">Create your Enterprise SOP Agent account</p>
                
                {/* Role Information */}
                <div className="role-info" style={{ borderLeftColor: isAdminEmail ? '#ff6b6b' : '#5db5de' }}>
                    <h4>
                        {isAdminEmail ? (
                            <>
                                <FaCrown /> Admin Account Detected
                            </>
                        ) : (
                            <>
                                <FaUserPlus /> User Account
                            </>
                        )}
                    </h4>
                    <p>
                        {isAdminEmail ? (
                            <>
                                You are registering as an <strong>Administrator</strong>. You will have access to:
                                <ul>
                                    <li>Upload and manage SOP documents</li>
                                    <li>Delete uploaded files</li>
                                    <li>View all user statistics</li>
                                    <li>System configuration</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                You are registering as a <strong>Regular User</strong>. You can:
                                <ul>
                                    <li>Ask questions about SOPs</li>
                                    <li>Get AI-powered answers with citations</li>
                                    <li>View conversation history</li>
                                </ul>
                            </>
                        )}
                    </p>
                </div>
                
                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <FaExclamationTriangle />
                        {error}
                    </div>
                )}
                
                {/* Success Message */}
                {success && (
                    <div className="success-message">
                        <FaCheckCircle />
                        {success}
                    </div>
                )}
                
                {/* Registration Form */}
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
                        <small className="form-text">
                            Use <strong>vijaykarthik2512@gmail.com</strong> for admin privileges
                        </small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Minimum 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
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
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <FaUserPlus />
                                Create Account
                            </>
                        )}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">
                            <FaSignInAlt /> Login here
                        </Link>
                    </p>
                    
                    <p style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>
                        <FaExclamationTriangle /> By registering, you agree to our Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;