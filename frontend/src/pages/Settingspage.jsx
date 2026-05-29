import React, { useState } from 'react';
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import { LuChevronDown } from "react-icons/lu";
import { RiStackLine, RiCoinsLine, RiShieldFlashLine } from 'react-icons/ri';
import "../styles/pages/settings.css";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Profile'); 
  const tabs = ['Profile', 'Security', 'Billings', 'Notifications'];

  // Profile Form States 
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+234'
  });

  // Security View State 
  const [securityData, setSecurityData] = useState({
    email: 'Mike_john@gmail.com',
    twoFactor: true,
    phoneNumber: '+234 908 765 4321',
    phoneName: 'Mike John'
  });

  const [sessions] = useState([
    { id: 1, device: 'DESKTOP-6TIG6EC', location: 'Lagos, Nigeria', browser: 'Chrome', active: true, time: 'Used right now' },
    { id: 2, device: 'Iphone 15 pro', location: 'Lagos, Nigeria', browser: 'Chrome', active: false, time: '07/05/2026' }
  ]);

  // Billings State
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const plans = [
    {
      id: 'basic',
      title: 'Basic plan $10/month',
      desc: 'Includes up to 10 users, 20GB individual data and access to all features.',
      icon: RiCoinsLine
    },
    {
      id: 'business',
      title: 'Business plan $20/month',
      desc: 'Includes up to 20 users, 40GB individual data and access to all features.',
      icon: RiStackLine
    },
    {
      id: 'enterprise',
      title: 'Enterprise plan $40/month',
      desc: 'Unlimited users, unlimited individual data and access to all features.',
      icon: RiShieldFlashLine
    }
  ];

  // Notifications State 
  const [notifs, setNotifs] = useState({
    news: true,
    tips: false,
    emailReminders: true,
    comments: true,
    pushReminders: true
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const toggleNotif = (key) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTwoFactor = () => {
    setSecurityData(prev => ({ ...prev, twoFactor: !prev.twoFactor }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profile configurations updated successfully.');
  };

  return (
    <div className="settings-wrapper">
      <Sidebar />
      <main className="settings-main">
        <Navbar />
        <div className="settings-content">
          <h1 className="page-title">Settings</h1>

          {/* Sub Tab Navigation Header */}
          <div className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="settings-card">
            
            {/* --- 1. PROFILE TAB CONTENT --- */}
            {activeTab === 'Profile' && (
              <div className="profile-view">
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-grid">
                    
                    <div className="form-group">
                      <label>First Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        name="firstName" 
                        placeholder="First Name"
                        value={profileData.firstName} 
                        onChange={handleProfileChange} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Last Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        name="lastName" 
                        placeholder="Last Name"
                        value={profileData.lastName} 
                        onChange={handleProfileChange} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Example@email.com"
                        value={profileData.email} 
                        onChange={handleProfileChange} 
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number <span className="required">*</span></label>
                      <div className="phone-input-container">
                        <div className="country-selector">
                          <span className="flag-icon">🇳🇬</span>
                          <LuChevronDown className="dropdown-arrow" />
                          <span className="country-code">{profileData.countryCode}</span>
                        </div>
                        <input 
                          type="tel" 
                          name="phoneNumber" 
                          value={profileData.phoneNumber} 
                          onChange={handleProfileChange} 
                          required 
                        />
                      </div>
                    </div>

                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Update</button>
                  </div>
                </form>
              </div>
            )}

            {/* --- 2. SECURITY TAB CONTENT --- */}
            {activeTab === 'Security' && (
              <div className="security-view">
                <div className="security-rows-container">
                  
                  <div className="security-item-row">
                    <span className="row-label">Email</span>
                    <span className="row-value">{securityData.email}</span>
                  </div>

                  <div className="security-item-row">
                    <span className="row-label">Password</span>
                    <button type="button" className="change-pwd-btn">Change password</button>
                  </div>

                  <div className="security-item-row">
                    <span className="row-label">2-FA authentification</span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={securityData.twoFactor} 
                        onChange={toggleTwoFactor} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="security-item-row">
                    <span className="row-label">Phone Number</span>
                    <span className="row-value">{securityData.phoneNumber}</span>
                  </div>

                  <div className="security-item-row">
                    <span className="row-label">Phone Name</span>
                    <span className="row-value">{securityData.phoneName}</span>
                  </div>

                </div>

                <div className="sessions-section">
                  <div className="sessions-header">
                    <h3>Total active sessions ({sessions.length + 3})</h3>
                    <button type="button" className="see-all-btn">See all</button>
                  </div>
                  
                  <div className="sessions-list">
                    {sessions.map((session) => (
                      <div key={session.id} className="session-item">
                        <div className="session-device-info">
                          {session.device} • {session.location}
                        </div>
                        <div className="session-meta">
                          {session.browser} • {session.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="reset-sessions-btn">Reset all active sessions</button>
                  </div>
                </div>
              </div>
            )}

            {/* --- 3. BILLINGS TAB CONTENT  --- */}
            {activeTab === 'Billings' && (
              <div className="billings-view">
                <div className="section-intro">
                  <h2>Account plans</h2>
                  <p>Manage your subscription, explore available plans, and choose the features that fit your needs.</p>
                </div>

                <hr className="divider-line" />

                <div className="billings-layout-grid">
                  <div className="current-plan-summary">
                    <h3>Current plan</h3>
                    <p>Manage your subscription, explore available plans, and choose the features that fit your needs.</p>
                  </div>

                  <div className="plans-selection-list">
                    {plans.map((plan) => {
                      const Icon = plan.icon;
                      return (
                        <div 
                          key={plan.id} 
                          className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <div className="plan-icon-box">
                            <Icon />
                          </div>
                          <div className="plan-card-details">
                            <h4>{plan.title}</h4>
                            <p>{plan.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* --- 4. NOTIFICATIONS TAB CONTENT --- */}
            {activeTab === 'Notifications' && (
              <div className="notifications-view">
                
                {/* Email Stack Group */}
                <div className="notif-block-grid">
                  <div className="notif-meta-desc">
                    <h2>Email notifications</h2>
                    <p>Enable email alerts for low stock, reminders, and important updates.</p>
                  </div>
                  
                  <div className="notif-toggles-stack">
                    <div className="toggle-row-item">
                      <label className="toggle-switch">
                        <input type="checkbox" checked={notifs.news} onChange={() => toggleNotif('news')} />
                        <span className="toggle-slider"></span>
                      </label>
                      <div className="toggle-item-text">
                        <h4>News and updates</h4>
                        <p>Receive updates about new features, system improvements, and important product news.</p>
                      </div>
                    </div>

                    <div className="toggle-row-item">
                      <label className="toggle-switch">
                        <input type="checkbox" checked={notifs.tips} onChange={() => toggleNotif('tips')} />
                        <span className="toggle-slider"></span>
                      </label>
                      <div className="toggle-item-text">
                        <h4>Tips and tutorials</h4>
                        <p>Get useful tips and step-by-step tutorials to help you manage your inventory better.</p>
                      </div>
                    </div>

                    <div className="toggle-row-item">
                      <label className="toggle-switch">
                        <input type="checkbox" checked={notifs.emailReminders} onChange={() => toggleNotif('emailReminders')} />
                        <span className="toggle-slider"></span>
                      </label>
                      <div className="toggle-item-text">
                        <h4>Reminders</h4>
                        <p>Enable reminders to help you manage tasks, restocking, and daily inventory operations.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="divider-line" />

                {/* Push Stack Group */}
                <div className="notif-block-grid">
                  <div className="notif-meta-desc">
                    <h2>Push notifications</h2>
                    <p>Enable push notifications to receive timely alerts and important inventory updates.</p>
                  </div>

                  <div className="notif-toggles-stack">
                    <div className="toggle-row-item">
                      <label className="toggle-switch">
                        <input type="checkbox" checked={notifs.comments} onChange={() => toggleNotif('comments')} />
                        <span className="toggle-slider"></span>
                      </label>
                      <div className="toggle-item-text">
                        <h4>Comments</h4>
                        <p>Enable notifications for comments, replies, and activity discussions.</p>
                      </div>
                    </div>

                    <div className="toggle-row-item">
                      <label className="toggle-switch">
                        <input type="checkbox" checked={notifs.pushReminders} onChange={() => toggleNotif('pushReminders')} />
                        <span className="toggle-slider"></span>
                      </label>
                      <div className="toggle-item-text">
                        <h4>Reminders</h4>
                        <p>Enable push reminders to stay updated on tasks, stock checks, and important activities.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;