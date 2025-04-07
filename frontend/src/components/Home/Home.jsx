import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>🏋️‍♂️ Welcome to IronCore Fitness</h1>
      <p>Effortlessly manage your gym members and keep your records organized and updated.</p>

      <img
        src="https://media.istockphoto.com/id/1925398083/photo/3d-render-gym-fitness-wellness-center.webp?a=1&b=1&s=612x612&w=0&k=20&c=IvMQVRJsAHi6pe1dPmk6n_Uq7ctB6UlQutOmLO8UbG4="
        alt="Gym Illustration"
        className="home-image"
      />

      <div className="home-buttons">
        <button onClick={() => navigate('/add')}>➕ Add Member</button>
        <button onClick={() => navigate('/members')}>📋 View Members</button>
      </div>

      <footer className="home-footer">
        © {new Date().getFullYear()} Gym Management System | Built with 💪 by Madhav Garg
      </footer>
    </div>
  );
};

export default Home;
