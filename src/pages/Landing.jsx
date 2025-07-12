import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/main.css';

export default function Landing() {
  return (
    <div className="landing-container">
      {/* Animated background */}
      <div className="landing-bg">
        <div className="bg-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <nav className="landing-nav">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="nav-brand"
        >
          <div className="brand-icon">💰</div>
        <h1 className="logo">FinTrack</h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="nav-links"
        >
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link primary">Get Started</Link>
        </motion.div>
      </nav>
      
      <main className="landing-main">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero"
        >
          <div className="hero-content">
            <h1 className="hero-title">
              Master Your <span className="accent">Financial Future</span>
            </h1>
            <p className="hero-subtitle">
              Transform your spending habits with intelligent expense tracking, 
              beautiful visualizations, and actionable insights that help you 
              achieve your financial goals.
            </p>
          <div className="hero-cta">
              <Link to="/signup" className="btn btn-primary btn-hero">
                <span>🚀</span>
                Start Your Journey
              </Link>
              <Link to="/login" className="btn btn-secondary btn-hero">
                <span>🔐</span>
                Sign In
              </Link>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-visual"
          >
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dot red"></div>
                <div className="preview-dot yellow"></div>
                <div className="preview-dot green"></div>
              </div>
              <div className="preview-content">
                <div className="preview-chart">
                  <div className="chart-bar bar-1"></div>
                  <div className="chart-bar bar-2"></div>
                  <div className="chart-bar bar-3"></div>
                  <div className="chart-bar bar-4"></div>
                </div>
                <div className="preview-stats">
                  <div className="stat-item">
                    <div className="stat-icon">📊</div>
                    <div className="stat-text">Smart Analytics</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">💡</div>
                    <div className="stat-text">Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="features"
        >
          <div className="features-header">
            <h2>Why Choose FinTrack?</h2>
            <p>Everything you need to take control of your finances</p>
          </div>
          
          <div className="features-grid">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon">📊</div>
              <h3>Smart Expense Tracking</h3>
              <p>Log and categorize every transaction with intelligent auto-suggestions and smart categorization.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="feature-card"
            >
            <div className="feature-icon">📈</div>
              <h3>Beautiful Analytics</h3>
              <p>Understand your spending patterns with stunning charts, graphs, and detailed financial reports.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon">🎯</div>
              <h3>Goal Setting</h3>
              <p>Set financial goals and track your progress with personalized insights and recommendations.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon">📱</div>
              <h3>Mobile First</h3>
              <p>Access your finances anywhere with our responsive design that works perfectly on all devices.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your financial data is protected with bank-level security and complete privacy controls.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Experience blazing fast performance with instant updates and real-time synchronization.</p>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <footer className="simple-footer">
        <p>Made by Jasleen</p>
      </footer>
    </div>
  );
}