import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import api from '../axiosConfig';
import Lottie from 'lottie-react';
import waveBackground from '../assets/lottie/wave.json';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      console.log(res.data); // Log the response to check its content
      const { token, user } = res.data;
      if (!token || !user) {
        setError('Invalid credentials.');
        return;
      }
      localStorage.setItem('authToken', token);
      setAuthData(user);
      if (user.role === 'admin' || user.role === 'staff') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err); // Log the error to get more details
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left-img">
        <div className="auth-quote">
          <h1>Welcome Back!</h1>
          <p>Your journey to strength starts here.</p>
        </div>
      </div>

      <div className="auth-right-form">
        <div className="lottie-bg">
          <Lottie animationData={waveBackground} loop autoPlay />
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign In</button>
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
