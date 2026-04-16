import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [rememberMe, setRememberMe] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    district: '',
    password: '',
    confirmPassword: ''
  });

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    const strengthLevels = [
      { score: 0, label: 'Too Weak', color: '#e53935' },
      { score: 1, label: 'Weak', color: '#fb8c00' },
      { score: 2, label: 'Fair', color: '#ffb300' },
      { score: 3, label: 'Good', color: '#52b788' },
      { score: 4, label: 'Strong', color: '#1b4332' },
      { score: 5, label: 'Very Strong', color: '#081c15' }
    ];

    return strengthLevels[Math.min(score, 5)];
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginForm.email.trim()) newErrors.email = 'Email or phone is required';
    if (!loginForm.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = () => {
    const newErrors = {};
    if (!signupForm.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!signupForm.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!signupForm.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!signupForm.email.trim()) newErrors.email = 'Email is required';
    if (!signupForm.district) newErrors.district = 'Please select a district';
    if (!signupForm.password.trim()) newErrors.password = 'Password is required';
    if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    setLoadingLogin(true);
    setTimeout(() => {
      setLoadingLogin(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSignup = async () => {
    if (!validateSignupForm()) return;
    setLoadingSignup(true);
    setTimeout(() => {
      setLoadingSignup(false);
      navigate('/dashboard');
    }, 1500);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setPasswordStrength({ score: 0, label: '', color: '' });
  };

  return (
    <div id="login">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="ll-blob-1"></div>
        <div className="ll-blob-2"></div>

        <div className="ll-brand fade-up">
          <div className="ll-mark">KD</div>
          <div>
            <div className="ll-name">Kerala Disaster Management</div>
            <div className="ll-sub">Public Information Portal</div>
          </div>
        </div>

        <div className="ll-hero fade-up-1">
          <h2 className="ll-h1">Your safety,<br />our <span>priority.</span></h2>
          <p className="ll-p">Sign in to access real-time alerts, track your SOS requests, find shelters and stay protected during disasters across Kerala.</p>
          
          <div className="ll-features">
            <div className="ll-feat fade-up-2">
              <div className="ll-feat-icon">🔔</div>
              <div className="ll-feat-text"><strong>Live alerts</strong> for your district — floods, landslides, cyclones</div>
            </div>
            <div className="ll-feat fade-up-2">
              <div className="ll-feat-icon">🆘</div>
              <div className="ll-feat-text"><strong>One-tap SOS</strong> with real-time rescue team tracking</div>
            </div>
            <div className="ll-feat fade-up-2">
              <div className="ll-feat-icon">⛺</div>
              <div className="ll-feat-text"><strong>Shelter finder</strong> with live capacity and directions</div>
            </div>
            <div className="ll-feat fade-up-2">
              <div className="ll-feat-icon">🌧️</div>
              <div className="ll-feat-text"><strong>Weather intelligence</strong> with 5-day district forecast</div>
            </div>
          </div>

          <div className="ll-dist-strip fade-up-3">
            <div className="ll-dist lld-red">⚠ Wayanad · Critical</div>
            <div className="ll-dist lld-red">⚠ Idukki · High</div>
            <div className="ll-dist lld-amber">⚡ Malappuram · Moderate</div>
            <div className="ll-dist lld-green">✓ TVM · Safe</div>
          </div>
        </div>

        <div className="ll-bottom fade-up-4">
          <div style={{ marginBottom: '6px' }}>Emergency Helplines: Fire 101 · Police 100 · Ambulance 108 · KSNDMC <strong style={{ color: 'var(--lime)' }}>1077</strong></div>
          <div style={{ cursor: 'pointer', color: 'rgba(255,255,255,.4)' }} onClick={() => navigate('/')}>← Back to Home</div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-form-wrap">
          <button className="login-back-btn" onClick={() => navigate('/')} title="Back to Landing">← Back</button>
          {/* TABS */}
          <div className="login-tabs">
            <div 
              className={`ltab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </div>
            <div 
              className={`ltab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              Sign Up
            </div>
          </div>

          {/* LOGIN FORM */}
          <div className={`form-panel ${activeTab === 'login' ? 'active' : ''}`}>
            <div className="form-title">Welcome back</div>
            <div className="form-sub">Sign in to your disaster management account</div>
            
            <div className="form-group">
              <label className="form-label">Email / Phone Number</label>
              <div className="form-input-wrapper">
                <input 
                  className={`form-input ${errors.email ? 'error' : ''}`} 
                  type="text" 
                  name="email"
                  placeholder="Enter email or phone" 
                  value={loginForm.email}
                  onChange={handleLoginChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <input 
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type="password" 
                  name="password"
                  placeholder="Enter your password" 
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
            </div>

            <div className="form-checkbox">
              <input 
                type="checkbox" 
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            
            <div className="forgot-link">Forgot Password?</div>
            
            <button className={`btn-submit ${loadingLogin ? 'loading' : ''}`} onClick={handleLogin} disabled={loadingLogin}>
              {loadingLogin ? <span className="btn-spinner"></span> : null}
              {loadingLogin ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
            
            <div className="divider">
              <div className="div-line"></div>
              <div className="div-text">or continue with</div>
              <div className="div-line"></div>
            </div>
            
            <div className="social-btns">
              <button className="social-btn" onClick={handleLogin}>🌐 Google</button>
              <button className="social-btn" onClick={handleLogin}>📱 Phone OTP</button>
            </div>
            
            <div className="form-alt">Don't have an account? <span onClick={() => switchTab('signup')}>Sign Up Free</span></div>
          </div>

          {/* SIGNUP FORM */}
          <div className={`form-panel ${activeTab === 'signup' ? 'active' : ''}`}>
            <div className="form-title">Create account</div>
            <div className="form-sub">Register to receive alerts and access all features</div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="form-input-wrapper">
                  <input 
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    type="text" 
                    name="firstName"
                    placeholder="First name" 
                    value={signupForm.firstName}
                    onChange={handleSignupChange}
                  />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="form-input-wrapper">
                  <input 
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    type="text" 
                    name="lastName"
                    placeholder="Last name" 
                    value={signupForm.lastName}
                    onChange={handleSignupChange}
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="form-input-wrapper">
                <input 
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  type="tel" 
                  name="phone"
                  placeholder="+91 XXXXX XXXXX" 
                  value={signupForm.phone}
                  onChange={handleSignupChange}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <input 
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email" 
                  name="email"
                  placeholder="your@email.com" 
                  value={signupForm.email}
                  onChange={handleSignupChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Your District</label>
              <div className="form-input-wrapper">
                <select 
                  className={`form-select ${errors.district ? 'error' : ''}`}
                  name="district"
                  value={signupForm.district}
                  onChange={handleSignupChange}
                >
                  <option value="">Select your district</option>
                  <option>Wayanad</option>
                  <option>Idukki</option>
                  <option>Malappuram</option>
                  <option>Kozhikode</option>
                  <option>Thrissur</option>
                  <option>Ernakulam</option>
                  <option>Kottayam</option>
                  <option>Kollam</option>
                  <option>Thiruvananthapuram</option>
                  <option>Palakkad</option>
                  <option>Alappuzha</option>
                  <option>Kannur</option>
                  <option>Kasaragod</option>
                  <option>Pathanamthitta</option>
                </select>
                {errors.district && <span className="form-error">{errors.district}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <input 
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type="password" 
                  name="password"
                  placeholder="Create a strong password" 
                  value={signupForm.password}
                  onChange={handleSignupChange}
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              {signupForm.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: `${(passwordStrength.score + 1) * 20}%`, background: passwordStrength.color }}></div>
                  </div>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="form-input-wrapper">
                <input 
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  type="password" 
                  name="confirmPassword"
                  placeholder="Re-enter password" 
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>
            
            <button className={`btn-submit ${loadingSignup ? 'loading' : ''}`} onClick={handleSignup} disabled={loadingSignup}>
              {loadingSignup ? <span className="btn-spinner"></span> : null}
              {loadingSignup ? 'Creating account...' : 'Create Account & Continue'}
            </button>
            
            <div className="form-alt">Already have an account? <span onClick={() => switchTab('login')}>Sign In</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
