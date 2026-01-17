import React, { useState } from 'react';
import { FaCloudUploadAlt, FaFilePdf, FaUpload } from 'react-icons/fa';
import { uploadDocument } from '../services/api';

const AdminPanel = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a PDF file');
        }
    };
    
    const handleUpload = async () => {
        if (!file) {
            setError('Please select a PDF file first');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }
        
        setUploading(true);
        setError('');
        setSuccess('');
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await uploadDocument(formData);
            
            if (response.success) {
                setSuccess('Document uploaded and processed successfully!');
                setFile(null);
                document.getElementById('fileInput').value = '';
                onUpload();
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(response.message || 'Upload failed');
            }
        } catch (err) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div className="admin-panel">
            {/* Upload Area */}
            <div 
                className="upload-area" 
                onClick={() => document.getElementById('fileInput').click()}
                style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
            >
                {file ? (
                    <>
                        <div className="upload-icon">
                            <FaFilePdf />
                        </div>
                        <p>{file.name}</p>
                        <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                    </>
                ) : (
                    <>
                        <div className="upload-icon">
                            <FaCloudUploadAlt />
                        </div>
                        <p>Drag & drop SOP PDF files here</p>
                        <small>or click to browse (Max 10MB)</small>
                    </>
                )}
                <input 
                    type="file" 
                    id="fileInput" 
                    className="file-input" 
                    accept=".pdf" 
                    onChange={handleFileSelect}
                    disabled={uploading}
                />
            </div>
            
            {/* Messages */}
            {error && (
                <div className="error-message" style={{ margin: '15px 0' }}>
                    <FaFilePdf />
                    {error}
                </div>
            )}
            
            {success && (
                <div className="success-message" style={{ margin: '15px 0' }}>
                    <FaUpload />
                    {success}
                </div>
            )}
            
            {/* Upload Button */}
            <button 
                className="btn btn-primary upload-btn" 
                onClick={handleUpload}
                disabled={uploading || !file}
                style={{ maxWidth: '200px', alignSelf: 'center', marginTop: '15px' }}
            >
                {uploading ? (
                    <>
                        <div className="spinner"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <FaUpload />
                        Upload & Process
                    </>
                )}
            </button>
        </div>
    );
};

// Add styles for AdminPanel
const adminPanelStyles = `
    .admin-panel {
        display: flex;
        flex-direction: column;
    }
    
    .upload-area {
        border: 3px dashed var(--border);
        border-radius: var(--radius);
        padding: 40px 20px;
        text-align: center;
        transition: var(--transition);
        margin-bottom: 20px;
    }
    
    .upload-area:hover {
        border-color: var(--primary);
        background: var(--secondary);
    }
    
    .upload-icon {
        font-size: 48px;
        color: var(--primary);
        margin-bottom: 15px;
    }
    
    .upload-area p {
        color: var(--text-light);
        margin-bottom: 10px;
    }
    
    .upload-area small {
        color: var(--text-light);
        font-size: 13px;
    }
    
    .file-input {
        display: none;
    }
`;

// Add styles to document
const adminStyleSheet = document.createElement("style");
adminStyleSheet.textContent = adminPanelStyles;
document.head.appendChild(adminStyleSheet);

export default AdminPanel;