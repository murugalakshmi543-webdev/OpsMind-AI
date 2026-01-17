import Login from './components/login.js';
import Dashboard from './components/dashboard.js';

class App {
    constructor() {
        this.state = {
            user: null,
            currentView: 'login'
        };
        
        this.init();
    }
    
    async init() {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.state.user = data.user;
                    this.state.currentView = 'dashboard';
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                localStorage.removeItem('token');
            }
        }
        
        this.render();
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
    
    render() {
        const app = document.getElementById('app');
        
        if (this.state.currentView === 'login') {
            app.innerHTML = Login(this);
        } else if (this.state.currentView === 'dashboard') {
            app.innerHTML = Dashboard(this);
            // Initialize dashboard components
            setTimeout(() => this.initDashboard(), 0);
        }
    }
    
    initDashboard() {
        // Initialize dashboard functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                this.setState({ user: null, currentView: 'login' });
            });
        }
    }
}

// Start the app
new App();