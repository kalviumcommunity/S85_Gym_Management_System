import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Font Awesome CDN (make sure it's in your index.html or public/index.html)
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-left">
          <h1>Welcome to IronCore Fitness 💪</h1>
          <p>Powerful gym management made simple. Track members, monitor progress, and manage data in one place.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/add')}>➕ Add Member</button>
            <button onClick={() => navigate('/members')}>📋 View Members</button>
          </div>
        </div>
        <div className="hero-right">
          <img
            src="https://media.istockphoto.com/id/1925398083/photo/3d-render-gym-fitness-wellness-center.webp?a=1&b=1&s=612x612&w=0&k=20&c=IvMQVRJsAHi6pe1dPmk6n_Uq7ctB6UlQutOmLO8UbG4="
            alt="Gym Illustration"
          />
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <h2>✨ Why IronCore?</h2>
        <div className="features-grid">
          <div className="feature-card">📊 Member Analytics</div>
          <div className="feature-card">🔒 Secure & Private</div>
          <div className="feature-card">📁 Organized Records</div>
          <div className="feature-card">🚀 Fast Performance</div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="stats-section">
        <div className="stat-box">
          <h3>1K+</h3>
          <p>Active Members</p>
        </div>
        <div className="stat-box">
          <h3>50+</h3>
          <p>Gyms Using IronCore</p>
        </div>
        <div className="stat-box">
          <h3>99.9%</h3>
          <p>Uptime Guaranteed</p>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="testimonials-section">
        <h2>💬 What Our Clients Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>"IronCore made managing my gym 10x easier!"</p>
            <span>- Madhav, Gym Owner</span>
          </div>
          <div className="testimonial">
            <p>"The UI is clean, and it's super fast. Love it!"</p>
            <span>- Sneha, Admin</span>
          </div>
          <div className="testimonial">
            <p>"Professional and simple – exactly what we needed."</p>
            <span>- Tanmay, Franchise Manager</span>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="cta-section">
        <h2>Ready to Transform Your Gym Management?</h2>
        <button onClick={() => navigate('/add')}>🚀 Get Started Now</button>

        {/* SOCIAL ICONS */}
        <div className="social-links">
          <a href="https://www.instagram.com/madhavgarg.?igsh=MWk5eTUzeGVvajU1Ng==" target="_blank" rel="noreferrer" className="social-icon instagram" title="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/in/madhav-garg-b447b5324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" className="social-icon linkedin" title="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://github.com/MadhavGarg98" target="_blank" rel="noreferrer" className="social-icon github" title="GitHub">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="home-footer">
        © {new Date().getFullYear()} IronCore Fitness | Built with ❤️ by Madhav Garg
      </footer>
    </div>
  );
};

export default Home;
